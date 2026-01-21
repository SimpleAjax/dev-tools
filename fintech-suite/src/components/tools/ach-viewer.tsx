"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea"; // Ensure this import path is correct and exists
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function AchViewer() {
    const [fileContent, setFileContent] = useState("");
    const [parsedLines, setParsedLines] = useState<any[]>([]);

    const parseAch = () => {
        const lines = fileContent.split("\n").filter(l => l.length > 0);
        const result = lines.map((line, idx) => {
            const type = line[0];
            let description = "Unknown";
            let color = "text-slate-500";
            let detail = "";

            switch (type) {
                case "1":
                    description = "File Header";
                    color = "text-blue-400";
                    detail = `Origin: ${line.substring(13, 23)} | Dest: ${line.substring(3, 13)}`;
                    break;
                case "5":
                    description = "Company/Batch Header";
                    color = "text-yellow-400";
                    detail = `Co: ${line.substring(4, 20).trim()} | SEC: ${line.substring(50, 53)}`;
                    break;
                case "6":
                    description = "Entry Detail";
                    color = "text-green-400";
                    detail = `Amount: $${parseInt(line.substring(29, 39)) / 100} | Acc: ${line.substring(39, 54).trim()}`;
                    break;
                case "7": description = "Addenda"; color = "text-slate-400"; break;
                case "8": description = "Batch Control"; color = "text-yellow-600"; break;
                case "9": description = "File Control"; color = "text-blue-600"; break;
            }

            return { id: idx + 1, line, type, description, color, detail };
        });
        setParsedLines(result);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            <div className="space-y-6">
                <Card className="border-slate-800 bg-slate-900/50">
                    <CardHeader><CardTitle>NACHA File Input</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            value={fileContent}
                            onChange={(e) => setFileContent(e.target.value)}
                            className="font-mono text-xs h-96 whitespace-pre"
                            placeholder={`101 021000021 021000021 210101 0000 A094101...`}
                        />
                        <div className="flex gap-2">
                            <Button onClick={parseAch}>Visualize</Button>
                            <Button variant="ghost" onClick={() => setFileContent(
                                `101 031000042 999999999 190924 1639 A094101FEDWIRE              PPDSERVICE         7031000040000001
5200PPDSERVICE                         15CCDTrnsfr         190924190924   1031000040000001
6221031000040854321          00000010001509210000002000PAYROLL   0031000040000001
8200000001000103100004000000000001000000010000000100                         031000040000001
900000100000100000001000001000000010000000100                                       99999999`
                            )}>Load Sample</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-6">
                <Card className="border-slate-800 bg-slate-900/50 h-full">
                    <CardHeader><CardTitle>Structure Visualization</CardTitle></CardHeader>
                    <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
                        {parsedLines.map((row) => (
                            <div key={row.id} className="p-2 border border-slate-800 rounded bg-slate-950 flex flex-col gap-1">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono text-muted-foreground w-6">{row.id}</span>
                                        <Badge variant="outline" className={`${row.color} border-current`}>{row.type} - {row.description}</Badge>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{row.detail}</span>
                                </div>
                                <code className="text-[10px] text-muted-foreground break-all">{row.line}</code>
                            </div>
                        ))}
                        {parsedLines.length === 0 && <p className="text-muted-foreground text-sm">Parse a file to see entries.</p>}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
