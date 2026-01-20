'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Copy, Download, Plus, Trash2, Globe, Lock, Shield } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Location {
    id: string;
    path: string;
    type: 'proxy' | 'root' | 'return';
    value: string;
}

interface ServerBlock {
    id: string;
    domains: string;
    port: string;
    root: string;
    ssl: boolean;
    locations: Location[];
}

export default function NginxConfigGenerator() {
    const [servers, setServers] = useState<ServerBlock[]>([
        {
            id: '1',
            domains: 'example.com',
            port: '80',
            root: '/var/www/html',
            ssl: false,
            locations: [
                { id: 'l1', path: '/', type: 'proxy', value: 'http://localhost:3000' }
            ]
        }
    ]);
    const [activeServerId, setActiveServerId] = useState('1');

    const updateServer = (id: string, field: keyof ServerBlock, value: any) => {
        setServers(servers.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const addLocation = (serverId: string) => {
        setServers(servers.map(s => {
            if (s.id !== serverId) return s;
            return {
                ...s,
                locations: [...s.locations, { id: Math.random().toString(), path: '/', type: 'proxy', value: '' }]
            };
        }));
    };

    const removeLocation = (serverId: string, locId: string) => {
        setServers(servers.map(s => {
            if (s.id !== serverId) return s;
            return { ...s, locations: s.locations.filter(l => l.id !== locId) };
        }));
    };

    const updateLocation = (serverId: string, locId: string, field: keyof Location, value: any) => {
        setServers(servers.map(s => {
            if (s.id !== serverId) return s;
            return {
                ...s,
                locations: s.locations.map(l => l.id === locId ? { ...l, [field]: value } : l)
            };
        }));
    };

    const generateOutput = () => {
        return servers.map(server => {
            let block = `server {\n`;
            block += `    listen ${server.port};\n`;
            block += `    server_name ${server.domains};\n`;

            if (server.root && !server.locations.some(l => l.path === '/')) {
                block += `    root ${server.root};\n`;
                block += `    index index.html index.htm;\n`;
            }

            server.locations.forEach(loc => {
                block += `\n    location ${loc.path} {\n`;
                if (loc.type === 'proxy') {
                    block += `        proxy_pass ${loc.value};\n`;
                    block += `        proxy_http_version 1.1;\n`;
                    block += `        proxy_set_header Upgrade $http_upgrade;\n`;
                    block += `        proxy_set_header Connection 'upgrade';\n`;
                    block += `        proxy_set_header Host $host;\n`;
                    block += `        proxy_cache_bypass $http_upgrade;\n`;
                } else if (loc.type === 'root') {
                    block += `        root ${loc.value};\n`;
                    block += `        try_files $uri $uri/ =404;\n`;
                } else if (loc.type === 'return') {
                    block += `        return ${loc.value};\n`;
                }
                block += `    }\n`;
            });

            if (server.ssl) {
                block += `\n    # SSL Configuration (Certbot recommended)\n`;
                block += `    # listen 443 ssl http2;\n`;
                block += `    # ssl_certificate /etc/letsencrypt/live/${server.domains.split(' ')[0]}/fullchain.pem;\n`;
                block += `    # ssl_certificate_key /etc/letsencrypt/live/${server.domains.split(' ')[0]}/privkey.pem;\n`;
            }

            block += `}\n`;
            return block;
        }).join('\n');
    };

    const output = generateOutput();
    const activeServer = servers.find(s => s.id === activeServerId) || servers[0];

    const copyToClipboard = () => navigator.clipboard.writeText(output);
    const downloadFile = () => {
        const blob = new Blob([output], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'nginx.conf';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
            {/* Left Controls */}
            <div className="space-y-6 overflow-y-auto pr-2 pb-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Server Block Configuration</CardTitle>
                        <CardDescription>Configure your Nginx server listener</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Domains (server_name)</Label>
                                <Input
                                    value={activeServer.domains}
                                    onChange={e => updateServer(activeServer.id, 'domains', e.target.value)}
                                    placeholder="example.com www.example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Port</Label>
                                <Input
                                    value={activeServer.port}
                                    onChange={e => updateServer(activeServer.id, 'port', e.target.value)}
                                    placeholder="80"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Global Root Directory (Optional)</Label>
                            <Input
                                value={activeServer.root}
                                onChange={e => updateServer(activeServer.id, 'root', e.target.value)}
                                placeholder="/var/www/html"
                            />
                        </div>

                        <div className="flex items-center space-x-2 border p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                            <Shield className="w-5 h-5 text-green-600" />
                            <div className="flex-1 space-y-1">
                                <Label>Enable SSL Headers</Label>
                                <p className="text-xs text-muted-foreground">Adds comments for Certbot/SSL config.</p>
                            </div>
                            <Switch
                                checked={activeServer.ssl}
                                onCheckedChange={c => updateServer(activeServer.id, 'ssl', c)}
                            />
                        </div>

                        <div className="space-y-4 pt-4 border-t">
                            <div className="flex items-center justify-between">
                                <Label>Locations / Routes</Label>
                                <Button size="sm" variant="outline" onClick={() => addLocation(activeServer.id)}>
                                    <Plus className="w-4 h-4 mr-2" /> Add Location
                                </Button>
                            </div>

                            {activeServer.locations.map((loc, idx) => (
                                <div key={loc.id} className="border p-4 rounded-lg space-y-4 bg-slate-50 dark:bg-slate-900/50">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 space-y-2">
                                            <Label className="text-xs">Path Match</Label>
                                            <Input
                                                value={loc.path}
                                                onChange={e => updateLocation(activeServer.id, loc.id, 'path', e.target.value)}
                                                placeholder="/"
                                            />
                                        </div>
                                        <div className="w-32 space-y-2">
                                            <Label className="text-xs">Type</Label>
                                            <Select value={loc.type} onValueChange={v => updateLocation(activeServer.id, loc.id, 'type', v)}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="proxy">Proxy Pass</SelectItem>
                                                    <SelectItem value="root">Static Root</SelectItem>
                                                    <SelectItem value="return">Return / Redirect</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Button size="icon" variant="ghost" className="text-red-500 mt-6" onClick={() => removeLocation(activeServer.id, loc.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs">
                                            {loc.type === 'proxy' ? 'Upstream URL' : loc.type === 'root' ? 'Directory Path' : 'Return Code & URL'}
                                        </Label>
                                        <Input
                                            value={loc.value}
                                            onChange={e => updateLocation(activeServer.id, loc.id, 'value', e.target.value)}
                                            placeholder={loc.type === 'proxy' ? 'http://localhost:3000' : loc.type === 'root' ? '/var/www/static' : '301 https://$host$request_uri'}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                    </CardContent>
                </Card>
            </div>

            {/* Right Preview */}
            <div className="flex flex-col h-full">
                <Card className="h-full flex flex-col border-slate-200 dark:border-slate-800 bg-slate-950">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-slate-800 bg-slate-900/50 rounded-t-xl text-slate-50">
                        <CardTitle className="text-sm font-mono">nginx.conf</CardTitle>
                        <div className="flex gap-2">
                            <Button size="sm" variant="secondary" className="h-8" onClick={copyToClipboard}>
                                <Copy className="w-3 h-3 mr-2" /> Copy
                            </Button>
                            <Button size="sm" variant="secondary" className="h-8" onClick={downloadFile}>
                                <Download className="w-3 h-3 mr-2" /> Download
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
