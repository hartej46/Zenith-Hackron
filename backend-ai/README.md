# Zenith AI Backend (RAG Engine)

This is the Python-based intelligence layer for Zenith MSME Operations. It uses **FastAPI** for its API and **LangChain** with **ChromaDB** for Retrieval-Augmented Generation (RAG).

## 🚀 Getting Started

1.  **Environment Variables**:
    Ensure the `.env` file in this directory contains:
    - `DATABASE_URL`: Your PostgreSQL connection string.
    - `OPENAI_API_KEY`: Your OpenAI API key.

2.  **Dependencies**:
    If not already installed, run:
    ```bash
    pip install -r requirements.txt
    ```

3.  **Run the Server**:
    ```bash
    python main.py
    ```
    The AI server runs on [http://localhost:8000](http://localhost:8000).

## 🤖 Core Features

-   **Context-Aware Chat**: Specifically indices your `StockItems` and `Orders` into a vector database for intelligent answering.
-   **RAG Engine**: Uses similarity search to find relevant inventory data for user queries.
-   **Data Synchronization**: Can re-index database records via the `/api/ai/index` endpoint.

## 📁 Structure
- `main.py`: FastAPI application & endpoints.
- `rag_engine.py`: Vector search and indexing logic.
- `db/`: Local ChromaDB storage (auto-generated).
