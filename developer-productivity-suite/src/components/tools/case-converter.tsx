"use client";

import { useState } from "react";
import { Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function CaseConverter() {
    const [input, setInput] = useState("");

    const toCamelCase = (str: string) => {
        return str
            .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
                index === 0 ? word.toLowerCase() : word.toUpperCase()
            )
            .replace(/\s+/g, '')
            .replace(/[-_]/g, '');
    };

    const toPascalCase = (str: string) => {
        return str
            .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
            .replace(/\s+/g, '')
            .replace(/[-_]/g, '');
    };

    const toSnakeCase = (str: string) => {
        return str
            .replace(/\W+/g, " ")
            .split(/ |\B(?=[A-Z])/)
            .map(word => word.toLowerCase())
            .join('_');
    };

    const toKebabCase = (str: string) => {
        return str
            .replace(/\W+/g, " ")
            .split(/ |\B(?=[A-Z])/)
            .map(word => word.toLowerCase())
            .join('-');
    };

    const toConstantCase = (str: string) => {
        return str
            .replace(/\W+/g, " ")
            .split(/ |\B(?=[A-Z])/)
            .map(word => word.toUpperCase())
            .join('_');
    };

    const toSentenceCase = (str: string) => {
        const s = str.replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim();
        return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    };

    const toTitleCase = (str: string) => {
        return str
            .replace(/[-_]/g, ' ')
            .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    };

    const cases = [
        { name: "Camel Case", fn: toCamelCase, example: "camelCase" },
        { name: "Pascal Case", fn: toPascalCase, example: "PascalCase" },
        { name: "Snake Case", fn: toSnakeCase, example: "snake_case" },
        { name: "Kebab Case", fn: toKebabCase, example: "kebab-case" },
        { name: "Constant Case", fn: toConstantCase, example: "CONSTANT_CASE" },
        { name: "Sentence Case", fn: toSentenceCase, example: "Sentence case" },
        { name: "Title Case", fn: toTitleCase, example: "Title Case" },
    ];

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Input Text</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Label htmlFor="input-text">Enter text to convert</Label>
                    <Textarea
                        id="input-text"
                        placeholder="Type something here..."
                        className="h-64 resize-none font-mono"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                </CardContent>
            </Card>

            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Converted Formats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
                    {cases.map((c) => {
                        const val = input ? c.fn(input) : "";
                        return (
                            <div key={c.name} className="space-y-2">
                                <Label className="text-xs text-muted-foreground">{c.name}</Label>
                                <div className="flex items-center space-x-2">
                                    <Input value={val} readOnly className="font-mono h-9" placeholder={c.example} />
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="h-9 w-9"
                                        onClick={() => navigator.clipboard.writeText(val)}
                                        disabled={!val}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>
        </div>
    );
}
