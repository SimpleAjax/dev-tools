"use client";

import { ToolShell } from "@/components/tool-shell";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Server, Calendar, User, Globe } from "lucide-react";

export default function WhoisLookup() {
    const [domain, setDomain] = useState("");
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const lookup = async () => {
        if (!domain) return;
        setLoading(true);
        setData(null);

        // Simulate network delay
        await new Promise(r => setTimeout(r, 800));

        // Mock Data Generation
        const isRegistered = !domain.includes("free");

        setData({
            domainName: domain.toUpperCase(),
            registrar: isRegistered ? "GoDaddy.com, LLC" : "N/A",
            whoisServer: "whois.godaddy.com",
            updatedDate: isRegistered ? "2023-11-15T10:00:00Z" : null,
            creationDate: isRegistered ? "2010-05-20T08:00:00Z" : null,
            expiryDate: isRegistered ? "2028-05-20T08:00:00Z" : null,
            nameservers: isRegistered ? [
                "NS1.EXAMPLEDNS.COM",
                "NS2.EXAMPLEDNS.COM"
            ] : [],
            status: isRegistered ? [
                "clientDeleteProhibited",
                "clientTransferProhibited",
                "clientUpdateProhibited"
            ] : ["No match for domain"]
        });

        setLoading(false);
    };

    return (
        <ToolShell toolName="Whois Lookup" description="Retrieve domain registration information (Simulated for Demo)." icon={<Search className="h-6 w-6" />}>
            <div className="max-w-3xl mx-auto space-y-6">
                <Card className="p-6">
                    <div className="flex gap-4">
                        <Input
                            placeholder="example.com"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && lookup()}
                        />
                        <Button onClick={lookup} disabled={loading}>
                            {loading ? "Searching..." : "Lookup"}
                        </Button>
                    </div>
                </Card>

                {data && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {data.registrar !== "N/A" ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Card className="p-4 space-y-3">
                                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                                            <Server className="h-4 w-4" /> Registrar
                                        </div>
                                        <div className="font-semibold text-lg">{data.registrar}</div>
                                        <div className="text-xs text-muted-foreground">{data.whoisServer}</div>
                                    </Card>
                                    <Card className="p-4 space-y-3">
                                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                                            <Calendar className="h-4 w-4" /> Important Dates
                                        </div>
                                        <div className="space-y-1 text-sm">
                                            <div className="flex justify-between">
                                                <span>Registered:</span>
                                                <span className="font-medium">{new Date(data.creationDate).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Expires:</span>
                                                <span className="font-medium text-amber-600">{new Date(data.expiryDate).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Updated:</span>
                                                <span className="font-medium">{new Date(data.updatedDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </Card>
                                </div>

                                <Card className="p-6 space-y-4">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <Globe className="h-4 w-4" /> Name Servers
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {data.nameservers.map((ns: string, i: number) => (
                                            <div key={i} className="bg-muted p-2 rounded text-sm font-mono">{ns}</div>
                                        ))}
                                    </div>
                                </Card>

                                <Card className="p-6 space-y-4">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <User className="h-4 w-4" /> Domain Status
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {data.status.map((s: string, i: number) => (
                                            <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs border border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </Card>
                            </>
                        ) : (
                            <Card className="p-12 flex flex-col items-center justify-center text-center space-y-4">
                                <Globe className="h-16 w-16 text-muted-foreground opacity-20" />
                                <h3 className="text-xl font-semibold text-muted-foreground">Domain Available</h3>
                                <p className="text-muted-foreground max-w-md">
                                    The domain {data.domainName} does not appear to be registered. You might be able to buy it!
                                </p>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </ToolShell>
    );
}
