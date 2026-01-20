"use client";

import { useState, useEffect, useRef } from "react";
import CryptoJS from "crypto-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyButton } from "@/components/tool-shell";
import { Upload, File } from "lucide-react";
import { cn } from "@/lib/utils";

export function HashGenerator() {
    const [input, setInput] = useState("");
    const [hashes, setHashes] = useState({
        md5: "",
        sha1: "",
        sha256: "",
        sha512: "",
    });
    const [activeTab, setActiveTab] = useState("text");
    const [fileName, setFileName] = useState<string | null>(null);
    const [isComputing, setIsComputing] = useState(false);

    // Text Hashing
    useEffect(() => {
        if (activeTab === "text") {
            setHashes({
                md5: CryptoJS.MD5(input).toString(),
                sha1: CryptoJS.SHA1(input).toString(),
                sha256: CryptoJS.SHA256(input).toString(),
                sha512: CryptoJS.SHA512(input).toString(),
            });
        }
    }, [input, activeTab]);

    // File Hashing
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setIsComputing(true);
        setInput(""); // Clear text input

        const reader = new FileReader();

        reader.onload = (evt) => {
            const arrayBuffer = evt.target?.result;
            if (arrayBuffer) {
                // Convert ArrayBuffer to WordArray
                const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer as any);

                setHashes({
                    md5: CryptoJS.MD5(wordArray).toString(),
                    sha1: CryptoJS.SHA1(wordArray).toString(),
                    sha256: CryptoJS.SHA256(wordArray).toString(),
                    sha512: CryptoJS.SHA512(wordArray).toString(),
                });
                setIsComputing(false);
            }
        };

        reader.readAsArrayBuffer(file);
    };

    return (
        <div className="space-y-8">
            <div className="max-w-3xl mx-auto">
                <Tabs defaultValue="text" onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="text">Text Input</TabsTrigger>
                        <TabsTrigger value="file">File Input</TabsTrigger>
                    </TabsList>

                    <TabsContent value="text" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Input Text</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    placeholder="Type something to hash..."
                                    className="min-h-[150px] font-mono"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="file" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Select File</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <label className={cn(
                                    "flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 dark:bg-slate-900",
                                    "hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                )}>
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        {fileName ? (
                                            <>
                                                <File className="w-10 h-10 mb-3 text-blue-500" />
                                                <p className="mb-2 text-sm text-slate-500 font-semibold">{fileName}</p>
                                                <p className="text-xs text-slate-400">Click to replace</p>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-10 h-10 mb-3 text-slate-400" />
                                                <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                <p className="text-xs text-slate-500">Hash is calculated locally in browser</p>
                                            </>
                                        )}
                                    </div>
                                    <input type="file" className="hidden" onChange={handleFileUpload} />
                                </label>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            <div className="grid gap-4 max-w-4xl mx-auto">
                {["MD5", "SHA1", "SHA256", "SHA512"].map((algo) => {
                    const key = algo.toLowerCase() as keyof typeof hashes;
                    const val = hashes[key];

                    return (
                        <Card key={algo}>
                            <CardContent className="p-4 flex items-center justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-bold text-muted-foreground uppercase mb-1">{algo}</div>
                                    {isComputing ? (
                                        <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
                                    ) : (
                                        <div className="font-mono text-sm truncate bg-slate-100 dark:bg-slate-950 px-2 py-1 rounded select-all">
                                            {val || "..."}
                                        </div>
                                    )}
                                </div>
                                <CopyButton text={val} />
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    );
}
