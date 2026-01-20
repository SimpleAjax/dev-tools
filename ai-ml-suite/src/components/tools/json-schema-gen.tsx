"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, FileJson } from "lucide-react";

const EXAMPLE_TS = `interface User {
  name: string;
  age: number;
  email?: string;
  preferences: {
    theme: "light" | "dark";
    notifications: boolean;
  };
  tags: string[];
}`;

export function JsonSchemaGen() {
    const [input, setInput] = useState(EXAMPLE_TS);
    const [output, setOutput] = useState("");
    const [error, setError] = useState("");

    const generateSchema = () => {
        try {
            setError("");
            // Very naive parser for demonstration (Phase 3 MVP)
            // Real solution would use 'ts-to-json-schema' but that requires Node.js context usually.
            // We will perform a simple regex based extraction for "name: type" patterns.

            const properties: any = {};
            const lines = input.split("\n");
            const required: string[] = [];
            const description = "Generated from TypeScript Interface";

            lines.forEach(line => {
                const match = line.match(/\s*(\w+)(\??):\s*(".*?"|\w+|{)/);
                if (match) {
                    const key = match[1];
                    const isOptional = match[2] === "?";
                    const typeRaw = match[3];

                    let type = "string";
                    if (typeRaw.includes("number")) type = "number";
                    if (typeRaw.includes("boolean")) type = "boolean";
                    if (typeRaw.includes("string")) type = "string";
                    if (typeRaw.includes("{")) type = "object";
                    if (input.includes(`${key}: string[]`)) type = "array"; // Check naive array

                    properties[key] = { type };
                    if (type === "array") properties[key].items = { type: "string" }; // Default to string array

                    if (!isOptional) required.push(key);
                }
            });

            const schema = {
                name: "extract_data",
                description,
                parameters: {
                    type: "object",
                    properties,
                    required
                }
            };

            setOutput(JSON.stringify(schema, null, 2));

        } catch (err: any) {
            setError("Failed to parse TypeScript: " + err.message);
        }
    };

    return (
        <div className="grid gap-6 lg:grid-cols-2 h-[calc(100vh-12rem)]">
            <div className="flex flex-col gap-4 h-full">
                <Card className="flex flex-col h-full">
                    <CardHeader>
                        <CardTitle>TypeScript Interface</CardTitle>
                        <CardDescription>Paste your TS interface definition.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-0 flex flex-col gap-4">
                        <Textarea
                            className="flex-1 resize-none font-mono text-sm"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            spellCheck={false}
                        />
                        <Button onClick={generateSchema}>Generate Function Schema</Button>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col gap-4 h-full">
                <Card className="flex flex-col h-full bg-muted/20">
                    <CardHeader>
                        <CardTitle>OpenAI Tools JSON</CardTitle>
                        <CardDescription>Ready for `tools` parameter.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-0 relative">
                        {error && (
                            <div className="absolute inset-0 z-10 p-6 backdrop-blur-sm">
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            </div>
                        )}
                        <pre className="h-full w-full p-4 rounded-lg bg-card border font-mono text-sm overflow-auto text-muted-foreground whitespace-pre-wrap">
                            {output || "// Click Generate..."}
                        </pre>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
