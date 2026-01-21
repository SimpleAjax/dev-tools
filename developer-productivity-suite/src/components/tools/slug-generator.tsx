"use client";

import { useState } from "react";
import { Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function SlugGenerator() {
    const [input, setInput] = useState("");
    const [separator, setSeparator] = useState("-");

    const generateSlug = (text: string) => {
        if (!text) return "";
        let slug = text.toString().toLowerCase().trim();

        // Replace spaces with separator
        const regexSpace = /\s+/g;
        slug = slug.replace(regexSpace, separator);

        // Remove non-word chars (keep separator)
        // We need to escape separator if it's special regex char, but - and _ are usually fine in []
        // Actually, let's keep alphanumerics and the separator.
        const regexInvalid = new RegExp(`[^a-z0-9${separator === "-" ? "\\-" : separator}]+`, 'g');
        slug = slug.replace(regexInvalid, '');

        // Replace multiple separators
        const regexMulti = new RegExp(`${separator === "-" ? "\\-" : separator}+`, 'g');
        slug = slug.replace(regexMulti, separator);

        return slug;
    };

    const result = generateSlug(input);

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Input Text</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Enter text to slugify</Label>
                        <Textarea
                            placeholder="Hello World! This is an example..."
                            className="h-32 resize-none"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Separator</Label>
                        <div className="flex gap-2">
                            <Button
                                variant={separator === "-" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSeparator("-")}
                            >
                                Hyphen (-)
                            </Button>
                            <Button
                                variant={separator === "_" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSeparator("_")}
                            >
                                Underscore (_)
                            </Button>
                            <Button
                                variant={separator === "" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSeparator("")}
                            >
                                None
                            </Button>
                            <Button
                                variant={separator === "." ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSeparator(".")}
                            >
                                Dot (.)
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Generated Slug</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Result</Label>
                        <div className="flex items-center space-x-2">
                            <Input value={result} readOnly className="font-mono" />
                            <Button
                                size="icon"
                                variant="outline"
                                onClick={() => navigator.clipboard.writeText(result)}
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
