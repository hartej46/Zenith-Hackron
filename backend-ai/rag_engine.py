import os
from typing import List
import google.generativeai as genai
import psycopg
from psycopg.rows import dict_row
from dotenv import load_dotenv
import numpy as np

load_dotenv()

# Configure Gemini
if os.getenv("GOOGLE_API_KEY"):
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

class RAGEngine:
    def __init__(self):
        self.embeddings_model = "models/text-embedding-004"
        self.documents = []
        self.vectors = []
        # Auto-index on startup to ensure data is present
        try:
            self.index_data()
        except Exception as e:
            print(f"⚠️ Initial indexing failed: {e}")

    def create_task(self, title: str, priority: str = "MEDIUM", description: str = "Created by AI Agent"):
        """Create a new task in the database"""
        try:
            conn = psycopg.connect(os.getenv("DATABASE_URL"))
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO "Task" (id, title, description, priority, status, "updatedAt")
                    VALUES (gen_random_uuid(), %s, %s, %s::"Priority", 'PENDING', NOW())
                    RETURNING id
                    """,
                    (title, description, priority.upper())
                )
                new_id = cur.fetchone()[0]
                conn.commit()
                print(f"✅ AI Created Task: {title} ({new_id})")
                return new_id
        except Exception as e:
            print(f"❌ Failed to create task: {e}")
            return None

    def fetch_data_from_db(self):
        conn = psycopg.connect(os.getenv("DATABASE_URL"), row_factory=dict_row)
        cur = conn.cursor()
        
        # Fresh selection with correct column names from schema
        cur.execute("SELECT id, name, category, \"currentStock\", unit, \"expiryDate\" FROM \"StockItem\"")
        stock_items = cur.fetchall()
        
        cur.execute("SELECT id, \"customerName\", status, priority FROM \"Order\"")
        orders = cur.fetchall()
        
        conn.close()
        return stock_items, orders

    def index_data(self):
        """Trigger update of internal knowledge base"""
        if not os.getenv("GOOGLE_API_KEY"):
            print("⚠️ Skipping indexing: GOOGLE_API_KEY not found")
            return
            
        print("🔄 Fetching data from database...")
        try:
            stock_items, orders = self.fetch_data_from_db()
        except Exception as e:
            print(f"❌ DB Error: {e}")
            return
        
        raw_docs = []
        for item in stock_items:
            content = f"Stock Item: {item['name']} | Category: {item['category']} | Level: {item['currentStock']} {item['unit']} | Expiry: {item['expiryDate']}"
            raw_docs.append({"content": content, "id": item['id'], "type": "stock_item"})
            
        for order in orders:
            content = f"Order for {order['customerName']} | Status: {order['status']} | Priority: {order['priority']}"
            raw_docs.append({"content": content, "id": order['id'], "type": "order"})
            
        if not raw_docs:
            print("📝 No data to index")
            return

        print(f"📄 Indexing {len(raw_docs)} items with Gemini...")
        self.documents = raw_docs
        
        contents = [d['content'] for d in raw_docs]
        result = genai.embed_content(
            model=self.embeddings_model,
            content=contents,
            task_type="retrieval_document"
        )
        self.vectors = result['embedding']
        print("✅ Indexing complete")

    def query(self, text: str, k: int = 3):
        if not self.vectors:
            return []
        
        query_vec = genai.embed_content(
            model=self.embeddings_model,
            content=text,
            task_type="retrieval_query"
        )['embedding']
        similarities = [np.dot(query_vec, v) for v in self.vectors]
        top_indices = np.argsort(similarities)[::-1][:k]
        
        return [self.documents[i] for i in top_indices]

# Singleton instance
rag_engine = RAGEngine()
