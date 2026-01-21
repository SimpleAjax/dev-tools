"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Trophy } from "lucide-react";

type Model = {
    rank: number;
    name: string;
    elo: number;
    license: "Proprietary" | "Open Weights" | "Open Source";
    provider: string;
    contextParams: string;
};

const MOCK_DATA: Model[] = [
    { rank: 1, name: "GPT-4o", elo: 1289, license: "Proprietary", provider: "OpenAI", contextParams: "128k" },
    { rank: 2, name: "Gemini 1.5 Pro", elo: 1272, license: "Proprietary", provider: "Google", contextParams: "2M" },
    { rank: 3, name: "Claude 3.5 Sonnet", elo: 1270, license: "Proprietary", provider: "Anthropic", contextParams: "200k" },
    { rank: 4, name: "GPT-4 Turbo", elo: 1255, license: "Proprietary", provider: "OpenAI", contextParams: "128k" },
    { rank: 5, name: "Claude 3 Opus", elo: 1248, license: "Proprietary", provider: "Anthropic", contextParams: "200k" },
    { rank: 6, name: "Llama 3 70B-Instruct", elo: 1230, license: "Open Weights", provider: "Meta", contextParams: "8k" },
    { rank: 7, name: "Qwen 2.5 72B", elo: 1225, license: "Open Weights", provider: "Alibaba", contextParams: "32k" },
    { rank: 8, name: "DeepSeek-V2", elo: 1215, license: "Open Weights", provider: "DeepSeek", contextParams: "128k" },
    { rank: 9, name: "Mistral Large", elo: 1210, license: "Proprietary", provider: "Mistral", contextParams: "32k" },
    { rank: 10, name: "Mixtral 8x22B", elo: 1195, license: "Open Weights", provider: "Mistral", contextParams: "64k" },
    { rank: 11, name: "Command R+", elo: 1188, license: "Open Weights", provider: "Cohere", contextParams: "128k" },
    { rank: 12, name: "Gemma 2 9B", elo: 1180, license: "Open Weights", provider: "Google", contextParams: "8k" },
    { rank: 13, name: "Phi-3 Medium", elo: 1175, license: "Open Weights", provider: "Microsoft", contextParams: "128k" },
    { rank: 14, name: "Starling-LM-7B", elo: 1160, license: "Open Source", provider: "Nexusflow", contextParams: "8k" },
];

export function ModelLeaderboard() {
    const [search, setSearch] = useState("");

    const filteredModels = MOCK_DATA.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.provider.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search models or providers..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                        Global AI Model Elo Ratings
                    </CardTitle>
                    <CardDescription>Aggregated leaderboard based on human evaluations and crowdsourced benchmarks.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Rank</TableHead>
                                <TableHead>Model</TableHead>
                                <TableHead>Provider</TableHead>
                                <TableHead>License</TableHead>
                                <TableHead>Context View</TableHead>
                                <TableHead className="text-right">Elo Score</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredModels.map((model) => (
                                <TableRow key={model.rank}>
                                    <TableCell className="font-medium text-muted-foreground">#{model.rank}</TableCell>
                                    <TableCell className="font-semibold text-foreground">{model.name}</TableCell>
                                    <TableCell>{model.provider}</TableCell>
                                    <TableCell>
                                        <Badge variant={model.license === "Proprietary" ? "secondary" : "default"}>
                                            {model.license}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">{model.contextParams}</TableCell>
                                    <TableCell className="text-right font-mono font-bold text-primary">
                                        {model.elo}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredModels.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        No models found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
