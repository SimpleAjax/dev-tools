"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CopyButton } from "@/components/tool-shell";

export function SslCsrGenerator() {
    const [form, setForm] = useState({
        commonName: "example.com",
        organization: "",
        orgUnit: "",
        city: "",
        state: "",
        country: "US",
        keySize: "2048",
        algorithm: "rsa",
    });

    const [command, setCommand] = useState("");

    useEffect(() => {
        // OpenSSL Command Builder
        const parts = ["openssl req", "-new", "-newkey rsa:" + form.keySize, "-nodes"];

        // Key output
        const domainSlug = form.commonName.replace(/[^a-z0-9]/gi, "_").toLowerCase() || "domain";
        parts.push(`-keyout ${domainSlug}.key`);
        parts.push(`-out ${domainSlug}.csr`);

        // Subject construction
        const subjParts = [];
        if (form.country) subjParts.push(`/C=${form.country}`);
        if (form.state) subjParts.push(`/ST=${form.state}`);
        if (form.city) subjParts.push(`/L=${form.city}`);
        if (form.organization) subjParts.push(`/O=${form.organization}`);
        if (form.orgUnit) subjParts.push(`/OU=${form.orgUnit}`);
        if (form.commonName) subjParts.push(`/CN=${form.commonName}`);

        if (subjParts.length > 0) {
            parts.push(`-subj "${subjParts.join("")}"`);
        }

        setCommand(parts.join(" "));
    }, [form]);

    const handleChange = (key: string, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column: Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Certificate Details</CardTitle>
                    <CardDescription>Enter the details for your Certificate Signing Request.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="commonName">Common Name (Domain)</Label>
                        <Input
                            id="commonName"
                            placeholder="e.g. example.com"
                            value={form.commonName}
                            onChange={(e) => handleChange("commonName", e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="country">Country Code (2 Letter)</Label>
                            <Input
                                id="country"
                                maxLength={2}
                                placeholder="US"
                                value={form.country}
                                onChange={(e) => handleChange("country", e.target.value.toUpperCase())}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="state">State / Province</Label>
                            <Input
                                id="state"
                                placeholder="California"
                                value={form.state}
                                onChange={(e) => handleChange("state", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="city">City / Locality</Label>
                        <Input
                            id="city"
                            placeholder="San Francisco"
                            value={form.city}
                            onChange={(e) => handleChange("city", e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="organization">Organization</Label>
                        <Input
                            id="organization"
                            placeholder="My Company, Inc."
                            value={form.organization}
                            onChange={(e) => handleChange("organization", e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="orgUnit">Organizational Unit</Label>
                        <Input
                            id="orgUnit"
                            placeholder="IT Department"
                            value={form.orgUnit}
                            onChange={(e) => handleChange("orgUnit", e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="keySize">Key Size</Label>
                        <Select value={form.keySize} onValueChange={(val) => handleChange("keySize", val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="2048">2048 bit (Standard)</SelectItem>
                                <SelectItem value="4096">4096 bit (High Security)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                </CardContent>
            </Card>

            {/* Right Column: Output */}
            <div className="space-y-6">
                <Card className="bg-slate-900 border-slate-800 text-slate-50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm uppercase tracking-wider text-slate-400">OpenSSL Command</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative">
                            <pre className="whitespace-pre-wrap break-all font-mono text-sm bg-slate-950 p-4 rounded-lg border border-slate-800 text-green-400">
                                {command}
                            </pre>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <CopyButton text={command} className="bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700" />
                        </div>

                        <div className="mt-6 text-sm text-slate-400">
                            <p className="mb-2 font-medium text-slate-300">What happens next?</p>
                            <ol className="list-decimal pl-4 space-y-1">
                                <li>Run this command in your terminal.</li>
                                <li>It creates a <strong>.key</strong> file (Private Key) - Keep this safe!</li>
                                <li>It creates a <strong>.csr</strong> file (Certificate Request).</li>
                                <li>Send the <strong>.csr</strong> file to your Certificate Authority (CA).</li>
                            </ol>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
