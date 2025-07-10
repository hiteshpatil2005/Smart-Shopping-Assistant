# 🛍️ Smart Shopping Assistant

Smart Shopping Assistant is an AI-powered e-commerce web app built using:

- **Frontend :** ReactJS + Vite + TailwindCSS  
- **Backend :** FastAPI (Python)

Follow the steps below to clone and run the project locally.

---

## Setup Command for react vue and tailwind (Frontend)

```bash
# Clone the project

git clone https://github.com/hiteshpatil2005/smart-shopping-assistant.git

cd smart-shopping-assistant
```
```bash
# Navigate into frontend folder

cd client
```
```bash
# Install dependencies

npm install
```
```bash
# Start the development server

npm run dev
```
```bash
# Now open your browser at:

http://localhost:5173
```
## Setup Command for FastAPI (backend)
```bash
# Open a new terminal and navigate to project root

cd smart-shopping-assistant
```
```bash
# Go into the backend folder

cd server
```

```bash
# Create a virtual environment

py -m venv venv
```

### Activate the virtual environment

```bash
# On PowerShell:

venv\Scripts\Activate.ps1
```
```bash
# If you face a permission error, try:

venv\Scripts\activate
```

```bash
# Install FastAPI and Uvicorn

pip install fastapi uvicorn
```

### Create a file named main.py and add this code:
```bash
# --- main.py ---

from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Smart Shopping Assistant Backend is running!"}
```
```bash
# Start the backend server

uvicorn main:app --reload
```
```bash
# Open in browser:

http://localhost:8000
```

```bash
### ✅ Folder Tree

smart-shopping-assistant/
├── client/                   # React + Vite + Tailwind (Frontend)
│   ├── src/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .gitignore

├── server/                   # FastAPI (Backend)
│   ├── main.py
│   ├── venv/                 # Python virtual environment
│   └── __init__.py (optional)

├── .gitignore
└── README.md

```
