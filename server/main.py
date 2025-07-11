import os
import ast
import pandas as pd
from dotenv import load_dotenv
from products import router as products_router
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from statistics import mean
from sklearn.metrics.pairwise import cosine_similarity
from transformers import pipeline
from langchain_core.output_parsers import PydanticOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_huggingface import HuggingFaceEndpointEmbeddings

# -------------------- Config --------------------
load_dotenv()
hf_token = os.getenv("HF_TOKEN")
model = ChatGoogleGenerativeAI(model='gemini-2.0-flash')
embedding = HuggingFaceEndpointEmbeddings(
    repo_id="sentence-transformers/all-MiniLM-L6-v2",
    task="feature-extraction",
    huggingfacehub_api_token=hf_token
)
sentiment_pipeline = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")


# -------------------- Pydantic Models --------------------
class RecommendationRequest(BaseModel):
    query: str

class RecommendationResponse(BaseModel):
    title: str
    price: float
    rating: float
    sentiment_score: float
    sold: int
    reasoning: str

class Keywords(BaseModel):
    product_type: str
    price_max: Optional[str]
    price_min: Optional[str]
    use_case: Optional[str]
    recipient: Optional[str]
    must_have_features: Optional[List[str]]
    brand_preference: Optional[str]
    avoid_features: Optional[List[str]]
    urgency: Optional[str]

class RankingResult(BaseModel):
    best_product_index: int
    reasoning: str

# -------------------- Chains --------------------
parser = PydanticOutputParser(pydantic_object=Keywords)
keywordExtractionPrompt = PromptTemplate(
    template='Extract the following fields from the query: product_type, price_max, use_case, recipient, must_have_features, brand_preference, avoid_features, urgency\n\nQuery: {query}\n\n{format_instruction}',
    input_variables=['query'],
    partial_variables={'format_instruction': parser.get_format_instructions()}
)
chain = keywordExtractionPrompt | model | parser

ranking_parser = PydanticOutputParser(pydantic_object=RankingResult)
ranking_prompt = PromptTemplate(
    input_variables=['query', 'product_data'],
    template="""You are a shopping expert.

User query: "{query}"
Product data:
{product_data}

Evaluate based on:
1. Relevance to query
2. Rating & sentiment
3. Sales (sold column)
4. Price-performance balance

{format_instructions}
""",
    partial_variables={'format_instructions': ranking_parser.get_format_instructions()}
)
ranking_chain = ranking_prompt | model | ranking_parser

# -------------------- Utility Functions --------------------
def format_output(result: Keywords):
    return {
        "product_type": result.product_type,
        "price_max": int(result.price_max) if result.price_max and result.price_max.isdigit() else None,
        "price_min": int(result.price_min) if result.price_min and result.price_min.isdigit() else None,
        "use_case": result.use_case,
        "recipient": result.recipient,
        "must_have_features": result.must_have_features or [],
        "brand_preference": result.brand_preference,
        "avoid_features": result.avoid_features or [],
        "urgency": result.urgency,
    }

def filter_dataset(df: pd.DataFrame, filters: dict) -> pd.DataFrame:
    filtered_df = df.copy()
    if filters['product_type']:
        filtered_df = filtered_df[filtered_df['category'].str.contains(filters['product_type'], case=False, na=False)]
    if filters['price_max']:
        filtered_df = filtered_df[filtered_df['price'] <= filters['price_max']]
    if filters['price_min']:
        filtered_df = filtered_df[filtered_df['price'] >= filters['price_min']]
    if filters['brand_preference']:
        filtered_df = filtered_df[filtered_df['title'].str.contains(filters['brand_preference'], case=False, na=False)]
    if filters['urgency'] and "urgent" in filters['urgency'].lower():
        filtered_df = filtered_df.sort_values(by="sold", ascending=False).head(20)
    for feature in filters['must_have_features']:
        filtered_df = filtered_df[filtered_df['description'].str.contains(feature, case=False, na=False) |
                                  filtered_df['tags'].str.contains(feature, case=False, na=False)]
    for avoid in filters['avoid_features']:
        filtered_df = filtered_df[~filtered_df['description'].str.contains(avoid, case=False, na=False) &
                                  ~filtered_df['tags'].str.contains(avoid, case=False, na=False)]
    return filtered_df.reset_index(drop=True)

def semantic_match(query, df: pd.DataFrame, top_k=10):
    df['search_text'] = (
        df['title'].fillna('') + " " +
        df['description'].fillna('') + " " +
        df['tags'].apply(lambda x: ' '.join(x) if isinstance(x, list) else str(x))
    )
    doc_embeddings = embedding.embed_documents(df['search_text'].tolist())
    query_embedding = embedding.embed_query(query)
    df['similarity_score'] = cosine_similarity([query_embedding], doc_embeddings)[0]
    return df.sort_values(by='similarity_score', ascending=False).head(top_k).reset_index(drop=True)


def compute_sentiment_score(matched_df):
    scores = []
    for reviews in matched_df['reviews']:
        if not isinstance(reviews, list): scores.append(0); continue
        sentiments = sentiment_pipeline(reviews[:10])
        score = mean([1 if s['label'] == 'POSITIVE' else 0 for s in sentiments])
        scores.append(round(score * 100, 2))
    matched_df['sentiment_score'] = scores
    return matched_df

# -------------------- FastAPI App --------------------
app = FastAPI()

# Include the /products route
app.include_router(products_router)

@app.get("/")
def root():
    return {"message": "Smart Shopping Assistant Backend is running!"}

@app.post("/recommend", response_model=RecommendationResponse)
def recommend_product(req: RecommendationRequest):
    try:
        result = chain.invoke({'query': req.query})
        filters = format_output(result)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Query parsing failed: {str(e)}")

    df = pd.read_json("dataset.json")
    df['reviews'] = df['reviews'].apply(lambda x: ast.literal_eval(x) if isinstance(x, str) else x)
    filtered = filter_dataset(df, filters)
    if filtered.empty:
        raise HTTPException(status_code=404, detail="No matching products found")

    matched = semantic_match(req.query, filtered)
    matched = compute_sentiment_score(matched)

    product_subset = matched[['title', 'description', 'rating', 'sentiment_score', 'similarity_score', 'sold', 'price']]
    product_data_str = product_subset.to_string(index=True)

    try:
        ranking_response = ranking_chain.invoke({"query": req.query, "product_data": product_data_str})
        idx = ranking_response.best_product_index
        if not (0 <= idx < len(matched)):
            raise Exception("Invalid index")
        top_product = matched.iloc[idx]
        reasoning = ranking_response.reasoning
    except:
        matched['normalized_sales'] = (matched['sold'] - matched['sold'].min()) / (matched['sold'].max() - matched['sold'].min() + 1e-5)
        matched['combined_score'] = 0.7 * matched['similarity_score'] + 0.3 * matched['normalized_sales']
        top_product = matched.sort_values(by='combined_score', ascending=False).iloc[0]
        reasoning = "Fallback: Based on similarity and sales performance"

    return RecommendationResponse(
        title=top_product['title'],
        price=top_product['price'],
        rating=top_product['rating'],
        sentiment_score=top_product['sentiment_score'],
        sold=top_product['sold'],
        reasoning=reasoning
    )
