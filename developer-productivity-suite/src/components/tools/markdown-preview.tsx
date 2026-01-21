"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export function MarkdownPreview() {
    const [markdown, setMarkdown] = useState(`# Markdown Preview

Type your markdown here to see the live preview.

## Features
- GitHub Flavored Markdown
- Tables
- Task lists
- Code blocks

\`\`\`javascript
console.log("Hello World");
\`\`\`

| Feature | Support |
| :--- | :--- |
| Tables | ✅ |
| Tasks | ✅ |
`);

    return (
        <div className="grid gap-6 lg:grid-cols-2 h-[calc(100vh-8rem)]">
            <Card className="flex flex-col min-h-0">
                <CardHeader>
                    <CardTitle>Editor</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 min-h-0">
                    <Textarea
                        className="h-full resize-none font-mono text-sm leading-relaxed"
                        value={markdown}
                        onChange={(e) => setMarkdown(e.target.value)}
                        placeholder="Type your markdown here..."
                    />
                </CardContent>
            </Card>

            <Card className="flex flex-col min-h-0">
                <CardHeader>
                    <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 min-h-0 overflow-auto">
                    <div className="prose prose-slate dark:prose-invert max-w-none h-full overflow-y-auto pr-2">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {markdown}
                        </ReactMarkdown>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
