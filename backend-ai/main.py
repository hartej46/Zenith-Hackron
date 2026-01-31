import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="Zenith AI Backend", description="AI Operations & RAG Engine")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    context: Optional[dict] = None

class ChatResponse(BaseModel):
    response: str
    sources: Optional[List[str]] = []

@app.get("/")
async def root():
    return {"status": "online", "message": "Zenith AI Backend is running"}

from rag_engine import rag_engine

from rag_engine import rag_engine
from groq import Groq

# Initialize Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

@app.post("/api/ai/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        # 1. Retrieve context from RAG engine
        context_docs = rag_engine.query(request.message)
        context_text = "\n".join([doc['content'] for doc in context_docs])
        
        if not os.getenv("GROQ_API_KEY"):
            raise HTTPException(status_code=400, detail="Groq API Key not configured")

        # 2. Create prompt with Zenith AI personality and data
        system_prompt = f"""You are Zenith AI, a strictly focused assistant for MSME operations, inventory management, and order tracking.
        
        CRITICAL RULES:
        - ONLY answer questions related to the provided context (inventory, products, orders, supplies).
        - If a user asks ANYTHING outside of this domain, you MUST politely decline.
        - Avoid speculative answers. If the data isn't in the context, state it clearly.
        
        Context from Database:
        {context_text}
        
        Data Handling:
        - Refer to 'Current Level' for stock queries.
        - Refer to 'Status' and 'Priority' for order queries.
        """
        
        # 3. Use Groq for ultra-fast response
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.message}
            ],
            model="openai/gpt-oss-120b",
            temperature=0,
        )
        
        return ChatResponse(
            response=chat_completion.choices[0].message.content,
            sources=[doc.get("id", "unknown") for doc in context_docs]
        )
    except Exception as e:
        error_msg = str(e)
        print(f"❌ Chat Error: {error_msg}")
        raise HTTPException(status_code=500, detail=error_msg)

@app.post("/api/ai/index")
async def index_data():
    """Trigger a re-indexing of the database data into the vector store"""
    try:
        rag_engine.index_data()
        return {"message": "Indexing triggered successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
