"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

type Type = "Paragraphs" | "Sentences" | "JSON" | "SQL";

const WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum".split(" ");

function generateText(count: number, type: "Paragraphs" | "Sentences"): string {
    const sentences = [];
    for (let i = 0; i < count * (type === "Paragraphs" ? 5 : 1); i++) {
        const len = 5 + Math.floor(Math.random() * 10);
        let sentence = "";
        for (let j = 0; j < len; j++) {
            sentence += WORDS[Math.floor(Math.random() * WORDS.length)] + " ";
        }
        sentence = sentence.trim().charAt(0).toUpperCase() + sentence.trim().slice(1) + ".";
        sentences.push(sentence);
    }

    if (type === "Paragraphs") {
        const paragraphs = [];
        for (let i = 0; i < sentences.length; i += 5) {
            paragraphs.push(sentences.slice(i, i + 5).join(" "));
        }
        return paragraphs.join("\n\n");
    }
    return sentences.join(" ");
}

function generateJson(count: number) {
    const data = [];
    for (let i = 0; i < count; i++) {
        data.push({
            id: i + 1,
            name: `User ${i + 1}`,
            username: `user_${i + 1}_${WORDS[Math.floor(Math.random() * WORDS.length)]}`,
            email: `user${i + 1}@example.com`,
            active: Math.random() > 0.5,
            role: Math.random() > 0.8 ? "admin" : "user"
        });
    }
    return JSON.stringify(data, null, 2);
}

function generateSql(count: number) {
    const lines = [];
    lines.push("INSERT INTO users (id, name, email, active) VALUES");
    for (let i = 0; i < count; i++) {
        lines.push(`  (${i + 1}, 'User ${i + 1}', 'user${i + 1}@example.com', ${Math.random() > 0.5 ? 1 : 0})${i === count - 1 ? ';' : ','}`);
    }
    return lines.join("\n");
}

export function LoremIpsumGenerator() {
    const [type, setType] = useState<Type>("Paragraphs");
    const [count, setCount] = useState(3);
    const [output, setOutput] = useState("");

    useEffect(() => {
        switch (type) {
            case "Paragraphs":
            case "Sentences":
                setOutput(generateText(count, type));
                break;
            case "JSON":
                setOutput(generateJson(count));
                break;
            case "SQL":
                setOutput(generateSql(count));
                break;
        }
    }, [type, count]);

    return (
        <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
            <div className="flex items-end gap-4">
                <div className="w-[200px] space-y-2">
                    <Label>Type</Label>
                    <Select value={type} onValueChange={(v) => setType(v as Type)}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Paragraphs">Text (Paragraphs)</SelectItem>
                            <SelectItem value="Sentences">Text (Sentences)</SelectItem>
                            <SelectItem value="JSON">JSON Data</SelectItem>
                            <SelectItem value="SQL">SQL Insert</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-[200px] space-y-2">
                    <Label>Count: {count}</Label>
                    <Slider
                        value={[count]}
                        onValueChange={(v) => setCount(v[0])}
                        min={1}
                        max={50}
                        step={1}
                    />
                </div>

                <Button variant="outline" onClick={() => {
                    // Force re-render with new random seed effectively
                    switch (type) {
                        case "Paragraphs": case "Sentences": setOutput(generateText(count, type)); break;
                        case "JSON": setOutput(generateJson(count)); break;
                        case "SQL": setOutput(generateSql(count)); break;
                    }
                }}>
                    Regenerate
                </Button>
            </div>

            <Card className="flex flex-col min-h-0 flex-1">
                <CardHeader className="flex flex-row items-center justify-between py-3">
                    <CardTitle className="text-sm">Output</CardTitle>
                    <Button size="sm" variant="ghost" onClick={() => navigator.clipboard.writeText(output)}>
                        Copy
                    </Button>
                </CardHeader>
                <CardContent className="flex-1 min-h-0">
                    <Textarea
                        className="h-full resize-none font-mono text-sm leading-relaxed"
                        value={output}
                        readOnly
                    />
                </CardContent>
            </Card>
        </div>
    );
}
