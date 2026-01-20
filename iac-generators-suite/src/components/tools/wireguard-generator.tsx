'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Copy, Plus, Trash2, Download, RefreshCw, Key, ShieldCheck } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import * as nacl from 'tweetnacl';
import * as naclUtil from 'tweetnacl-util';
import { QRCodeSVG } from 'qrcode.react';

interface Peer {
    id: string;
    name: string;
    publicKey: string; // Server's public key (for peer config) or Peer's public key (for server config)
    allowedIPs: string;
    endpoint: string;
    privateKey?: string; // Only if generated here
    presharedKey?: string;
}

interface InterfaceConfig {
    privateKey: string;
    publicKey: string;
    address: string;
    listenPort: string;
    dns: string;
}

export default function WireGuardGenerator() {
    const [mode, setMode] = useState<'server' | 'peer'>('server');
    const [generatedKeys, setGeneratedKeys] = useState<{ private: string, public: string } | null>(null);

    const [iface, setIface] = useState<InterfaceConfig>({
        privateKey: '',
        publicKey: '',
        address: '10.0.0.1/24',
        listenPort: '51820',
        dns: '1.1.1.1'
    });

    const [peers, setPeers] = useState<Peer[]>([
        { id: '1', name: 'Client 1', publicKey: '', allowedIPs: '10.0.0.2/32', endpoint: '' }
    ]);

    const generateKeys = () => {
        const keyPair = nacl.box.keyPair();
        const publicKey = naclUtil.encodeBase64(keyPair.publicKey);
        const privateKey = naclUtil.encodeBase64(keyPair.secretKey);
        setGeneratedKeys({ private: privateKey, public: publicKey });
        setIface({ ...iface, privateKey, publicKey });
    };

    const updateIface = (field: keyof InterfaceConfig, value: string) => {
        setIface({ ...iface, [field]: value });
    };

    const addPeer = () => {
        setPeers([...peers, { id: Math.random().toString(), name: `Client ${peers.length + 1}`, publicKey: '', allowedIPs: '', endpoint: '' }]);
    };

    const removePeer = (id: string) => {
        setPeers(peers.filter(p => p.id !== id));
    };

    const updatePeer = (id: string, field: keyof Peer, value: string) => {
        setPeers(peers.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    const generateOutput = () => {
        let out = `[Interface]\n`;
        out += `PrivateKey = ${iface.privateKey || '<INSERT_PRIVATE_KEY>'}\n`;
        out += `Address = ${iface.address}\n`;
        if (iface.listenPort) out += `ListenPort = ${iface.listenPort}\n`;
        if (iface.dns) out += `DNS = ${iface.dns}\n`;

        // If generating server config, PostUp/PostDown often used
        if (mode === 'server') {
            out += `# PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE\n`;
            out += `# PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE\n`;
        }

        out += `\n`;

        peers.forEach(peer => {
            out += `[Peer]\n`;
            out += `# ${peer.name}\n`;
            out += `PublicKey = ${peer.publicKey || '<INSERT_PEER_PUBLIC_KEY>'}\n`;
            out += `AllowedIPs = ${peer.allowedIPs}\n`;
            if (peer.endpoint) out += `Endpoint = ${peer.endpoint}\n`;
            if (peer.presharedKey) out += `PresharedKey = ${peer.presharedKey}\n`;
            out += `\n`;
        });

        return out;
    };

    const output = generateOutput();

    const copyToClipboard = () => navigator.clipboard.writeText(output);
    const downloadFile = () => {
        const blob = new Blob([output], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'wg0.conf';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
            <div className="space-y-6 overflow-y-auto pr-2 pb-10">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-blue-500" />
                            WireGuard Interface
                        </CardTitle>
                        <CardDescription>
                            Keys are generated locally using NaCl (Curve25519).
                            <span className="text-amber-500 font-bold ml-1">Private keys never leave your browser.</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>Key Pair</Label>
                                <Button size="sm" onClick={generateKeys} variant="outline">
                                    <RefreshCw className="w-4 h-4 mr-2" /> Generate Keys
                                </Button>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs">Private Key</Label>
                                <div className="relative">
                                    <Input type="password" value={iface.privateKey} onChange={e => updateIface('privateKey', e.target.value)} className="font-mono pr-10" />
                                    <Key className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs">Public Key (Share this)</Label>
                                <Input value={iface.publicKey} onChange={e => updateIface('publicKey', e.target.value)} className="font-mono bg-slate-100 dark:bg-slate-950" readOnly />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Address (CIDR)</Label>
                                <Input value={iface.address} onChange={e => updateIface('address', e.target.value)} placeholder="10.0.0.1/24" />
                            </div>
                            <div className="space-y-2">
                                <Label>Listen Port</Label>
                                <Input value={iface.listenPort} onChange={e => updateIface('listenPort', e.target.value)} placeholder="51820" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>DNS Servers</Label>
                            <Input value={iface.dns} onChange={e => updateIface('dns', e.target.value)} placeholder="1.1.1.1, 8.8.8.8" />
                        </div>

                        <div className="space-y-4 pt-4 border-t">
                            <div className="flex items-center justify-between">
                                <Label>Peers</Label>
                                <Button size="sm" variant="outline" onClick={addPeer}>
                                    <Plus className="w-4 h-4 mr-2" /> Add Peer
                                </Button>
                            </div>
                            {peers.map((peer, idx) => (
                                <div key={peer.id} className="border p-4 rounded-lg space-y-4 relative">
                                    <Button size="icon" variant="ghost" className="text-red-500 absolute top-2 right-2 h-6 w-6" onClick={() => removePeer(peer.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                    <div className="space-y-2">
                                        <Label className="text-xs">Peer Name</Label>
                                        <Input value={peer.name} onChange={e => updatePeer(peer.id, 'name', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs">Public Key</Label>
                                        <Input value={peer.publicKey} onChange={e => updatePeer(peer.id, 'publicKey', e.target.value)} placeholder="Peer's Public Key" className="font-mono text-xs" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs">Allowed IPs</Label>
                                        <Input value={peer.allowedIPs} onChange={e => updatePeer(peer.id, 'allowedIPs', e.target.value)} placeholder="0.0.0.0/0" className="font-mono" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs">Endpoint (Optional)</Label>
                                        <Input value={peer.endpoint} onChange={e => updatePeer(peer.id, 'endpoint', e.target.value)} placeholder="ip:port" className="font-mono" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col h-full gap-4">
                <Card className="flex-1 flex flex-col border-slate-200 dark:border-slate-800 bg-slate-950">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-slate-800 bg-slate-900/50 rounded-t-xl text-slate-50">
                        <CardTitle className="text-sm font-mono">wg0.conf</CardTitle>
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

                <Card className="shrink-0 bg-white dark:bg-slate-900">
                    <CardContent className="p-6 flex items-center justify-center gap-6">
                        <div className="bg-white p-2 rounded">
                            <QRCodeSVG value={output} size={150} level="M" />
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-semibold">Mobile Config</h4>
                            <p className="text-sm text-muted-foreground w-48">
                                Scan this code with the WireGuard mobile app to instantly import this configuration.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
