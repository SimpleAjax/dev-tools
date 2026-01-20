import { TemperatureVisualizer } from "@/components/tools/temp-visualizer";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "LLM Temperature & Top-P Visualizer | AI Stack",
    description: "Interactive playground to understand how Temperature and Top-P affect token selection probabilities.",
};

export default function TempVisualizerPage() {
    return (
        <div className="container mx-auto max-w-6xl h-full flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Temperature & Top-P Visualizer</h1>
                <p className="text-muted-foreground mt-2">
                    Understand the math behind LLM creativity and hallucination control.
                </p>
            </div>

            <TemperatureVisualizer />
        </div>
    );
}
