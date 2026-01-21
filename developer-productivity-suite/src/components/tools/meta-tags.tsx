"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function MetaTagGenerator() {
    const [data, setData] = useState({
        title: "My Awesome Page",
        description: "This is a description of my awesome page that shows up in search results.",
        url: "https://example.com/page",
        image: "https://example.com/og-image.jpg"
    });

    const update = (key: string, val: string) => setData(p => ({ ...p, [key]: val }));

    const code = `
<!-- Primary Meta Tags -->
<title>${data.title}</title>
<meta name="title" content="${data.title}" />
<meta name="description" content="${data.description}" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${data.url}" />
<meta property="og:title" content="${data.title}" />
<meta property="og:description" content="${data.description}" />
<meta property="og:image" content="${data.image}" />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${data.url}" />
<meta property="twitter:title" content="${data.title}" />
<meta property="twitter:description" content="${data.description}" />
<meta property="twitter:image" content="${data.image}" />`.trim();

    return (
        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
            {/* Inputs */}
            <div className="flex flex-col gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Page Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Title (Current: {data.title.length} chars)</Label>
                            <Input value={data.title} onChange={e => update("title", e.target.value)} />
                            <div className="text-xs text-slate-500">Recommended: 60 characters</div>
                        </div>
                        <div className="space-y-2">
                            <Label>Description (Current: {data.description.length} chars)</Label>
                            <Textarea value={data.description} onChange={e => update("description", e.target.value)} />
                            <div className="text-xs text-slate-500">Recommended: 160 characters</div>
                        </div>
                        <div className="space-y-2">
                            <Label>URL</Label>
                            <Input value={data.url} onChange={e => update("url", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Image URL (OG Image)</Label>
                            <Input value={data.image} onChange={e => update("image", e.target.value)} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="flex-1 min-h-0 flex flex-col">
                    <CardHeader>
                        <CardTitle>Generated HTML</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-0">
                        <Textarea
                            className="h-full resize-none font-mono text-sm leading-relaxed"
                            value={code}
                            readOnly
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Previews */}
            <div className="flex flex-col gap-6 overflow-y-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Google Search Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-white p-4 rounded border dark:bg-white">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="bg-slate-200 w-6 h-6 rounded-full flex items-center justify-center text-[10px]">L</div>
                                <div className="flex flex-col">
                                    <div className="text-xs text-slate-800">{new URL(data.url || "https://example.com").hostname}</div>
                                    <div className="text-[10px] text-slate-500">{data.url}</div>
                                </div>
                            </div>
                            <div className="text-xl text-[#1a0dab] hover:underline cursor-pointer font-medium mb-1 truncate">
                                {data.title}
                            </div>
                            <div className="text-sm text-slate-700 leading-normal line-clamp-2">
                                {data.description}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Social Share Preview (Open Graph)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border">
                            <div className="aspect-[1.91/1] bg-slate-300 dark:bg-slate-700 w-full relative group">
                                {/* Mock Image */}
                                <div className="absolute inset-0 flex items-center justify-center text-slate-500 font-medium">
                                    {data.image ? <img key={data.image} src={data.image} alt="OG" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} /> : "Image Preview"}
                                </div>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t">
                                <div className="text-xs text-slate-500 uppercase mb-1 truncate">{new URL(data.url || "https://example.com").hostname}</div>
                                <div className="font-bold text-slate-900 dark:text-slate-100 truncate mb-1">{data.title}</div>
                                <div className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{data.description}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
