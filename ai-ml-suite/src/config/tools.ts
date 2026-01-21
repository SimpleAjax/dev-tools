import {
    Calculator,
    Cpu,
    DollarSign,
    Home,
    Layers,
    LayoutTemplate,
    PieChart,
    BarChart4,
    Database,
    MessageSquare,
    FileJson,
    Activity,
    Image,
    Mic,
    Download,
    Brain,
    GitCompare,
    Trophy
} from "lucide-react";

export interface ToolConfig {
    name: string;
    href: string;
    description: string;
    icon: any;
    highlight?: boolean;
}

export const tools: ToolConfig[] = [
    {
        name: "Dashboard",
        href: "/",
        description: "Overview of all tools",
        icon: Home,
    },
    // Phase 1
    {
        name: "Token Counter",
        href: "/tools/token-counter",
        description: "Estimate token counts for GPT-4/Claude, including cost estimation.",
        icon: Calculator,
        highlight: true,
    },
    {
        name: "LLM Cost Calculator",
        href: "/tools/cost-calculator",
        description: "Compare API costs across providers (OpenAI, Anthropic, Gemini).",
        icon: DollarSign,
    },
    {
        name: "GPU VRAM Estimator",
        href: "/tools/gpu-vram-estimator",
        description: "Estimate VRAM requirements for running LLMs (7B, 70B) locally.",
        icon: Cpu,
        highlight: true,
    },
    {
        name: "Batch API Savings",
        href: "/tools/batch-api-savings",
        description: "Calculate potential savings using OpenAI Batch API.",
        icon: Layers,
    },
    // Phase 2
    {
        name: "Context Visualizer",
        href: "/tools/context-window",
        description: "Visual representation of context windows sizes (8k, 32k, 128k).",
        icon: LayoutTemplate,
    },
    {
        name: "RAG Chunking",
        href: "/tools/rag-chunking",
        description: "Visualize text chunking strategies and overlap for RAG.",
        icon: PieChart,
    },
    {
        name: "Temp & Top-P",
        href: "/tools/temperature-visualizer",
        description: "Interactive visualizer for LLM sampling parameters.",
        icon: BarChart4,
    },
    {
        name: "Vector DB Sizing",
        href: "/tools/vector-calc",
        description: "Estimate storage requirements for standard vector databases.",
        icon: Database,
    },
    // Phase 3
    {
        name: "Prompt Templates",
        href: "/tools/prompt-generator",
        description: "Generate structured System/User prompt templates.",
        icon: MessageSquare,
    },
    {
        name: "Function Schema",
        href: "/tools/json-schema",
        description: "Convert TypeScript/Zod definitions to OpenAI Tools JSON.",
        icon: FileJson,
    },
    {
        name: "Latency Compare",
        href: "/tools/latency-comp",
        description: "Visualize token generation speeds (Groq vs OpenAI).",
        icon: Activity,
    },
    // Phase 4
    {
        name: "Fine-Tuning Cost",
        href: "/tools/fine-tuning-cost",
        description: "Estimate costs for fine-tuning based on epochs and dataset size.",
        icon: Brain,
    },
    {
        name: "Image Gen Cost",
        href: "/tools/image-gen-cost",
        description: "Calculator for DALL-E 3 and Midjourney costs.",
        icon: Image,
    },
    {
        name: "Audio Transcribe",
        href: "/tools/audio-cost",
        description: "Whisper API cost estimator based on duration.",
        icon: Mic,
    },
    {
        name: "Model Download",
        href: "/tools/bandwidth-calc",
        description: "Estimate download times for large model weights.",
        icon: Download,
    },
    // New Additions
    {
        name: "Prompt Diff",
        href: "/tools/prompt-diff",
        description: "Side-by-side diff tool optimized for large prompt text blocks.",
        icon: GitCompare,
    },
    {
        name: "Model Leaderboard",
        href: "/tools/model-leaderboard",
        description: "Aggregated ELO rankings for top AI models.",
        icon: Trophy,
    },
];
