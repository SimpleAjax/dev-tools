"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch"; // Need to install switch
import { CopyButton } from "@/components/tool-shell";

export function SshConfigGenerator() {
    const [config, setConfig] = useState({
        host: "myserver",
        hostName: "192.168.1.100",
        user: "root",
        port: "22",
        identityFile: "~/.ssh/id_rsa",
        useIdentityFile: false,
        forwardAgent: false,
        compression: false,
        proxyJump: "",
    });

    const [output, setOutput] = useState("");

    useEffect(() => {
        let str = "";
        if (config.host) str += `Host ${config.host}\n`;
        if (config.hostName) str += `    HostName ${config.hostName}\n`;
        if (config.user) str += `    User ${config.user}\n`;
        if (config.port && config.port !== "22") str += `    Port ${config.port}\n`;
        if (config.useIdentityFile && config.identityFile) str += `    IdentityFile ${config.identityFile}\n`;
        if (config.forwardAgent) str += `    ForwardAgent yes\n`;
        if (config.compression) str += `    Compression yes\n`;
        if (config.proxyJump) str += `    ProxyJump ${config.proxyJump}\n`;

        setOutput(str);
    }, [config]);

    const update = (key: string, val: any) => setConfig((p) => ({ ...p, [key]: val }));

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Configuration</CardTitle>
                    <CardDescription>Define your SSH host properties.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="host">Host Alias (e.g. prod-db)</Label>
                        <Input id="host" value={config.host} onChange={(e) => update("host", e.target.value)} />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="hostName">HostName (IP or Domain)</Label>
                            <Input id="hostName" value={config.hostName} onChange={(e) => update("hostName", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="port">Port</Label>
                            <Input id="port" value={config.port} onChange={(e) => update("port", e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="user">User</Label>
                        <Input id="user" value={config.user} onChange={(e) => update("user", e.target.value)} />
                    </div>

                    <div className="pt-4 border-t space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="useIdentity" className="flex flex-col">
                                <span>Forward Agent</span>
                                <span className="text-xs font-normal text-muted-foreground">Forward keys to the remote host</span>
                            </Label>
                            <Switch checked={config.forwardAgent} onCheckedChange={(c) => update("forwardAgent", c)} />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="useIdentity" className="flex flex-col">
                                <span>Compression</span>
                                <span className="text-xs font-normal text-muted-foreground">Enable gzip compression</span>
                            </Label>
                            <Switch checked={config.compression} onCheckedChange={(c) => update("compression", c)} />
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="useIdentity" className="flex flex-col">
                                    <span>Custom Identity File</span>
                                    <span className="text-xs font-normal text-muted-foreground">Use specific PEM/Key file</span>
                                </Label>
                                <Switch checked={config.useIdentityFile} onCheckedChange={(c) => update("useIdentityFile", c)} />
                            </div>
                            {config.useIdentityFile && (
                                <Input value={config.identityFile} onChange={(e) => update("identityFile", e.target.value)} placeholder="~/.ssh/id_rsa" />
                            )}
                        </div>

                        <div className="space-y-2 pt-2">
                            <Label htmlFor="proxyJump">Proxy Jump (Bastion Host)</Label>
                            <Input id="proxyJump" value={config.proxyJump} onChange={(e) => update("proxyJump", e.target.value)} placeholder="bastion-user@10.0.0.1" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800 text-slate-50">
                <CardHeader>
                    <CardTitle className="text-slate-400 uppercase text-sm tracking-wider">~/.ssh/config Preview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        <pre className="font-mono text-sm bg-slate-950 p-6 rounded-lg border border-slate-800 text-blue-300 min-h-[300px]">
                            {output}
                        </pre>
                        <div className="absolute top-4 right-4">
                            <CopyButton text={output} className="bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
