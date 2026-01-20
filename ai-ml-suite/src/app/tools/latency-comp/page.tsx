import { LatencyComp } from "@/components/tools/latency-comp";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "LLM Latency Comparison | AI Stack",
    description: "Visual race between Groq, OpenAI, and Anthropic to see the difference in token generation speeds.",
};

export default function LatencyPage() {
    return (
        <div className="container mx-auto max-w-6xl h-full flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Latency Comparison</h1>
                <p className="text-muted-foreground mt-2">
                    Why does Groq feel instant? Visualize the difference between 300 t/s and 30 t/s.
                </p>
            </div>

            <LatencyComp />
        </div>
    );
}
