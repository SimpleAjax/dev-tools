import { FineTuningCalc } from "@/components/tools/fine-tuning-cost";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Fine-Tuning Cost Estimator | AI Stack",
    description: "Calculate the cost to fine-tune OpenAI models based on dataset size and epochs.",
};

export default function FineTuningPage() {
    return (
        <div className="container mx-auto max-w-6xl h-full flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Fine-Tuning Estimator</h1>
                <p className="text-muted-foreground mt-2">
                    Estimate the one-time cost of fine-tuning a custom model on your data.
                </p>
            </div>

            <FineTuningCalc />
        </div>
    );
}
