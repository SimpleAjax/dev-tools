import { JsonSchemaGen } from "@/components/tools/json-schema-gen";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "TS to OpenAI Function Schema | AI Stack",
    description: "Convert TypeScript interfaces into OpenAI-compatible JSON Schema for function calling.",
};

export default function JsonSchemaPage() {
    return (
        <div className="container mx-auto max-w-6xl h-full flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Function Schema Generator</h1>
                <p className="text-muted-foreground mt-2">
                    Turn your TypeScript interfaces directly into OpenAI function calling schemas.
                </p>
            </div>

            <JsonSchemaGen />
        </div>
    );
}
