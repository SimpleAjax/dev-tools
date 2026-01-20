'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Download, Plus, Trash2, User, Box, Terminal } from 'lucide-react';
import yaml from 'js-yaml';

interface UserConfig {
    name: string;
    groups: string;
    sudo: string;
    shell: string;
    sshKey: string;
}

export default function CloudInitGenerator() {
    const [hostname, setHostname] = useState('server-01');
    const [users, setUsers] = useState<UserConfig[]>([
        { name: 'ubuntu', groups: 'sudo', sudo: 'ALL=(ALL) NOPASSWD:ALL', shell: '/bin/bash', sshKey: '' }
    ]);
    const [packages, setPackages] = useState<string[]>(['git', 'curl']);
    const [runCmds, setRunCmds] = useState<string[]>(['echo "Hello World" > /tmp/hello.txt']);
    const [packageUpdate, setPackageUpdate] = useState(true);

    const addUser = () => setUsers([...users, { name: 'user', groups: 'sudo', sudo: 'ALL=(ALL) NOPASSWD:ALL', shell: '/bin/bash', sshKey: '' }]);
    const removeUser = (idx: number) => setUsers(users.filter((_, i) => i !== idx));
    const updateUser = (idx: number, field: keyof UserConfig, val: string) => {
        setUsers(users.map((u, i) => i === idx ? { ...u, [field]: val } : u));
    };

    // Package handlers
    const addPkg = () => setPackages([...packages, '']);
    const updatePkg = (idx: number, val: string) => setPackages(packages.map((p, i) => i === idx ? val : p));
    const removePkg = (idx: number) => setPackages(packages.filter((_, i) => i !== idx));

    // RunCmd handlers
    const addCmd = () => setRunCmds([...runCmds, '']);
    const updateCmd = (idx: number, val: string) => setRunCmds(runCmds.map((c, i) => i === idx ? val : c));
    const removeCmd = (idx: number) => setRunCmds(runCmds.filter((_, i) => i !== idx));

    const generateOutput = () => {
        const data: any = {};
        if (hostname) data.hostname = hostname;
        if (packageUpdate) data.package_update = true;

        if (packages.length > 0 && packages.some(p => p.trim() !== '')) {
            data.packages = packages.filter(p => p.trim());
        }

        if (users.length > 0) {
            data.users = users.map(u => {
                const userObj: any = {
                    name: u.name,
                    groups: u.groups,
                    sudo: u.sudo,
                    shell: u.shell,
                };
                if (u.sshKey) userObj.ssh_authorized_keys = [u.sshKey];
                return userObj;
            });
        }

        if (runCmds.length > 0 && runCmds.some(c => c.trim() !== '')) {
            data.runcmd = runCmds.filter(c => c.trim());
        }

        return `#cloud-config\n${yaml.dump(data, { lineWidth: -1 })}`;
    };

    const output = generateOutput();

    const copyToClipboard = () => navigator.clipboard.writeText(output);
    const downloadFile = () => {
        const blob = new Blob([output], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'user-data';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
            {/* Left Controls */}
            <div className="space-y-6 overflow-y-auto pr-2 pb-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Cloud Configuration</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Hostname</Label>
                                <Input value={hostname} onChange={e => setHostname(e.target.value)} placeholder="my-server" />
                            </div>

                            <Tabs defaultValue="users" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="users">Users</TabsTrigger>
                                    <TabsTrigger value="packages">Packages</TabsTrigger>
                                    <TabsTrigger value="scripts">Scripts</TabsTrigger>
                                </TabsList>

                                <TabsContent value="users" className="space-y-4 pt-4">
                                    <div className="flex items-center justify-between">
                                        <Label>System Users</Label>
                                        <Button size="sm" variant="outline" onClick={addUser}><Plus className="w-4 h-4 mr-2" /> Add User</Button>
                                    </div>
                                    {users.map((u, idx) => (
                                        <div key={idx} className="border p-4 rounded-lg space-y-4 relative bg-slate-50 dark:bg-slate-900/50">
                                            <Button size="icon" variant="ghost" className="text-red-500 absolute top-2 right-2 h-6 w-6" onClick={() => removeUser(idx)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-xs">Username</Label>
                                                    <Input value={u.name} onChange={e => updateUser(idx, 'name', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs">Groups</Label>
                                                    <Input value={u.groups} onChange={e => updateUser(idx, 'groups', e.target.value)} />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs">SSH Authorized Key</Label>
                                                <Textarea
                                                    value={u.sshKey}
                                                    onChange={e => updateUser(idx, 'sshKey', e.target.value)}
                                                    placeholder="ssh-rsa AAAAB3..."
                                                    className="font-mono text-xs h-16"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </TabsContent>

                                <TabsContent value="packages" className="space-y-4 pt-4">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label>Packages to Install</Label>
                                            <Button size="sm" variant="outline" onClick={addPkg}><Plus className="w-4 h-4 mr-2" /> Add Package</Button>
                                        </div>
                                        {packages.map((pkg, idx) => (
                                            <div key={idx} className="flex gap-2">
                                                <Input value={pkg} onChange={e => updatePkg(idx, e.target.value)} placeholder="nginx" />
                                                <Button size="icon" variant="ghost" className="text-red-500" onClick={() => removePkg(idx)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="scripts" className="space-y-4 pt-4">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label>RunCMD (Boot Script)</Label>
                                            <Button size="sm" variant="outline" onClick={addCmd}><Plus className="w-4 h-4 mr-2" /> Add Command</Button>
                                        </div>
                                        {runCmds.map((cmd, idx) => (
                                            <div key={idx} className="flex gap-2">
                                                <Input value={cmd} onChange={e => updateCmd(idx, e.target.value)} placeholder="echo 'setup complete' > /var/log/setup.log" className="font-mono text-sm" />
                                                <Button size="icon" variant="ghost" className="text-red-500" onClick={() => removeCmd(idx)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Preview */}
            <div className="flex flex-col h-full">
                <Card className="h-full flex flex-col border-slate-200 dark:border-slate-800 bg-slate-950">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-slate-800 bg-slate-900/50 rounded-t-xl text-slate-50">
                        <CardTitle className="text-sm font-mono">user-data.yaml</CardTitle>
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
