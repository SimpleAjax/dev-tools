'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Copy, Download, Plus, Trash2 } from 'lucide-react';

export default function SystemdUnitGenerator() {
    const [config, setConfig] = useState({
        description: 'My Custom Service',
        documentation: '',
        type: 'simple',
        execStart: '/usr/bin/python3 /opt/app/main.py',
        user: 'www-data',
        group: '',
        workingDirectory: '/opt/app',
        restart: 'always',
        restartSec: '5s',
        wantedBy: 'multi-user.target',
        environment: [] as { key: string; value: string }[],
    });

    const updateConfig = (field: string, value: any) => {
        setConfig({ ...config, [field]: value });
    };

    const addEnv = () => setConfig({ ...config, environment: [...config.environment, { key: '', value: '' }] });
    const removeEnv = (idx: number) => setConfig({ ...config, environment: config.environment.filter((_, i) => i !== idx) });
    const updateEnv = (idx: number, field: 'key' | 'value', val: string) => {
        const newEnv = [...config.environment];
        newEnv[idx][field] = val;
        setConfig({ ...config, environment: newEnv });
    };

    const generateOutput = () => {
        let out = `[Unit]\nDescription=${config.description}\n`;
        if (config.documentation) out += `Documentation=${config.documentation}\n`;
        out += `After=network.target\n\n`;

        out += `[Service]\n`;
        out += `Type=${config.type}\n`;
        out += `User=${config.user}\n`;
        if (config.group) out += `Group=${config.group}\n`;
        out += `WorkingDirectory=${config.workingDirectory}\n`;
        out += `ExecStart=${config.execStart}\n`;
        out += `Restart=${config.restart}\n`;
        if (config.restart !== 'no') out += `RestartSec=${config.restartSec}\n`;

        config.environment.forEach(env => {
            if (env.key) out += `Environment="${env.key}=${env.value}"\n`;
        });

        out += `\n[Install]\nWantedBy=${config.wantedBy}\n`;

        return out;
    };

    const output = generateOutput();

    const downloadFile = () => {
        const blob = new Blob([output], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${config.description.replace(/\s+/g, '-').toLowerCase()}.service`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const copyToClipboard = () => navigator.clipboard.writeText(output);

    return (
        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
            {/* Left Controls */}
            <div className="space-y-6 overflow-y-auto pr-2 pb-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Service Configuration</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="unit" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="unit">Unit</TabsTrigger>
                                <TabsTrigger value="service">Service</TabsTrigger>
                                <TabsTrigger value="install">Install</TabsTrigger>
                            </TabsList>

                            <TabsContent value="unit" className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Input value={config.description} onChange={e => updateConfig('description', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Documentation URL</Label>
                                    <Input value={config.documentation} onChange={e => updateConfig('documentation', e.target.value)} placeholder="https://..." />
                                </div>
                            </TabsContent>

                            <TabsContent value="service" className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label>ExecStart (Command)</Label>
                                    <Input value={config.execStart} onChange={e => updateConfig('execStart', e.target.value)} className="font-mono" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>User</Label>
                                        <Input value={config.user} onChange={e => updateConfig('user', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Group (Optional)</Label>
                                        <Input value={config.group} onChange={e => updateConfig('group', e.target.value)} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Working Directory</Label>
                                    <Input value={config.workingDirectory} onChange={e => updateConfig('workingDirectory', e.target.value)} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Type</Label>
                                        <Select value={config.type} onValueChange={v => updateConfig('type', v)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="simple">simple</SelectItem>
                                                <SelectItem value="forking">forking</SelectItem>
                                                <SelectItem value="oneshot">oneshot</SelectItem>
                                                <SelectItem value="notify">notify</SelectItem>
                                                <SelectItem value="idle">idle</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Restart Policy</Label>
                                        <Select value={config.restart} onValueChange={v => updateConfig('restart', v)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="no">no</SelectItem>
                                                <SelectItem value="always">always</SelectItem>
                                                <SelectItem value="on-success">on-success</SelectItem>
                                                <SelectItem value="on-failure">on-failure</SelectItem>
                                                <SelectItem value="on-abnormal">on-abnormal</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {config.restart !== 'no' && (
                                    <div className="space-y-2">
                                        <Label>Restart Sec</Label>
                                        <Input value={config.restartSec} onChange={e => updateConfig('restartSec', e.target.value)} />
                                    </div>
                                )}

                                <div className="space-y-4 pt-4 border-t">
                                    <div className="flex items-center justify-between">
                                        <Label>Environment Variables</Label>
                                        <Button size="sm" variant="outline" onClick={addEnv}><Plus className="w-4 h-4 mr-2" /> Add</Button>
                                    </div>
                                    {config.environment.map((env, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <Input placeholder="KEY" value={env.key} onChange={e => updateEnv(idx, 'key', e.target.value)} className="w-1/3" />
                                            <Input placeholder="VALUE" value={env.value} onChange={e => updateEnv(idx, 'value', e.target.value)} className="flex-1" />
                                            <Button size="icon" variant="ghost" className="text-red-500" onClick={() => removeEnv(idx)}><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="install" className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label>Wanted By</Label>
                                    <Input value={config.wantedBy} onChange={e => updateConfig('wantedBy', e.target.value)} />
                                    <p className="text-xs text-muted-foreground">Usually multi-user.target for system services.</p>
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
                        <CardTitle className="text-sm font-mono">service.service</CardTitle>
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
