"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";

// Simplified 12 Requirements of PCI DSS v4.0
const REQUIREMENTS = [
    { id: 1, title: "Install and Maintain Network Security Controls", desc: "Firewalls, routers, and cloud security groups configured securely." },
    { id: 2, title: "Apply Secure Configurations", desc: "No default passwords. Remove unnecessary software/services." },
    { id: 3, title: "Protect Stored Account Data", desc: "Encryption at rest. Retention policies. Truncation." },
    { id: 4, title: "Protect Data in Transit", desc: "Strong cryptography (TLS 1.2+) during transmission over open networks." },
    { id: 5, title: "Protect Against Malicious Software", desc: "Anti-virus/Anti-malware updated regularly." },
    { id: 6, title: "Develop and Maintain Secure Systems", desc: "Patching. Secure coding (OWASP Top 10). Vulnerability management." },
    { id: 7, title: "Restrict Access Need-to-Know", desc: "Access control systems based on business justification." },
    { id: 8, title: "Identify and Authenticate Access", desc: "Unique IDs. MFA (Multi-Factor Authentication) for all non-console access." },
    { id: 9, title: "Restrict Physical Access", desc: "Badge systems. Video cameras for sensitive areas. Destroy media." },
    { id: 10, title: "Log and Monitor All Access", desc: "Audit trails linked to individual users. Review logs daily." },
    { id: 11, title: "Test Security Systems Regularly", desc: "Quarterly wireless scans. External/Internal pen tests." },
    { id: 12, title: "Maintain InfoSec Policies", desc: "Annual risk assessment. Employee training. Incident response plan." }
];

export function PciDssCheck() {
    const [checked, setChecked] = useState<Record<number, boolean>>({});

    const count = Object.values(checked).filter(Boolean).length;
    const total = REQUIREMENTS.length;
    const percentage = (count / total) * 100;

    const toggle = (id: number) => {
        setChecked(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                {REQUIREMENTS.map((req) => (
                    <Card key={req.id}
                        className={`border-slate-800 transition-colors ${checked[req.id] ? "bg-slate-900/50 border-green-900/30" : "bg-slate-900/20"}`}
                    >
                        <CardContent className="p-4 flex items-start space-x-4">
                            <Checkbox
                                id={`req-${req.id}`}
                                checked={checked[req.id] || false}
                                onCheckedChange={() => toggle(req.id)}
                                className="mt-1"
                            />
                            <div className="space-y-1">
                                <label htmlFor={`req-${req.id}`} className="font-semibold cursor-pointer">
                                    Requirement {req.id}: {req.title}
                                </label>
                                <p className="text-sm text-muted-foreground">{req.desc}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-6">
                    <Card className="border-slate-800 bg-slate-900/80 backdrop-blur">
                        <CardHeader><CardTitle>Audit Progress</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span>Compliance</span>
                                <span>{Math.round(percentage)}%</span>
                            </div>
                            <Progress value={percentage} className="h-2" />

                            {percentage === 100 ? (
                                <div className="flex flex-col items-center gap-2 p-6 bg-green-900/10 rounded-lg border border-green-500/50 text-green-400 animate-in fade-in zoom-in">
                                    <ShieldCheck className="h-12 w-12" />
                                    <h3 className="font-bold text-lg">Readiness Ready</h3>
                                    <p className="text-xs text-center opacity-80">This is a self-assessment. Consult a QSA for official ROC.</p>
                                </div>
                            ) : (
                                <div className="text-sm text-muted-foreground text-center p-4">
                                    Complete all 12 areas to generate readiness badge.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
