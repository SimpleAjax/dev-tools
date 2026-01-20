import { TokenCounter } from "@/components/tools/token-counter";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "OpenAI Token Counter | AI Stack",
    description: "Accurately count tokens for GPT-4, GPT-3.5, and Claude models. Estimate API costs instantly.",
};

export default function TokenCounterPage() {
    return (
        <div className="container mx-auto max-w-6xl h-full flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Token Counter</h1>
                <p className="text-muted-foreground mt-2">
                    Real-time token counting and cost estimation using the official TikToken tokenizer.
                </p>
            </div>

            <TokenCounter />
        </div>
    );
}
