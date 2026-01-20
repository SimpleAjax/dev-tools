import { RagChunking } from "@/components/tools/rag-chunking";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "RAG Chunking Visualizer | AI Stack",
    description: "Interactive visualizer for text splitters (RecursiveCharacter, TokenSplitter) to optimize RAG pipelines.",
};

export default function RagChunkingPage() {
    return (
        <div className="container mx-auto max-w-6xl h-full flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">RAG Chunking Visualizer</h1>
                <p className="text-muted-foreground mt-2">
                    Fine-tune your text splitting strategy by visualizing chunk sizes and overlap.
                </p>
            </div>

            <RagChunking />
        </div>
    );
}
