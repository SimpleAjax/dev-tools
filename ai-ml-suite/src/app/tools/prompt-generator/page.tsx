import { PromptGenerator } from "@/components/tools/prompt-generator";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Prompt Template Generator | AI Stack",
    description: "Scaffold ready-to-use System/User/Assistant role prompts for OpenAI/Anthropic APIs.",
};

export default function PromptGeneratorPage() {
    return (
        <div className="container mx-auto max-w-6xl h-full flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Prompt Template Generator</h1>
                <p className="text-muted-foreground mt-2">
                    Generate structured multi-turn message arrays for LLM APIs in JSON, YAML, or Python format.
                </p>
            </div>

            <PromptGenerator />
        </div>
    );
}
