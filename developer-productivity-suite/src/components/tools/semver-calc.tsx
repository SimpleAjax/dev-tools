"use client";

import { useState } from "react";
import semver from "semver";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

export function SemVerCalc() {
    const [currentVersion, setCurrentVersion] = useState("1.0.0");
    const [preid, setPreid] = useState("beta");

    const isValid = semver.valid(currentVersion);

    const increments = [
        { type: "patch", label: "Patch", desc: "Bug fixes" },
        { type: "minor", label: "Minor", desc: "New features (backward compatible)" },
        { type: "major", label: "Major", desc: "Breaking changes" },
        { type: "prepatch", label: "Pre-Patch", desc: "" },
        { type: "preminor", label: "Pre-Minor", desc: "" },
        { type: "premajor", label: "Pre-Major", desc: "" },
        { type: "prerelease", label: "Pre-Release", desc: "Bump existing pre-id" },
    ] as const;

    return (
        <div className="grid gap-6 max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Current Version</CardTitle>
                    <CardDescription>Enter your current package version.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-4 items-start">
                        <div className="flex-1">
                            <Input
                                value={currentVersion}
                                onChange={(e) => setCurrentVersion(e.target.value)}
                                className={`font-mono text-lg ${isValid ? 'border-green-500' : 'border-red-500'}`}
                            />
                        </div>
                        <div className="w-32">
                            <Input
                                value={preid}
                                onChange={(e) => setPreid(e.target.value)}
                                placeholder="beta"
                                className="font-mono text-sm"
                            />
                            <div className="text-[10px] text-slate-500 mt-1">Prerelease ID</div>
                        </div>
                    </div>
                    {!isValid && (
                        <p className="text-red-500 text-sm">Invalid SemVer version.</p>
                    )}
                </CardContent>
            </Card>

            {isValid && (
                <div className="grid md:grid-cols-2 gap-4">
                    {increments.map((inc) => {
                        const nextVer = semver.inc(currentVersion, inc.type, preid);

                        return (
                            <Card key={inc.type} className="hover:border-blue-400 transition-colors cursor-pointer group" onClick={() => nextVer && setCurrentVersion(nextVer)}>
                                <CardHeader className="p-4 pb-2">
                                    <div className="flex justify-between items-center">
                                        <Badge variant="outline">{inc.label}</Badge>
                                        <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500" />
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 pt-2 space-y-2">
                                    <div className="text-2xl font-bold font-mono tracking-tight">
                                        {nextVer}
                                    </div>
                                    {inc.desc && (
                                        <p className="text-xs text-slate-500">{inc.desc}</p>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
