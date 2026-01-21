"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Base64Encoder() {
    const [file, setFile] = useState<File | null>(null);
    const [base64, setBase64] = useState("");
    const [copied, setCopied] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const selectedFile = acceptedFiles[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onload = () => {
                setBase64(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': []
        },
        maxFiles: 1
    });

    const handleCopy = () => {
        navigator.clipboard.writeText(base64);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const clear = () => {
        setFile(null);
        setBase64("");
    }

    return (
        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
            <Card className="flex flex-col min-h-0">
                <CardHeader>
                    <CardTitle>Upload Image</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-6">
                    {!file ? (
                        <div
                            {...getRootProps()}
                            className={cn(
                                "flex-1 border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-12 transition-colors cursor-pointer",
                                isDragActive ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
                            )}
                        >
                            <input {...getInputProps()} />
                            <Upload className="h-12 w-12 text-slate-400 mb-4" />
                            <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
                                {isDragActive ? "Drop the file here" : "Drag & drop an image here"}
                            </p>
                            <p className="text-sm text-slate-500 mt-2">
                                or click to select a file
                            </p>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center relative bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden">
                            <img src={base64} alt="Preview" className="max-w-full max-h-[400px] object-contain" />
                            <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-4 right-4 rounded-full"
                                onClick={clear}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                            <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white rounded-md p-2 text-sm text-center backdrop-blur">
                                {file.name} ({(file.size / 1024).toFixed(1)} KB)
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="flex flex-col min-h-0">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Base64 Output</CardTitle>
                    {base64 && (
                        <Button onClick={handleCopy} size="sm" variant={copied ? "default" : "outline"}>
                            {copied ? <Check className="mr-2 h-3 w-3" /> : <Copy className="mr-2 h-3 w-3" />}
                            {copied ? "Copied" : "Copy String"}
                        </Button>
                    )}
                </CardHeader>
                <CardContent className="flex-1 min-h-0">
                    <Textarea
                        className="h-full resize-none font-mono text-xs leading-relaxed text-slate-500"
                        value={base64}
                        readOnly
                        placeholder="Base64 string will appear here..."
                    />
                </CardContent>
            </Card>
        </div>
    );
}
