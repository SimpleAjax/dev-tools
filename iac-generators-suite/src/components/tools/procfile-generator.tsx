'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Plus, Trash2, Download } from 'lucide-react';

const TEMPLATES = {
    node: { web: 'npm start' },
    python: { web: 'gunicorn app:app' },
    go: { web: 'bin/server' },
    ruby: { web: 'bundle exec rails server -p $PORT' },
    java: { web: 'java -jar target/app.jar' },
    php: { web: 'vendor/bin/heroku-php-apache2 web/' },
    python_django: { web: 'gunicorn myproject.wsgi' },
};

export default function ProcfileGenerator() {
    const [processes, setProcesses] = useState<{ name: string, command: string }[]>([
        { name: 'web', command: 'npm start' }
    ]);
    const [selectedTemplate, setSelectedTemplate] = useState('node');

    const handleTemplateChange = (val: string) => {
        setSelectedTemplate(val);
        const newCmd = TEMPLATES[val as keyof typeof TEMPLATES]?.web;
        if (newCmd) {
            setProcesses(prev => {
                const hasWeb = prev.find(p => p.name === 'web');
                if (hasWeb) {
                    return prev.map(p => p.name === 'web' ? { ...p, command: newCmd } : p);
                } else {
                    return [{ name: 'web', command: newCmd }, ...prev];
                }
            });
        }
    };

    const output = processes.map(p => `${p.name}: ${p.command}`).join('\n');

    const addProcess = () => setProcesses([...processes, { name: 'worker', command: '' }]);
    const removeProcess = (idx: number) => setProcesses(processes.filter((_, i) => i !== idx));
    const updateProcess = (idx: number, field: 'name' | 'command', value: string) => {
        setProcesses(processes.map((p, i) => i === idx ? { ...p, [field]: value } : p));
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
    };

    const downloadFile = () => {
        const blob = new Blob([output], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Procfile';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
            <div className="space-y-6 overflow-y-auto pr-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Configuration</CardTitle>
                        <CardDescription>Define your application processes</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Template / Framework</Label>
                            <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select framework" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="node">Node.js</SelectItem>
                                    <SelectItem value="python">Python (Gunicorn)</SelectItem>
                                    <SelectItem value="python_django">Python (Django)</SelectItem>
                                    <SelectItem value="go">Go</SelectItem>
                                    <SelectItem value="ruby">Ruby on Rails</SelectItem>
                                    <SelectItem value="java">Java</SelectItem>
                                    <SelectItem value="php">PHP</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>Processes</Label>
                                <Button size="sm" onClick={addProcess} variant="outline"><Plus className="w-4 h-4 mr-2" /> Add</Button>
                            </div>
                            {processes.map((p, idx) => (
                                <div key={idx} className="flex gap-2 items-start">
                                    <Input
                                        placeholder="name"
                                        className="w-24 font-mono"
                                        value={p.name}
                                        onChange={(e) => updateProcess(idx, 'name', e.target.value)}
                                    />
                                    <Input
                                        placeholder="command"
                                        className="flex-1 font-mono"
                                        value={p.command}
                                        onChange={(e) => updateProcess(idx, 'command', e.target.value)}
                                    />
                                    <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-700" onClick={() => removeProcess(idx)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col h-full">
                <Card className="h-full flex flex-col border-slate-200 dark:border-slate-800 bg-slate-950">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-slate-800 bg-slate-900/50 rounded-t-xl text-slate-50">
                        <CardTitle className="text-sm font-mono">Procfile</CardTitle>
                        <div className="flex gap-2">
                            <Button size="sm" variant="secondary" className="h-8" onClick={copyToClipboard}>
                                <Copy className="w-3 h-3 mr-2" /> Copy
                            </Button>
                            <Button size="sm" variant="secondary" className="h-8" onClick={downloadFile}>
                                <Download className="w-3 h-3 mr-2" /> Download
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 relative group">
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
