"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type Format = "json" | "yaml" | "python";

const TEMPLATES = {
    "basic": {
        system: "You are a helpful assistant.",
        user: "Hello, world!",
        assistant: "Hello! How can I help you today?"
    },
    "rag": {
        system: "You are a Q&A assistant using only the provided context. If the answer is not in the context, say 'I don't know'.\n\nContext:\n{{context}}",
        user: "Question: {{question}}",
        assistant: ""
    },
    "function_calling": {
        system: "You are a function calling expert. Output only valid JSON.",
        user: "Extract the date: Tomorrow at 5pm",
        assistant: ""
    }
};

export function PromptGenerator() {
    const [format, setFormat] = useState<Format>("json");
    const [system, setSystem] = useState(TEMPLATES.basic.system);
    const [user, setUser] = useState(TEMPLATES.basic.user);
    const [assistant, setAssistant] = useState(TEMPLATES.basic.assistant);
    const [copied, setCopied] = useState(false);

    const loadTemplate = (key: string) => {
        const t = TEMPLATES[key as keyof typeof TEMPLATES];
        setSystem(t.system);
        setUser(t.user);
        setAssistant(t.assistant);
    };

    const generateOutput = () => {
        const messages = [
            { role: "system", content: system },
            { role: "user", content: user },
            ...(assistant ? [{ role: "assistant", content: assistant }] : [])
        ];

        if (format === "json") {
            return JSON.stringify(messages, null, 2);
        } else if (format === "yaml") {
            return messages.map(m => `- role: ${m.role}\n  content: |\n    ${m.content.replace(/\n/g, "\n    ")}`).join("\n");
        } else {
            // Python style
            const pythonStr = messages.map(m => `    {"role": "${m.role}", "content": """${m.content}"""},`).join("\n");
            return `messages = [\n${pythonStr}\n]`;
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generateOutput());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid gap-6 lg:grid-cols-2 h-[calc(100vh-12rem)]">
            <div className="flex flex-col gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Message Builder</CardTitle>
                        <CardDescription>Construct your prompt chain.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Template</Label>
                            <Select onValueChange={loadTemplate} defaultValue="basic">
                                <SelectTrigger>
                                    <SelectValue placeholder="Load template..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="basic">Basic Chat</SelectItem>
                                    <SelectItem value="rag">RAG Context</SelectItem>
                                    <SelectItem value="function_calling">Function Extraction</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-purple-500 font-mono text-xs uppercase tracking-wider">System</Label>
                            <Input
                                className="font-mono text-sm"
                                value={system}
                                onChange={e => setSystem(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-green-500 font-mono text-xs uppercase tracking-wider">User</Label>
                            <Input
                                className="font-mono text-sm"
                                value={user}
                                onChange={e => setUser(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-blue-500 font-mono text-xs uppercase tracking-wider">Assistant (Optional Pre-fill)</Label>
                            <Input
                                className="font-mono text-sm"
                                value={assistant}
                                onChange={e => setAssistant(e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col gap-4 h-full">
                <Card className="flex flex-col h-full bg-muted/20">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="space-y-1">
                            <CardTitle>Output Code</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                            <Tabs value={format} onValueChange={(v) => setFormat(v as Format)} className="h-8">
                                <TabsList className="h-8">
                                    <TabsTrigger value="json" className="text-xs h-7">JSON</TabsTrigger>
                                    <TabsTrigger value="yaml" className="text-xs h-7">YAML</TabsTrigger>
                                    <TabsTrigger value="python" className="text-xs h-7">Python</TabsTrigger>
                                </TabsList>
                            </Tabs>
                            <Button size="icon" variant="outline" className="h-8 w-8" onClick={handleCopy}>
                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-0 relative">
                        <pre className="h-full w-full p-4 rounded-lg bg-card border font-mono text-sm overflow-auto text-muted-foreground">
                            {generateOutput()}
                        </pre>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
