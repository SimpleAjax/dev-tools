'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Download, Plus, Trash2 } from 'lucide-react';

interface Router {
    id: string;
    name: string;
    rule: string;
    service: string;
    entryPoint: string;
}

interface Service {
    id: string;
    name: string;
    url: string;
}

export default function TraefikConfigBuilder() {
    const [entryPoints, setEntryPoints] = useState({ web: ':80', websecure: ':443' });
    const [dashboard, setDashboard] = useState(true);
    const [apiInsecure, setApiInsecure] = useState(true);
    const [dockerProvider, setDockerProvider] = useState(true);

    // Dynamic Config State
    const [routers, setRouters] = useState<Router[]>([
        { id: '1', name: 'my-app', rule: 'Host(`example.com`)', service: 'my-app-svc', entryPoint: 'websecure' }
    ]);
    const [services, setServices] = useState<Service[]>([
        { id: '1', name: 'my-app-svc', url: 'http://127.0.0.1:8080' }
    ]);


    const generateStaticOutput = () => {
        let out = `## Traefik Static Configuration\n\n`;

        out += `[entryPoints]\n`;
        Object.entries(entryPoints).forEach(([name, address]) => {
            out += `  [entryPoints.${name}]\n    address = "${address}"\n`;
        });
        out += `\n`;

        if (dashboard) {
            out += `[api]\n  dashboard = true\n`;
            if (apiInsecure) out += `  insecure = true\n`;
            out += `\n`;
        }

        if (dockerProvider) {
            out += `[providers.docker]\n  endpoint = "unix:///var/run/docker.sock"\n  exposedByDefault = false\n\n`;
        }

        out += `[providers.file]\n  filename = "dynamic_conf.toml"\n`;

        return out;
    };

    const generateDynamicOutput = () => {
        let out = `## Traefik Dynamic Configuration\n\n`;

        out += `[http.routers]\n`;
        routers.forEach(r => {
            out += `  [http.routers.${r.name}]\n`;
            out += `    rule = "${r.rule}"\n`;
            out += `    service = "${r.service}"\n`;
            out += `    entryPoints = ["${r.entryPoint}"]\n`;
            out += `    # tls = {}\n\n`;
        });

        out += `[http.services]\n`;
        services.forEach(s => {
            out += `  [http.services.${s.name}.loadBalancer]\n`;
            out += `    [[http.services.${s.name}.loadBalancer.servers]]\n`;
            out += `      url = "${s.url}"\n\n`;
        });

        return out;
    };

    const staticOutput = generateStaticOutput();
    const dynamicOutput = generateDynamicOutput();

    const [activeTab, setActiveTab] = useState('static');

    const copyToClipboard = () => navigator.clipboard.writeText(activeTab === 'static' ? staticOutput : dynamicOutput);

    return (
        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
            {/* Left Controls */}
            <div className="space-y-6 overflow-y-auto pr-2 pb-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Traefik Configuration</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="static" onValueChange={setActiveTab}>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="static">Static Config</TabsTrigger>
                                <TabsTrigger value="dynamic">Dynamic Config</TabsTrigger>
                            </TabsList>

                            <TabsContent value="static" className="space-y-6 pt-4">
                                <div className="space-y-4 border p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                                    <h4 className="font-medium text-sm">Global Settings</h4>
                                    <div className="flex items-center justify-between">
                                        <Label>Enable Dashboard</Label>
                                        <Switch checked={dashboard} onCheckedChange={setDashboard} />
                                    </div>
                                    {dashboard && (
                                        <div className="flex items-center justify-between pl-4 border-l-2">
                                            <Label>Insecure API (Dev Only)</Label>
                                            <Switch checked={apiInsecure} onCheckedChange={setApiInsecure} />
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between">
                                        <Label>Docker Provider</Label>
                                        <Switch checked={dockerProvider} onCheckedChange={setDockerProvider} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>EntryPoints</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 border rounded">
                                            <div className="text-xs font-bold mb-1">web</div>
                                            <Input value={entryPoints.web} onChange={e => setEntryPoints({ ...entryPoints, web: e.target.value })} className="h-8" />
                                        </div>
                                        <div className="p-3 border rounded">
                                            <div className="text-xs font-bold mb-1">websecure</div>
                                            <Input value={entryPoints.websecure} onChange={e => setEntryPoints({ ...entryPoints, websecure: e.target.value })} className="h-8" />
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="dynamic" className="space-y-6 pt-4">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label>Routers</Label>
                                        <Button size="sm" variant="outline" onClick={() => setRouters([...routers, { id: Math.random().toString(), name: 'new-router', rule: 'Host(`test.com`)', service: 'new-svc', entryPoint: 'web' }])}>
                                            <Plus className="w-4 h-4 mr-2" /> Add
                                        </Button>
                                    </div>
                                    {routers.map((r, i) => (
                                        <div key={r.id} className="border p-3 rounded space-y-2 relative">
                                            <Button size="icon" variant="ghost" className="text-red-500 absolute top-2 right-2 h-6 w-6" onClick={() => setRouters(routers.filter(x => x.id !== r.id))}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                            <div className="grid grid-cols-2 gap-2">
                                                <Input value={r.name} onChange={e => {
                                                    const n = [...routers]; n[i].name = e.target.value; setRouters(n);
                                                }} placeholder="Name" className="h-8 text-xs font-mono" />
                                                <Select value={r.entryPoint} onValueChange={v => {
                                                    const n = [...routers]; n[i].entryPoint = v; setRouters(n);
                                                }}>
                                                    <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Entrypoint" /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="web">web</SelectItem>
                                                        <SelectItem value="websecure">websecure</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <Input value={r.rule} onChange={e => {
                                                const n = [...routers]; n[i].rule = e.target.value; setRouters(n);
                                            }} placeholder="Rule" className="h-8 text-xs font-mono" />
                                            <Input value={r.service} onChange={e => {
                                                const n = [...routers]; n[i].service = e.target.value; setRouters(n);
                                            }} placeholder="Target Service Name" className="h-8 text-xs font-mono" />
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label>Services</Label>
                                        <Button size="sm" variant="outline" onClick={() => setServices([...services, { id: Math.random().toString(), name: 'new-svc', url: 'http://10.0.0.1:80' }])}>
                                            <Plus className="w-4 h-4 mr-2" /> Add
                                        </Button>
                                    </div>
                                    {services.map((s, i) => (
                                        <div key={s.id} className="border p-3 rounded space-y-2 relative">
                                            <Button size="icon" variant="ghost" className="text-red-500 absolute top-2 right-2 h-6 w-6" onClick={() => setServices(services.filter(x => x.id !== s.id))}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                            <Input value={s.name} onChange={e => {
                                                const n = [...services]; n[i].name = e.target.value; setServices(n);
                                            }} placeholder="Service Name" className="h-8 text-xs font-mono" />
                                            <Input value={s.url} onChange={e => {
                                                const n = [...services]; n[i].url = e.target.value; setServices(n);
                                            }} placeholder="Target URL" className="h-8 text-xs font-mono" />
                                        </div>
                                    ))}
                                </div>

                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>

            {/* Right Preview */}
            <div className="flex flex-col h-full">
                <Card className="h-full flex flex-col border-slate-200 dark:border-slate-800 bg-slate-950">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-slate-800 bg-slate-900/50 rounded-t-xl text-slate-50">
                        <CardTitle className="text-sm font-mono">{activeTab === 'static' ? 'traefik.toml' : 'dynamic_conf.toml'}</CardTitle>
                        <div className="flex gap-2">
                            <Button size="sm" variant="secondary" className="h-8" onClick={copyToClipboard}>
                                <Copy className="w-3 h-3 mr-2" /> Copy
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 p-0">
                        <textarea
                            className="w-full h-full bg-transparent text-slate-50 p-6 font-mono text-sm resize-none focus:outline-none"
                            value={activeTab === 'static' ? staticOutput : dynamicOutput}
                            readOnly
                            spellCheck="false"
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
