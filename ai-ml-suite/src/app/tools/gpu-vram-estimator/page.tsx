import { VramEstimator } from "@/components/tools/vram-estimator";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "LLM VRAM Calculator | AI Stack",
    description: "Estimate GPU memory requirements for running LLMs like Llama 3, Mistral, and Mixtral locally.",
};

export default function VramEstimatorPage() {
    return (
        <div className="container mx-auto max-w-6xl h-full flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">GPU VRAM Estimator</h1>
                <p className="text-muted-foreground mt-2">
                    Calculate the VRAM needed to run different Large Language Models at various quantizations.
                </p>
            </div>

            <VramEstimator />
        </div>
    );
}
