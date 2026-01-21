"use client";

import { ToolShell } from "@/components/tool-shell";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface DnsResult {
    provider: string;
    status: "pending" | "success" | "error";
    data?: string[];
    latency?: number;
}

const RESOLVERS = [
    { id: "google", name: "Google", url: "https://dns.google/resolve" },
    { id: "cloudflare", name: "Cloudflare", url: "https://cloudflare-dns.com/dns-query" },
    { id: "quad9", name: "Quad9", url: "https://dns.quad9.net:5053/dns-query" }, // Might have CORS issues
];

export default function DnsPropagation() {
    const [domain, setDomain] = useState("");
    const [type, setType] = useState("A");
    const [results, setResults] = useState<DnsResult[]>([]);
    const [loading, setLoading] = useState(false);

    const check = async () => {
        if (!domain) return;
        setLoading(true);
        const initialResults: DnsResult[] = RESOLVERS.map(r => ({ provider: r.name, status: "pending" }));
        setResults(initialResults);

        const promises = RESOLVERS.map(async (resolver, index) => {
            const start = performance.now();
            try {
                let url = `${resolver.url}?name=${domain}&type=${type}`;
                const headers: any = { "Accept": "application/dns-json" };

                const res = await fetch(url, { headers });
                if (!res.ok) throw new Error("Failed");
                const json = await res.json();

                const answers = json.Answer ? json.Answer.map((a: any) => a.data) : ["No records found"];
                const end = performance.now();

                setResults(prev => {
                    const next = [...prev];
                    next[index] = {
                        provider: resolver.name,
                        status: "success",
                        data: answers,
                        latency: Math.round(end - start)
                    };
                    return next;
                });
            } catch (e) {
                setResults(prev => {
                    const next = [...prev];
                    next[index] = { provider: resolver.name, status: "error" };
                    return next;
                });
            }
        });

        await Promise.all(promises);
        setLoading(false);
    };

    return (
        <ToolShell toolName="DNS Propagation Checker" description="Check DNS records across multiple global resolvers via DoH." icon={<Globe className="h-6 w-6" />}>
            <div className="max-w-4xl mx-auto space-y-8">
                <Card className="p-6">
                    <div className="flex gap-4">
                        <Input
                            placeholder="example.com"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            className="flex-1"
                        />
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger className="w-[100px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="A">A</SelectItem>
                                <SelectItem value="AAAA">AAAA</SelectItem>
                                <SelectItem value="CNAME">CNAME</SelectItem>
                                <SelectItem value="MX">MX</SelectItem>
                                <SelectItem value="TXT">TXT</SelectItem>
                                <SelectItem value="NS">NS</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button onClick={check} disabled={loading}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Check
                        </Button>
                    </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.map((res, i) => (
                        <Card key={i} className="p-4 flex flex-col gap-3">
                            <div className="flex items-center justify-between border-b pb-2">
                                <span className="font-semibold">{res.provider}</span>
                                {res.status === "pending" && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                                {res.status === "success" && <div className="flex items-center gap-1 text-xs text-green-600 font-medium"><CheckCircle2 className="h-3 w-3" /> {res.latency}ms</div>}
                                {res.status === "error" && <XCircle className="h-4 w-4 text-red-500" />}
                            </div>
                            <div className="min-h-[60px] text-sm font-mono break-all">
                                {res.status === "success" && res.data?.map((r, j) => (
                                    <div key={j} className="mb-1 last:mb-0">{r}</div>
                                ))}
                                {res.status === "error" && <span className="text-muted-foreground italic">Request Failed (CORS or Network)</span>}
                                {res.status === "pending" && <span className="text-muted-foreground italic">Querying...</span>}
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </ToolShell>
    );
}
