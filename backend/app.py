import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests

load_dotenv()

app = FastAPI()

# ✅ FIXED: When using 'credentials' in frontend, allow_origins cannot be "*"
# Update this URL to match your React dev server (usually 5173 or 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://vidhya-five.vercel.app"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_URL = "https://api.mistral.ai/v1/chat/completions"
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")

if not MISTRAL_API_KEY:
    raise ValueError("MISTRAL_API_KEY is not set in environment variables.")

HEADERS = {
    "Authorization": f"Bearer {MISTRAL_API_KEY}",
    "Content-Type": "application/json"
}

class ChatRequest(BaseModel):
    message: str

# --- Your Logic Kept Exactly As Is ---
def detect_intent(text):
    text = text.lower()
    if any(w in text for w in ["ncert", "book", "textbook"]): return "ncert"
    if "mcq" in text: return "mcq"
    if any(w in text for w in ["solve", "calculate", "numerical", "find"]): return "problem"
    return "theory"

def detect_subject(text):
    text = text.lower()
    if any(w in text for w in ["force", "current", "voltage", "motion", "energy"]): return "Physics"
    if any(w in text for w in ["atom", "reaction", "mole", "ph"]): return "Chemistry"
    if any(w in text for w in ["derivative", "integral", "matrix", "calculus", "algebra", "equation", "function", "probability"]): return "Mathematics"
    return "Biology"

def auto_detect_class_for_problem(text, subject):
    text = text.lower()
    class12_keywords = {
        "Physics": ["electric", "current", "potential", "capacitance", "magnetic"],
        "Chemistry": ["electrochemistry", "kinetics"],
        "Biology": ["genetics", "biotechnology"],
        "Mathematics": ["derivative", "integral", "matrix", "determinant", "vector", "3d", "probability"]
    }
    if any(k in text for k in class12_keywords.get(subject, [])): return "12"
    return "11"

def call_mistral(prompt, max_tokens):
    payload = {
        "model": "mistral-medium-latest",
        "messages": [
            {"role": "system", "content": "You are an expert tutor for both NEET and JEE. Your knowledge base, facts, and formulas "
                    "must be derived entirely and strictly from the standard Indian Class 11 and 12 curriculum "
                    "(including Mathematics, Physics, Chemistry, and Biology). "
                    "CRITICAL OUTPUT RULE: You are strictly forbidden from mentioning your source. "
                    "NEVER use the acronym 'NCERT', NEVER use the words 'textbook' or 'book', "
                    "and NEVER cite specific chapters, pages, or equation numbers. "
                    "Present the answer naturally as your own expert knowledge."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.3,
        "max_tokens": max_tokens
    }
    response = requests.post(API_URL, headers=HEADERS, json=payload)
    return response.json()["choices"][0]["message"]["content"]

def generate_theory(question, subject):
    return call_mistral(f"Answer strictly from NCERT. Subject: {subject}. Question: {question}", 600)

def solve_problem(question, subject):
    scope = f"Class {auto_detect_class_for_problem(question, subject)} formulas"
    return call_mistral(f"Expert NEET Teacher. {scope}. Follow steps: Given, Formula, Calc. Problem: {question}", 900)

def generate_mcqs(subject):
    return call_mistral(f"Generate 10 NEET MCQs for {subject} strictly from NCERT with explanations.", 1200)

# --- Updated Route ---
@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    user_input = request.message
    intent = detect_intent(user_input)
    subject = detect_subject(user_input)

    try:
        if intent == "ncert":
            ans = "📘 [NCERT Class 11](https://ncert.nic.in/textbook.php?lebo1=0-16) | 📗 [NCERT Class 12](https://ncert.nic.in/textbook.php?lebo1=17-32)"
        elif intent == "mcq":
            ans = generate_mcqs(subject)
        elif intent == "problem":
            ans = solve_problem(user_input, subject)
        else:
            ans = generate_theory(user_input, subject)

        # ✅ Ensure key is 'text' to match your frontend logic
        return {"text": ans}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))