'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Plus, Trash2, ArrowRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BackendServer {
    name: string;
    address: string;
    port: string;
}

export default function HAProxyConfigCalculator() {
    const [frontendPort, setFrontendPort] = useState('80');
    const [balanceAlgo, setBalanceAlgo] = useState('roundrobin');
    const [backends, setBackends] = useState<BackendServer[]>([
        { name: 'server1', address: '10.0.0.1', port: '8080' },
        { name: 'server2', address: '10.0.0.2', port: '8080' }
    ]);

    const addBackend = () => setBackends([...backends, { name: `server${backends.length + 1}`, address: '', port: '8080' }]);
    const removeBackend = (idx: number) => setBackends(backends.filter((_, i) => i !== idx));
    const updateBackend = (idx: number, field: keyof BackendServer, val: string) => {
        const b = [...backends];
        b[idx][field] = val;
        setBackends(b);
    };

    const generateOutput = () => {
        let out = `global
    log /dev/log local0
    log /dev/log local1 notice
    chroot /var/lib/haproxy
    stats socket /run/haproxy/admin.sock mode 660 level admin
    stats timeout 30s
    user haproxy
    group haproxy
    daemon

defaults
    log     global
    mode    http
    option  httplog
    option  dontlognull
    timeout connect 5000
    timeout client  50000
    timeout server  50000

frontend http_front
    bind *:${frontendPort}
    default_backend http_back

backend http_back
    balance ${balanceAlgo}
`;

        backends.forEach(b => {
            out += `    server ${b.name} ${b.address}:${b.port} check\n`;
        });

        return out;
    };

    const output = generateOutput();
    const copyToClipboard = () => navigator.clipboard.writeText(output);

    return (
        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
            <div className="space-y-6 overflow-y-auto pr-2 pb-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Load Balancer Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Frontend Port (The Listener)</Label>
                            <Input value={frontendPort} onChange={e => setFrontendPort(e.target.value)} placeholder="80" />
                        </div>

                        <div className="space-y-2">
                            <Label>Balancing Algorithm</Label>
                            <Select value={balanceAlgo} onValueChange={setBalanceAlgo}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="roundrobin">Round Robin</SelectItem>
                                    <SelectItem value="leastconn">Least Connections</SelectItem>
                                    <SelectItem value="source">Source IP Hash</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-4 pt-4 border-t">
                            <div className="flex items-center justify-between">
                                <Label>Backend Servers</Label>
                                <Button size="sm" variant="outline" onClick={addBackend}><Plus className="w-4 h-4 mr-2" /> Add Server</Button>
                            </div>
                            {backends.map((b, idx) => (
                                <div key={idx} className="flex flex-col gap-2 border p-3 rounded bg-slate-50 dark:bg-slate-900/50 relative">
                                    <Button size="icon" variant="ghost" className="text-red-500 absolute top-2 right-2 h-6 w-6" onClick={() => removeBackend(idx)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="space-y-1">
                                            <Label className="text-xs">Name</Label>
                                            <Input value={b.name} onChange={e => updateBackend(idx, 'name', e.target.value)} className="h-8" />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">IP Address</Label>
                                            <Input value={b.address} onChange={e => updateBackend(idx, 'address', e.target.value)} className="h-8" />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">Port</Label>
                                            <Input value={b.port} onChange={e => updateBackend(idx, 'port', e.target.value)} className="h-8" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col h-full">
                <Card className="h-full flex flex-col border-slate-200 dark:border-slate-800 bg-slate-950">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-slate-800 bg-slate-900/50 rounded-t-xl text-slate-50">
                        <CardTitle className="text-sm font-mono">haproxy.cfg</CardTitle>
                        <div className="flex gap-2">
                            <Button size="sm" variant="secondary" className="h-8" onClick={copyToClipboard}>
                                <Copy className="w-3 h-3 mr-2" /> Copy
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 p-0">
                        <textarea
                            className="w-full h-full bg-transparent text-slate-50 p-6 font-mono text-sm resize-none focus:outline-none"
                            value={output}
                            readOnly
                            spellCheck="false"
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
