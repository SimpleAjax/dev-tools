"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox"; // Will need to install checkbox
import { Label } from "@/components/ui/label"; // Will need to install label
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // Will need to install table
import { CopyButton } from "@/components/tool-shell";

type PermissionType = "read" | "write" | "execute";
type EntityType = "owner" | "group" | "public";

interface PermissionState {
    owner: { read: boolean; write: boolean; execute: boolean };
    group: { read: boolean; write: boolean; execute: boolean };
    public: { read: boolean; write: boolean; execute: boolean };
}

export function ChmodCalculator() {
    const [permissions, setPermissions] = useState<PermissionState>({
        owner: { read: true, write: true, execute: true }, // 7
        group: { read: true, write: false, execute: true }, // 5
        public: { read: true, write: false, execute: true }, // 5
    });

    const [octal, setOctal] = useState("755");
    const [symbolic, setSymbolic] = useState("-rwxr-xr-x");

    // Calculate Octal and Symbolic strings whenever permissions change
    useEffect(() => {
        let octalStr = "";
        let symStr = "-";

        // Helper to calculate score for a group
        const calcScore = (p: { read: boolean; write: boolean; execute: boolean }) => {
            let score = 0;
            if (p.read) score += 4;
            if (p.write) score += 2;
            if (p.execute) score += 1;
            return score;
        };

        const getSym = (p: { read: boolean; write: boolean; execute: boolean }) => {
            return (p.read ? "r" : "-") + (p.write ? "w" : "-") + (p.execute ? "x" : "-");
        };

        octalStr += calcScore(permissions.owner);
        octalStr += calcScore(permissions.group);
        octalStr += calcScore(permissions.public);

        symStr += getSym(permissions.owner);
        symStr += getSym(permissions.group);
        symStr += getSym(permissions.public);

        setOctal(octalStr);
        setSymbolic(symStr);
    }, [permissions]);

    const togglePermission = (entity: EntityType, type: PermissionType) => {
        setPermissions((prev) => ({
            ...prev,
            [entity]: {
                ...prev[entity],
                [type]: !prev[entity][type],
            },
        }));
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column: Interactive Grid */}
            <Card>
                <CardHeader>
                    <CardTitle>Permission Matrix</CardTitle>
                    <CardDescription>Check the boxes to set permissions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Entity</TableHead>
                                <TableHead className="text-center text-blue-600 font-bold">Read (4)</TableHead>
                                <TableHead className="text-center text-green-600 font-bold">Write (2)</TableHead>
                                <TableHead className="text-center text-red-600 font-bold">Execute (1)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(["owner", "group", "public"] as EntityType[]).map((entity) => (
                                <TableRow key={entity}>
                                    <TableCell className="font-medium capitalize">{entity}</TableCell>
                                    {(["read", "write", "execute"] as PermissionType[]).map((type) => (
                                        <TableCell key={type} className="text-center">
                                            <div className="flex justify-center">
                                                <Checkbox
                                                    checked={permissions[entity][type]}
                                                    onCheckedChange={() => togglePermission(entity, type)}
                                                    id={`${entity}-${type}`}
                                                    className="h-6 w-6"
                                                />
                                            </div>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Right Column: Output & Visualization */}
            <div className="space-y-6">
                {/* Octal Output */}
                <Card className="bg-slate-900 border-slate-800 text-slate-50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm uppercase tracking-wider text-slate-400">Octal Notation (chmod)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="text-6xl font-mono tracking-widest font-bold text-blue-400">
                                {octal}
                            </div>
                            <div className="flex gap-2">
                                <CopyButton text={octal} className="bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700" />
                                <CopyButton text={`chmod ${octal} filename`} className="bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700" />
                            </div>
                        </div>
                        <p className="mt-4 text-xs text-slate-500">
                            Common command: <code className="bg-slate-800 px-1 py-0.5 rounded">chmod {octal} file.txt</code>
                        </p>
                    </CardContent>
                </Card>

                {/* Symbolic Output */}
                <Card className="bg-slate-900 border-slate-800 text-slate-50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm uppercase tracking-wider text-slate-400">Symbolic Notation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="text-4xl font-mono tracking-wider font-bold text-green-400 break-all">
                                {symbolic}
                            </div>
                            <CopyButton text={symbolic} className="bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700" />

                        </div>
                        <div className="mt-6 space-y-2">
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <span className="w-20 font-bold text-slate-200">Owner:</span>
                                <span>{permissions.owner.read ? "Read" : "-"}, {permissions.owner.write ? "Write" : "-"}, {permissions.owner.execute ? "Execute" : "-"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <span className="w-20 font-bold text-slate-200">Group:</span>
                                <span>{permissions.group.read ? "Read" : "-"}, {permissions.group.write ? "Write" : "-"}, {permissions.group.execute ? "Execute" : "-"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <span className="w-20 font-bold text-slate-200">Public:</span>
                                <span>{permissions.public.read ? "Read" : "-"}, {permissions.public.write ? "Write" : "-"}, {permissions.public.execute ? "Execute" : "-"}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
