"use client";

import { useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Download } from "lucide-react";

export function FaviconGenerator() {
    const [imgSrc, setImgSrc] = useState("");
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const onDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            setImgSrc(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxFiles: 1
    });

    const download = (size: number) => {
        if (!imgSrc) return;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.src = imgSrc;
        img.onload = () => {
            ctx?.drawImage(img, 0, 0, size, size);
            const url = canvas.toDataURL("image/png");
            const a = document.createElement("a");
            a.href = url;
            a.download = `favicon-${size}x${size}.png`;
            a.click();
        };
    };

    return (
        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
            <Card className="flex flex-col min-h-0">
                <CardHeader>
                    <CardTitle>Source Image</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    {!imgSrc ? (
                        <div {...getRootProps()} className="border-2 border-dashed rounded-lg p-12 cursor-pointer w-full h-full flex flex-col items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-900">
                            <input {...getInputProps()} />
                            <Upload className="h-10 w-10 text-slate-300 mb-4" />
                            <p>Drag & drop or click to upload</p>
                        </div>
                    ) : (
                        <div className="relative w-full h-full flex flex-col items-center justify-center gap-4">
                            <img src={imgSrc} alt="Source" className="max-w-[300px] max-h-[300px] object-contain shadow-sm border p-2 bg-white/50" />
                            <Button variant="ghost" onClick={() => setImgSrc("")}>Change Image</Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Download</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    {[16, 32, 48, 64, 128, 256].map(size => (
                        <div key={size} className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-900/50">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded border">
                                    {imgSrc && (
                                        <img src={imgSrc} alt="icon" style={{ width: size > 32 ? 32 : size, height: size > 32 ? 32 : size }} />
                                    )}
                                </div>
                                <div>
                                    <div className="font-medium">{size}x{size}</div>
                                    <div className="text-xs text-slate-500">PNG</div>
                                </div>
                            </div>
                            <Button size="sm" variant="outline" onClick={() => download(size)} disabled={!imgSrc}>
                                <Download className="h-4 w-4 mr-2" /> Download
                            </Button>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
