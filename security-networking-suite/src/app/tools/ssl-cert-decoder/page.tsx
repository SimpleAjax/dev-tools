"use client";

import { ToolShell } from "@/components/tool-shell";
import { useState } from "react";
import * as forge from "node-forge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Lock, FileText, Calendar, Shield, AlertTriangle } from "lucide-react";

export default function SSLCertDecoder() {
    const [input, setInput] = useState("");
    const [certInfo, setCertInfo] = useState<any>(null);
    const [error, setError] = useState("");

    const decodeCert = () => {
        setError("");
        setCertInfo(null);
        try {
            const cert = forge.pki.certificateFromPem(input);

            const fingerprint = forge.md.sha1.create().update(forge.asn1.toDer(forge.pki.certificateToAsn1(cert)).getBytes()).digest().toHex();
            const fingerprint256 = forge.md.sha256.create().update(forge.asn1.toDer(forge.pki.certificateToAsn1(cert)).getBytes()).digest().toHex();

            setCertInfo({
                subject: cert.subject.attributes.map(attr => ({ name: attr.name || attr.shortName, value: attr.value })),
                issuer: cert.issuer.attributes.map(attr => ({ name: attr.name || attr.shortName, value: attr.value })),
                validFrom: cert.validity.notBefore,
                validTo: cert.validity.notAfter,
                serialNumber: cert.serialNumber,
                fingerprint: fingerprint.toUpperCase().match(/.{2}/g)?.join(":"),
                fingerprint256: fingerprint256.toUpperCase().match(/.{2}/g)?.join(":"),
                valid: new Date() >= cert.validity.notBefore && new Date() <= cert.validity.notAfter
            });
        } catch (e) {
            setError("Invalid certificate format. Ensure it is a valid PEM formatted certificate (begins with -----BEGIN CERTIFICATE-----).");
        }
    };

    return (
        <ToolShell toolName="SSL Cert Decoder" description="Decode and analyze SSL/TLS certificates locally." icon={<Lock className="h-6 w-6" />}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6 space-y-4">
                    <div className="space-y-2">
                        <Label>Certificate (PEM Format)</Label>
                        <Textarea
                            placeholder="-----BEGIN CERTIFICATE-----..."
                            className="font-mono text-sm min-h-[400px]"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                    </div>
                    <Button onClick={decodeCert} className="w-full">Decode Certificate</Button>
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            {error}
                        </div>
                    )}
                </Card>

                <div className="space-y-6">
                    {certInfo ? (
                        <>
                            <Card className="p-6 space-y-4 relative overflow-hidden">
                                <div className={`absolute top-0 left-0 w-1 h-full ${certInfo.valid ? "bg-green-500" : "bg-red-500"}`} />
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    Security Overview
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-muted rounded-lg">
                                        <div className="text-xs text-muted-foreground uppercase">Status</div>
                                        <div className={`font-medium ${certInfo.valid ? "text-green-600" : "text-red-600"}`}>
                                            {certInfo.valid ? "Valid" : "Expired / Not Yet Valid"}
                                        </div>
                                    </div>
                                    <div className="p-3 bg-muted rounded-lg">
                                        <div className="text-xs text-muted-foreground uppercase">Serial Number</div>
                                        <div className="font-mono text-xs break-all">{certInfo.serialNumber}</div>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-6 space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Validity Period
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-muted-foreground">Issued On</span>
                                        <span className="font-medium">{certInfo.validFrom.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-muted-foreground">Expires On</span>
                                        <span className="font-medium">{certInfo.validTo.toLocaleString()}</span>
                                    </div>
                                    <div className="pt-2">
                                        <span className="text-muted-foreground block mb-1">Fingerprint (SHA1)</span>
                                        <code className="block bg-muted p-2 rounded text-xs break-all">{certInfo.fingerprint}</code>
                                    </div>
                                    <div className="pt-2">
                                        <span className="text-muted-foreground block mb-1">Fingerprint (SHA256)</span>
                                        <code className="block bg-muted p-2 rounded text-xs break-all">{certInfo.fingerprint256}</code>
                                    </div>
                                </div>
                            </Card>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="p-6 space-y-3">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-blue-500" />
                                        Subject (Issued To)
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        {certInfo.subject.map((attr: any, i: number) => (
                                            <div key={i} className="flex flex-col border-b pb-1 last:border-0">
                                                <span className="text-[10px] text-muted-foreground uppercase">{attr.name}</span>
                                                <span className="font-medium">{attr.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                <Card className="p-6 space-y-3">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <Lock className="h-5 w-5 text-amber-500" />
                                        Issuer (Issued By)
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        {certInfo.issuer.map((attr: any, i: number) => (
                                            <div key={i} className="flex flex-col border-b pb-1 last:border-0">
                                                <span className="text-[10px] text-muted-foreground uppercase">{attr.name}</span>
                                                <span className="font-medium">{attr.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-12 border-2 border-dashed rounded-xl">
                            <Lock className="h-12 w-12 mb-4 opacity-20" />
                            <p>Enter a certificate PEM string to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </ToolShell>
    );
}
