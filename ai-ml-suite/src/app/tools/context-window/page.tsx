import { ContextVisualizer } from "@/components/tools/context-visualizer";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "LLM Context Window Visualizer | AI Stack",
    description: "Visualize how your prompts fit into 8k, 32k, 128k, and 1M token context windows.",
};

export default function ContextVisualizerPage() {
    return (
        <div className="container mx-auto max-w-6xl h-full flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Context Window Visualizer</h1>
                <p className="text-muted-foreground mt-2">
                    Paste your text to see how much of the context window it consumes across different models.
                </p>
            </div>

            <ContextVisualizer />
        </div>
    );
}
