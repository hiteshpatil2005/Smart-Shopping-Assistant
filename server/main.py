import os
import ast
import pandas as pd
from dotenv import load_dotenv
from products import router as products_router
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware  # ✅ CORS import added
from pydantic import BaseModel
from typing import List, Optional
from statistics import mean
from sklearn.metrics.pairwise import cosine_similarity
from transformers import pipeline
from langchain_core.output_parsers import PydanticOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_huggingface import HuggingFaceEndpointEmbeddings
from database import db

load_dotenv()
hf_token = os.getenv("HF_TOKEN")

model = ChatGoogleGenerativeAI(model='gemini-2.0-flash')
embedding = HuggingFaceEndpointEmbeddings(
    repo_id="sentence-transformers/all-MiniLM-L6-v2",
    task="feature-extraction",
    huggingfacehub_api_token=hf_token
)
sentiment_pipeline = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")


class SimpleProduct(BaseModel):
    title: str
    price: float
    rating: float
    sentiment_score: float
    sold: int
    similarity_score: Optional[float]
    images: Optional[List[str]] = []

class SimpleSearchResponse(BaseModel):
    products: List[SimpleProduct]


class RecommendationRequest(BaseModel):
    query: str


class RecommendationResponse(BaseModel):
    title: str
    price: float
    rating: float
    sentiment_score: float
    sold: int
    reasoning: str
    images: Optional[List[str]] = []  


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
    template="""You are an expert product analyst. Analyze these products and identify the single BEST match.

USER REQUEST: "{query}"
PRODUCTS: {product_data}

SCORING CRITERIA (weighted):
1. REQUEST ALIGNMENT (40%) - How well it fulfills the user's specific requirements and needs
2. CUSTOMER SATISFACTION (30%) - Customer ratings, review feedback, brand reputation (prefer 4.0+ stars)
3. MARKET PERFORMANCE (20%) - Sales success, competitive pricing, overall value
4. PURCHASE VIABILITY (10%) - Price reasonableness, availability

ANALYSIS PROCESS:
- Score each product 1-10 per criterion
- Calculate weighted scores (max 10.0)
- Rank by total score
- Choose the highest-scoring product as your recommendation

OUTPUT FORMAT:
1. Brief ranking of all products with scores and key strengths/weaknesses
2. Clear #1 RECOMMENDATION with justification
3. Any significant trade-offs or alternatives worth considering

IMPORTANT: 
- Always refer to products by their actual NAME, not technical terms
- Use customer-friendly language (avoid "sentiment scores", "similarity scores", etc.)
- Focus on practical benefits and real-world value for the customer
- Write as if explaining to someone making a purchase decision

Be decisive - choose one winner and defend it convincingly.

{format_instructions}
""",
    partial_variables={'format_instructions': ranking_parser.get_format_instructions()}
)
ranking_chain = ranking_prompt | model | ranking_parser

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

async def load_products_from_db():
    try:
        if db.db is None:
            await db.connect()

        cursor = db.products.find()
        products = []
        async for product in cursor:
            product["_id"] = str(product["_id"])
            products.append(product)

        if len(products) == 0:
            raise HTTPException(status_code=404, detail="No products found in database")

        df = pd.DataFrame(products)
        if 'reviews' in df.columns:
            df['reviews'] = df['reviews'].apply(
                lambda x: ast.literal_eval(x) if isinstance(x, str) else x
            )
        return df
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

def filter_dataset(df: pd.DataFrame, filters: dict) -> pd.DataFrame:
    filtered_df = df.copy()

    if filters['product_type']:
        keywords = filters['product_type'].lower().split()
        condition = pd.Series([True] * len(filtered_df))
        for word in keywords:
            word_condition = (
                filtered_df['title'].str.contains(word, case=False, na=False) |
                filtered_df['description'].str.contains(word, case=False, na=False)
            )
            if 'category' in filtered_df.columns:
                word_condition |= filtered_df['category'].str.contains(word, case=False, na=False)
            condition &= word_condition
        filtered_df = filtered_df[condition]

    if filters['price_max']:
        filtered_df = filtered_df[filtered_df['price'] <= filters['price_max']]

    if filters['price_min']:
        filtered_df = filtered_df[filtered_df['price'] >= filters['price_min']]

    if filters['brand_preference']:
        filtered_df = filtered_df[filtered_df['title'].str.contains(filters['brand_preference'], case=False, na=False)]

    if filters['urgency'] and "urgent" in filters['urgency'].lower():
        filtered_df = filtered_df.sort_values(by="sold", ascending=False).head(20)

    for feature in filters['must_have_features']:
        condition = filtered_df['description'].str.contains(feature, case=False, na=False)
        if 'tags' in filtered_df.columns:
            condition = condition | filtered_df['tags'].str.contains(feature, case=False, na=False)
        filtered_df = filtered_df[condition]

    for avoid in filters['avoid_features']:
        condition = ~filtered_df['description'].str.contains(avoid, case=False, na=False)
        if 'tags' in filtered_df.columns:
            condition = condition & ~filtered_df['tags'].str.contains(avoid, case=False, na=False)
        filtered_df = filtered_df[condition]

    return filtered_df.reset_index(drop=True)

def semantic_match(query, df: pd.DataFrame, top_k=10):
    search_text_parts = [df['title'].fillna(''), df['description'].fillna('')]
    if 'tags' in df.columns:
        search_text_parts.append(df['tags'].apply(lambda x: ' '.join(x) if isinstance(x, list) else str(x)))
    df['search_text'] = pd.concat(search_text_parts, axis=1).apply(lambda row: ' '.join(row.dropna().astype(str)), axis=1)

    try:
        doc_embeddings = embedding.embed_documents(df['search_text'].tolist())
        query_embedding = embedding.embed_query(query)
        df['similarity_score'] = cosine_similarity([query_embedding], doc_embeddings)[0]
        return df.sort_values(by='similarity_score', ascending=False).head(top_k).reset_index(drop=True)
    except Exception:
        return df.head(top_k).reset_index(drop=True)

def compute_sentiment_score(matched_df):
    scores = []
    for reviews in matched_df.get('reviews', []):
        if not isinstance(reviews, list):
            scores.append(0)
            continue
        try:
            sentiments = sentiment_pipeline(reviews[:10])
            score = mean([1 if s['label'] == 'POSITIVE' else 0 for s in sentiments])
            scores.append(round(score * 100, 2))
        except Exception:
            scores.append(0)
    matched_df['sentiment_score'] = scores
    return matched_df

# ✅ FastAPI App Initialization with CORS
app = FastAPI(title="Smart Shopping Assistant", description="Backend for Smart Shopping Assistant")

# ✅ Enable CORS for localhost:5173 (React frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products_router, prefix="/api", tags=["products"])

@app.on_event("startup")
async def startup_event():
    try:
        await db.connect()
        await db.products.find_one()
    except Exception:
        pass

@app.on_event("shutdown")
async def shutdown_event():
    await db.close()

@app.get("/")
def root():
    return {"message": "Smart Shopping Assistant Backend is running!"}


@app.post("/simple-search", response_model=SimpleSearchResponse)
async def simple_search(req: RecommendationRequest):
    try:
        #print("🔍 User query:", req.query)
        result = chain.invoke({'query': req.query})
        filters = format_output(result)
        #print("🧠 Extracted filters:", filters)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Query parsing failed: {str(e)}")

    df = await load_products_from_db()

    # First filtering
    filtered = filter_dataset(df, filters)

    if filtered.empty:
        # print("⚠️ No results after strict filtering. Relaxing...")
        relaxed_filters = {
            "product_type": filters.get("product_type"),
            "price_max": None,
            "price_min": None,
            "use_case": None,
            "recipient": None,
            "must_have_features": [],
            "brand_preference": None,
            "avoid_features": [],
            "urgency": None,
        }
        filtered = filter_dataset(df, relaxed_filters)

        if filtered.empty:
            # print("❌ Still no matches after relaxing filters.")
            # Return empty product list instead of random products
            return SimpleSearchResponse(products=[])

    # Semantic match
    matched = semantic_match(req.query, filtered)

    # Add sentiment scores
    matched = compute_sentiment_score(matched)

    # Sort based on availability
    if 'sold' in matched.columns and 'similarity_score' in matched.columns:
        matched = matched.sort_values(by=['sold', 'similarity_score'], ascending=False)
    elif 'similarity_score' in matched.columns:
        matched = matched.sort_values(by='similarity_score', ascending=False)
    elif 'sold' in matched.columns:
        matched = matched.sort_values(by='sold', ascending=False)

    # Convert to list of SimpleProduct
    products = []
    for _, row in matched.iterrows():
        images = row.get("images", [])

        # Handle NaN, None, or empty
        if images is None or (isinstance(images, float) and pd.isna(images)):
            images = []
        # If it's a string, try to parse as JSON or treat as single image
        elif isinstance(images, str):
            try:
                import json
                parsed = json.loads(images)
                if isinstance(parsed, list):
                    images = parsed
                else:
                    images = [parsed]
            except Exception:
                images = [images]
        # If it's a list or tuple, keep as is
        elif isinstance(images, (list, tuple)):
            images = list(images)
        else:
            images = [images]

        products.append(SimpleProduct(
            title=row.get('title', ''),
            price=row.get('price', 0),
            rating=row.get('rating', 0.0),
            sentiment_score=row.get('sentiment_score', 0.0),
            sold=row.get('sold', 0),
            similarity_score=row.get('similarity_score'),
            images=images
        ))
    return SimpleSearchResponse(products=products)


@app.post("/recommend", response_model=RecommendationResponse)
async def recommend_product(req: RecommendationRequest):
    try:
        result = chain.invoke({'query': req.query})
        filters = format_output(result)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Query parsing failed: {str(e)}")

    df = await load_products_from_db()
    filtered = filter_dataset(df, filters)

    if filtered.empty:
        relaxed_filters = {
            "product_type": filters.get("product_type"),
            "price_max": None,
            "price_min": None,
            "use_case": None,
            "recipient": None,
            "must_have_features": [],
            "brand_preference": None,
            "avoid_features": [],
            "urgency": None,
        }
        filtered = filter_dataset(df, relaxed_filters)
        if filtered.empty:
            raise HTTPException(status_code=404, detail="No matching products found")

    matched = semantic_match(req.query, filtered)
    matched = compute_sentiment_score(matched)

    product_subset_columns = ['title', 'description', 'rating', 'sentiment_score', 'similarity_score', 'sold', 'price']
    available_columns = [col for col in product_subset_columns if col in matched.columns]
    product_subset = matched[available_columns]
    product_data_str = product_subset.to_string(index=True)

    try:
        ranking_response = ranking_chain.invoke({"query": req.query, "product_data": product_data_str})
        idx = ranking_response.best_product_index
        if not (0 <= idx < len(matched)):
            raise Exception("Invalid index")
        top_product = matched.iloc[idx]
        reasoning = ranking_response.reasoning
    except Exception:
        if 'sold' in matched.columns:
            matched['normalized_sales'] = (matched['sold'] - matched['sold'].min()) / (matched['sold'].max() - matched['sold'].min() + 1e-5)
            matched['combined_score'] = 0.7 * matched['similarity_score'] + 0.3 * matched['normalized_sales']
        else:
            matched['combined_score'] = matched['similarity_score']
        top_product = matched.sort_values(by='combined_score', ascending=False).iloc[0]
        reasoning = "Fallback: Based on similarity and sales performance"


    return RecommendationResponse(
        title=top_product['title'],
        price=top_product['price'],
        rating=top_product.get('rating', 0.0),
        sentiment_score=top_product.get('sentiment_score', 0.0),
        sold=top_product.get('sold', 0),
        reasoning=reasoning,
        images=top_product.get('images', []) 
    )
