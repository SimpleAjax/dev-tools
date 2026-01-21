"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock Data for "Educational" purposes (Engineering as Marketing)
// In a real app, this hits the OFAC API or a processed vector DB
const MOCK_SDN_LIST = [
    { id: "1001", name: "EVIL CORP INTERNATIONAL", type: "Entity", program: "CYBER2", remarks: "Linked to ransomware." },
    { id: "1002", name: "DR. CHAOS", type: "Individual", program: "SDGT", remarks: "General misconduct." },
    { id: "1003", name: "NORTHERN TRADE COMPANY", type: "Entity", program: "DPRK3", remarks: "Sanctioned exports." },
    { id: "1004", name: "BAD ACTOR LLC", type: "Entity", program: "SDNTK", remarks: "Narcotics trafficking." },
];

export function SanctionsSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);

    const search = (q: string) => {
        setQuery(q);
        if (q.length < 2) {
            setResults([]);
            return;
        }
        // Fuzzy-ish match
        const hits = MOCK_SDN_LIST.filter(item =>
            item.name.toLowerCase().includes(q.toLowerCase()) ||
            item.program.toLowerCase().includes(q.toLowerCase())
        );
        setResults(hits);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Card className="border-slate-800 bg-slate-900/50">
                <CardHeader><CardTitle>OFAC SDN Search (Mock)</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            value={query}
                            onChange={(e) => search(e.target.value)}
                            className="pl-9 h-12 text-lg"
                            placeholder="Type 'Evil' or 'Trade'..."
                        />
                    </div>
                    <p className="text-xs text-muted-foreground">
                        *This is a demo database. Real production systems sync with the US Treasury daily XML feed.
                    </p>
                </CardContent>
            </Card>

            {results.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Potential Matches</h3>
                    {results.map(r => (
                        <Card key={r.id} className="border-red-500/30 bg-red-950/10 hover:bg-red-950/20 transition-colors cursor-pointer">
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-bold text-lg text-red-200">{r.name}</div>
                                        <div className="text-sm text-red-300/70">{r.remarks}</div>
                                    </div>
                                    <Badge variant="destructive">{r.program}</Badge>
                                </div>
                                <div className="mt-2 text-xs font-mono text-muted-foreground">ID: {r.id} | Type: {r.type}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {query.length > 2 && results.length === 0 && (
                <div className="text-center p-8 border border-dashed border-slate-800 rounded-lg text-muted-foreground">
                    No matches found in mock database.
                    <br /><span className="text-green-500 text-sm">Clean Check</span>
                </div>
            )}
        </div>
    );
}
