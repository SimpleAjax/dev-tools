"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function HexEditor() {
    const [data, setData] = useState<Uint8Array>(new Uint8Array(0));
    const [fileName, setFileName] = useState<string | null>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (event) => {
            const buffer = event.target?.result as ArrayBuffer;
            if (buffer) {
                // Limit size for performance (e.g., 50KB)
                if (buffer.byteLength > 51200) {
                    setData(new Uint8Array(buffer.slice(0, 51200))); // Truncate
                    alert("File too large. Truncating to 50KB for viewer performance.");
                } else {
                    setData(new Uint8Array(buffer));
                }
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleTextUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        const encoder = new TextEncoder();
        setData(encoder.encode(text));
        setFileName("text-input.txt");
    }

    const rows = [];
    const bytesPerRow = 16;
    for (let i = 0; i < data.length; i += bytesPerRow) {
        rows.push(data.subarray(i, i + bytesPerRow));
    }

    return (
        <Card className="h-[calc(100vh-200px)] flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Hex Viewer {fileName && <span className="text-sm font-normal text-slate-500">({fileName})</span>}</CardTitle>
                <div className="flex gap-2">
                    <div className="relative">
                        <Button variant="outline" className="cursor-pointer">Open File</Button>
                        <Input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={handleFileUpload}
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 overflow-y-auto font-mono text-sm bg-slate-50 dark:bg-slate-900 mx-6 mb-6 rounded-md border p-4">
                {data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <p>No file loaded.</p>
                        <p className="text-xs mt-2">Upload a file to view its hex content.</p>
                    </div>
                ) : (
                    <div className="w-full">
                        <div className="grid grid-cols-[80px_1fr_1fr] md:grid-cols-[80px_350px_150px] lg:grid-cols-[100px_450px_200px] gap-4 border-b pb-2 mb-2 font-bold text-slate-500">
                            <div>Offset</div>
                            <div>Hex</div>
                            <div>ASCII</div>
                        </div>
                        {rows.map((row, rowIndex) => {
                            const offset = (rowIndex * bytesPerRow).toString(16).padStart(8, '0').toUpperCase();
                            const hex = Array.from(row).map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');

                            // Simple ASCII rep (replace non-printables with dot)
                            const ascii = Array.from(row).map(b => {
                                return (b >= 32 && b <= 126) ? String.fromCharCode(b) : '.';
                            }).join('');

                            return (
                                <div key={rowIndex} className="grid grid-cols-[80px_1fr_1fr] md:grid-cols-[80px_350px_150px] lg:grid-cols-[100px_450px_200px] gap-4 hover:bg-slate-200 dark:hover:bg-slate-800">
                                    <div className="text-slate-500 select-none">{offset}</div>
                                    <div className="text-blue-600 dark:text-blue-400">{hex}</div>
                                    <div className="text-slate-800 dark:text-slate-200">{ascii}</div>
                                </div>
                            );
                        })}
                        {data.length >= 51200 && (
                            <div className="p-4 text-center text-amber-500 italic">
                                ... Output truncated at 50KB ...
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
