"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/tool-shell";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export function SpfDkimGenerator() {
    // SPF State
    const [spf, setSpf] = useState({
        mx: true,
        a: true,
        ptr: false,
        ip4: "",
        ip6: "",
        include: ["_spf.google.com"],
        policy: "~all" // -all (fail), ~all (soft fail), ?all (neutral)
    });

    // DMARC State
    const [dmarc, setDmarc] = useState({
        policy: "none", // none, quarantine, reject
        email: "mailto:admin@example.com",
        pct: 100
    });

    const generateSpf = () => {
        const parts = ["v=spf1"];
        if (spf.a) parts.push("a");
        if (spf.mx) parts.push("mx");
        if (spf.ptr) parts.push("ptr");
        if (spf.ip4) parts.push(`ip4:${spf.ip4}`);
        if (spf.ip6) parts.push(`ip6:${spf.ip6}`);
        spf.include.forEach(inc => {
            if (inc) parts.push(`include:${inc}`);
        });
        parts.push(spf.policy);
        return parts.join(" ");
    };

    const generateDmarc = () => {
        const parts = ["v=DMARC1"];
        parts.push(`p=${dmarc.policy}`);
        if (dmarc.pct < 100) parts.push(`pct=${dmarc.pct}`);
        if (dmarc.email) parts.push(`rua=${dmarc.email}`);
        return parts.join("; ");
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            {/* SPF Column */}
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>SPF Record Generator</CardTitle>
                        <CardDescription>Sender Policy Framework configuration.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Allow Domain MX Servers</Label>
                            <Switch checked={spf.mx} onCheckedChange={(c) => setSpf(p => ({ ...p, mx: c }))} />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>Allow Domain A Record</Label>
                            <Switch checked={spf.a} onCheckedChange={(c) => setSpf(p => ({ ...p, a: c }))} />
                        </div>

                        <div className="space-y-2">
                            <Label>Include Domains (e.g. for Google Workspace)</Label>
                            <Input
                                value={spf.include.join(", ")}
                                onChange={(e) => setSpf(p => ({ ...p, include: e.target.value.split(",").map(s => s.trim()) }))}
                                placeholder="_spf.google.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Specific IPv4</Label>
                            <Input value={spf.ip4} onChange={(e) => setSpf(p => ({ ...p, ip4: e.target.value }))} placeholder="192.0.2.1" />
                        </div>

                        <div className="space-y-2">
                            <Label>Policy (How to treat others)</Label>
                            <Select value={spf.policy} onValueChange={(v) => setSpf(p => ({ ...p, policy: v }))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="-all">Fail (-all) [Strict]</SelectItem>
                                    <SelectItem value="~all">Soft Fail (~all) [Recommended]</SelectItem>
                                    <SelectItem value="?all">Neutral (?all) [Test]</SelectItem>
                                    <SelectItem value="+all">Pass (+all) [Insecure]</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800 text-slate-50">
                    <CardHeader>
                        <CardTitle className="text-sm uppercase text-slate-400 tracking-wider">SPF DNS Record</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-1 font-mono text-sm break-all">
                            <div className="text-slate-500">Host: @</div>
                            <div className="text-slate-500">Type: TXT</div>
                            <div className="text-green-400 bg-slate-950 p-3 rounded border border-slate-800 flex justify-between items-center">
                                {generateSpf()}
                                <CopyButton text={generateSpf()} className="h-6 w-6 ml-2" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* DMARC Column */}
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>DMARC Generator</CardTitle>
                        <CardDescription>Domain-based Message Authentication, Reporting, and Conformance.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Policy for failures</Label>
                            <Select value={dmarc.policy} onValueChange={(v) => setDmarc(p => ({ ...p, policy: v }))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None (Log only)</SelectItem>
                                    <SelectItem value="quarantine">Quarantine (Spam folder)</SelectItem>
                                    <SelectItem value="reject">Reject (Block)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Report Email (RUA)</Label>
                            <Input value={dmarc.email} onChange={(e) => setDmarc(p => ({ ...p, email: e.target.value }))} />
                        </div>

                        <div className="space-y-2">
                            <Label>Percentage applied ({dmarc.pct}%)</Label>
                            <Input
                                type="number"
                                min={0} max={100}
                                value={dmarc.pct}
                                onChange={(e) => setDmarc(p => ({ ...p, pct: parseInt(e.target.value) }))}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800 text-slate-50">
                    <CardHeader>
                        <CardTitle className="text-sm uppercase text-slate-400 tracking-wider">DMARC DNS Record</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-1 font-mono text-sm break-all">
                            <div className="text-slate-500">Host: _dmarc</div>
                            <div className="text-slate-500">Type: TXT</div>
                            <div className="text-blue-400 bg-slate-950 p-3 rounded border border-slate-800 flex justify-between items-center">
                                {generateDmarc()}
                                <CopyButton text={generateDmarc()} className="h-6 w-6 ml-2" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
