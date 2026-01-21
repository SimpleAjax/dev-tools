"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, ShieldAlert, Lock, Smartphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ThreeDSecureSim() {
    const [step, setStep] = useState(1);
    const [status, setStatus] = useState("idle"); // idle, challange, success, failure

    const reset = () => {
        setStep(1);
        setStatus("idle");
    };

    const next = () => {
        if (step === 2) {
            // Determines frictionless vs challenge
            const isChallenge = Math.random() > 0.5;
            if (isChallenge) {
                setStep(3); // Challenge
            } else {
                setStep(4); // Frictionless Success
            }
        } else {
            setStep(step + 1);
        }
    };

    return (
        <div className="space-y-8">
            {/* Visual Flow Diagram */}
            <div className="relative flex justify-between items-center max-w-4xl mx-auto py-8 px-4">
                {/* Line */}
                <div className="absolute left-0 right-0 top-1/2 h-1 bg-slate-800 -z-10 transform -translate-y-1/2"></div>

                {/* Step 1: Merchant Init */}
                <div className={`flex flex-col items-center gap-2 bg-slate-950 p-2 z-10 border-2 rounded-lg transition-colors ${step >= 1 ? "border-primary" : "border-slate-800"}`}>
                    <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center border border-slate-700">
                        <Lock className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="text-xs font-bold text-center">Merchant<br />Initiation</div>
                </div>

                {/* Step 2: Directory Server */}
                <div className={`flex flex-col items-center gap-2 bg-slate-950 p-2 z-10 border-2 rounded-lg transition-colors ${step >= 2 ? "border-primary" : "border-slate-800"}`}>
                    <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center border border-slate-700">
                        <ShieldAlert className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="text-xs font-bold text-center">Directory<br />Server</div>
                </div>

                {/* Step 3: ACS (Issuer) */}
                <div className={`flex flex-col items-center gap-2 bg-slate-950 p-2 z-10 border-2 rounded-lg transition-colors ${step >= 3 ? "border-primary" : "border-slate-800"}`}>
                    <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center border border-slate-700">
                        <Smartphone className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="text-xs font-bold text-center">ACS<br />(Issuer)</div>
                </div>

                {/* Step 4: Result */}
                <div className={`flex flex-col items-center gap-2 bg-slate-950 p-2 z-10 border-2 rounded-lg transition-colors ${step >= 4 ? "border-green-500" : "border-slate-800"}`}>
                    <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center border border-slate-700">
                        <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="text-xs font-bold text-center">Final<br />Auth</div>
                </div>
            </div>

            {/* Console / Simulator */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-96">
                <Card className="border-slate-800 bg-slate-900/50 flex flex-col justify-center items-center p-6 text-center space-y-4">
                    {step === 1 && (
                        <>
                            <h3 className="text-xl font-bold">1. Checkout Initiation</h3>
                            <p className="text-muted-foreground text-sm">Customer clicks "Pay" on the merchant site.</p>
                            <Button onClick={next}>Start 3DS Flow</Button>
                        </>
                    )}
                    {step === 2 && (
                        <>
                            <h3 className="text-xl font-bold">2. Risk Analysis</h3>
                            <p className="text-muted-foreground text-sm">Directory Server / ACS analyzes device fingerprint, location, and past history.</p>
                            <Button size="lg" className="w-full max-w-xs animate-pulse" onClick={next}>
                                Analyzing Risks...
                            </Button>
                        </>
                    )}
                    {step === 3 && (
                        <>
                            <h3 className="text-xl font-bold text-yellow-500">3. Challenge Required</h3>
                            <p className="text-muted-foreground text-sm">High risk or random check. User must enter OTP.</p>
                            <div className="flex gap-2 w-full max-w-xs">
                                <Button className="flex-1" onClick={() => setStep(4)} variant="default">Verify OTP</Button>
                                <Button className="flex-1" onClick={() => { setStep(4); setStatus("failed"); }} variant="destructive">Fail</Button>
                            </div>
                        </>
                    )}
                    {step === 4 && (
                        <>
                            <h3 className={`text-xl font-bold ${status === "failed" ? "text-red-500" : "text-green-500"}`}>
                                {status === "failed" ? "Authentication Failed" : "Authorized"}
                            </h3>
                            <p className="text-muted-foreground text-sm">
                                {status === "failed" ? "Liability stays with Issuer (mostly)." : "Transaction proceeds. Liability Shift active."}
                            </p>
                            <Button variant="outline" onClick={reset}>Test Again</Button>
                        </>
                    )}
                </Card>

                <Card className="border-slate-800 bg-slate-950 font-mono text-xs overflow-y-auto p-4">
                    <div className="space-y-2">
                        <div className="text-muted-foreground">// Protocol Log</div>
                        {step >= 1 && <div className="text-blue-400">{`> AReq (Auth Request) sent to DS`}</div>}
                        {step >= 2 && <div className="text-blue-400">{`> DS routes to Issuer ACS URL`}</div>}
                        {step >= 3 && (
                            <div className="text-yellow-400">
                                {`> ACS returns CRes (Challenge Response)`}<br />
                                {`> Rendering iFrame / Challenge Window`}
                            </div>
                        )}
                        {step >= 4 && (
                            <div className={status === "failed" ? "text-red-400" : "text-green-400"}>
                                {`> RReq (Results Request) sent to switch`}<br />
                                {`> Final Status: ${status === "failed" ? "N (Not Auth)" : "Y (Auth Success)"}`}<br />
                                {`> Liability Shift: ${status === "failed" ? "FALSE" : "TRUE"}`}
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
