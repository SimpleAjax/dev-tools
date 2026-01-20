# AI & Machine Learning Stack

An "Engineering-as-Marketing" suite of interactive calculators, visualizers, and generators for AI Engineers, ML Ops, and Backend Developers.

## 🛠️ Tools Included

### FinOps & Cost Estimation
*   **Token Counter**: Real-time GPT-4/Claude token counting using `tiktoken`.
*   **LLM Cost Calculator**: Compare monthly API costs across providers.
*   **GPU VRAM Estimator**: Calculate VRAM requirements for Local LLMs (Llama 3, Mistral).
*   **Fine-Tuning Estimator**: Calculate training costs for custom models.
*   **Image Gen Cost**: Budget for DALL-E 3 and Midjourney.
*   **Audio Transcription Cost**: Estimate Whisper API usage.
*   **Batch API Savings**: ROI calculator for OpenAI Batch API.

### Visualization & Learning
*   **Context Window Visualizer**: Visualize 128k vs 1M token windows.
*   **RAG Chunking Visualizer**: Interactive text splitter with overlap visualization.
*   **Temperature & Top-P**: Interactive probability distribution graph.
*   **Latency Comparison**: Race mode for Groq vs OpenAI vs Anthropic.
*   **Vector DB Sizing**: Storage calculator for Pinecone/Milvus.

### Developer Utilities
*   **Prompt Template Generator**: Scaffold System/User prompts in JSON/YAML/Python.
*   **Function Schema Generator**: Convert TypeScript interfaces to OpenAI Tools JSON.
*   **Model Download Calculator**: Estimate download time for large weights.

## 🚀 Tech Stack
*   **Framework**: Next.js 14 (App Router)
*   **Styling**: Tailwind CSS + ShadCN UI
*   **Charts**: Recharts
*   **Logic**: `js-tiktoken` (Tokenization), React Hooks

## 🏃‍♂️ Running Locally

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Run development server:
    ```bash
    npm run dev
    ```

3.  Open [http://localhost:3000](http://localhost:3000)
