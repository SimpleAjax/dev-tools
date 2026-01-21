"use client";

import { ToolShell } from "@/components/tool-shell";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, Network, Copy } from "lucide-react";
import ipaddr from "ipaddr.js";
import { CopyButton } from "@/components/tool-shell";

export default function IPv4ToIPv6() {
    const [ip, setIp] = useState("");
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState("");

    const convert = () => {
        setError("");
        setResult(null);
        try {
            if (!ipaddr.isValid(ip)) {
                setError("Invalid IP address");
                return;
            }

            const addr = ipaddr.parse(ip);
            const kind = addr.kind();

            if (kind === "ipv4") {
                const ipv4 = addr as ipaddr.IPv4;
                setResult({
                    original: ip,
                    kind: "IPv4",
                    mapped: ipv4.toIPv4MappedAddress().toString(),
                    sixtofour: (() => {
                        const bytes = ipv4.toByteArray();
                        const hex = bytes.map(b => b.toString(16).padStart(2, '0')).join('');
                        return `2002:${hex.substring(0, 4)}:${hex.substring(4, 8)}::`;
                    })(),
                    range: ipv4.range()
                });
            } else {
                const ipv6 = addr as ipaddr.IPv6;
                setResult({
                    original: ip,
                    kind: "IPv6",
                    normalized: ipv6.toNormalizedString(),
                    ipv4Mapped: ipv6.isIPv4MappedAddress() ? ipv6.toIPv4Address().toString() : "N/A",
                    range: ipv6.range()
                });
            }
        } catch (e) {
            setError("Error parsing IP");
        }
    };

    return (
        <ToolShell toolName="IPv4 to IPv6 Converter" description="Convert Internet Protocol addresses between versions and formats." icon={<Network className="h-6 w-6" />}>
            <div className="max-w-2xl mx-auto space-y-6">
                <Card className="p-6">
                    <div className="flex gap-4">
                        <Input
                            placeholder="e.g. 192.168.1.1 or ::ffff:192.168.1.1"
                            value={ip}
                            onChange={(e) => setIp(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && convert()}
                        />
                        <Button onClick={convert}>Convert</Button>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </Card>

                {result && (
                    <Card className="p-6 space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b">
                            <div className="space-y-1">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <Network className="h-4 w-4 text-blue-500" />
                                    Results
                                </h3>
                                <p className="text-xs text-muted-foreground uppercase">{result.kind} Address Detected</p>
                            </div>
                        </div>

                        {result.kind === "IPv4" && (
                            <div className="grid gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm text-muted-foreground">IPv4-Mapped IPv6 Address</label>
                                    <div className="flex gap-2">
                                        <code className="flex-1 p-2 bg-muted rounded font-mono">{result.mapped}</code>
                                        <CopyButton text={result.mapped} />
                                    </div>
                                    <p className="text-xs text-muted-foreground">Used to represent IPv4 addresses in IPv6 sockets (hybrid stack).</p>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm text-muted-foreground">6to4 Address</label>
                                    <div className="flex gap-2">
                                        <code className="flex-1 p-2 bg-muted rounded font-mono">{result.sixtofour}</code>
                                        <CopyButton text={result.sixtofour} />
                                    </div>
                                    <p className="text-xs text-muted-foreground">Transition mechanism for migrating from IPv4 to IPv6.</p>
                                </div>
                            </div>
                        )}

                        {result.kind === "IPv6" && (
                            <div className="grid gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm text-muted-foreground">Normalized Format</label>
                                    <div className="flex gap-2">
                                        <code className="flex-1 p-2 bg-muted rounded font-mono">{result.normalized}</code>
                                        <CopyButton text={result.normalized} />
                                    </div>
                                </div>
                                {result.ipv4Mapped !== "N/A" && (
                                    <div className="space-y-1">
                                        <label className="text-sm text-muted-foreground">Extracted IPv4</label>
                                        <div className="flex gap-2">
                                            <code className="flex-1 p-2 bg-muted rounded font-mono">{result.ipv4Mapped}</code>
                                            <CopyButton text={result.ipv4Mapped} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </Card>
                )}
            </div>
        </ToolShell>
    );
}
