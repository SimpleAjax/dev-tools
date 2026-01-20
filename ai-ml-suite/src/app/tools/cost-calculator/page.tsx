import { CostCalculator } from "@/components/tools/cost-calculator";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "LLM API Cost Calculator | AI Stack",
    description: "Compare API costs for OpenAI GPT-4, Anthropic Claude 3, Google Gemini, and Groq Llama 3.",
};

export default function CostCalculatorPage() {
    return (
        <div className="container mx-auto max-w-6xl h-full flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">LLM Cost Calculator</h1>
                <p className="text-muted-foreground mt-2">
                    Compare estimated monthly costs across different LLM providers based on your usage patterns.
                </p>
            </div>

            <CostCalculator />
        </div>
    );
}
