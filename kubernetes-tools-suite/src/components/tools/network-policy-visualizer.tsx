"use client"

import React, { useState } from 'react'
import yaml from 'js-yaml'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowBigRight, ArrowBigLeft, Globe, Shield, Box, Plus, Trash2, Copy, Check, Lock } from "lucide-react"

interface PortRule {
    protocol: 'TCP' | 'UDP'
    port: string
}

interface PeerRule {
    namespaceSelector?: { [key: string]: string }
    podSelector?: { [key: string]: string }
    ipBlock?: { cidr: string, except?: string[] }
}

interface PolicyRule {
    peers: PeerRule[]
    ports: PortRule[]
}

export function NetworkPolicyVisualizer() {
    const [name, setName] = useState('api-allow-policy')
    const [namespace, setNamespace] = useState('default')
    const [podSelector, setPodSelector] = useState<Record<string, string>>({ app: 'api' })
    const [types, setTypes] = useState<('Ingress' | 'Egress')[]>(['Ingress', 'Egress'])

    // Ingress (Incoming) - Allow from...
    const [ingressRules, setIngressRules] = useState<PolicyRule[]>([
        {
            peers: [{ podSelector: { app: 'frontend' } }],
            ports: [{ protocol: 'TCP', port: '8080' }]
        }
    ])

    // Egress (Outgoing) - Allow to...
    const [egressRules, setEgressRules] = useState<PolicyRule[]>([
        {
            peers: [{ ipBlock: { cidr: '0.0.0.0/0' } }],
            ports: [{ protocol: 'TCP', port: '5432' }]
        }
    ])
    const [copied, setCopied] = useState(false)

    // -- Generators --

    const generateYaml = () => {
        const policy: any = {
            apiVersion: 'networking.k8s.io/v1',
            kind: 'NetworkPolicy',
            metadata: {
                name: name,
                namespace: namespace
            },
            spec: {
                podSelector: { matchLabels: podSelector },
                policyTypes: types,
                ingress: types.includes('Ingress') ? ingressRules.map(r => ({
                    from: r.peers.map(p => {
                        const peer: any = {}
                        if (p.podSelector) peer.podSelector = { matchLabels: p.podSelector }
                        if (p.namespaceSelector) peer.namespaceSelector = { matchLabels: p.namespaceSelector }
                        if (p.ipBlock) peer.ipBlock = p.ipBlock
                        return peer
                    }),
                    ports: r.ports.map(p => ({ protocol: p.protocol, port: parseInt(p.port) || p.port }))
                })) : undefined,
                egress: types.includes('Egress') ? egressRules.map(r => ({
                    to: r.peers.map(p => {
                        const peer: any = {}
                        if (p.podSelector) peer.podSelector = { matchLabels: p.podSelector }
                        if (p.namespaceSelector) peer.namespaceSelector = { matchLabels: p.namespaceSelector }
                        if (p.ipBlock) peer.ipBlock = p.ipBlock
                        return peer
                    }),
                    ports: r.ports.map(p => ({ protocol: p.protocol, port: parseInt(p.port) || p.port }))
                })) : undefined
            }
        }
        return yaml.dump(policy, { noRefs: true })
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generateYaml())
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    // -- State Helpers --

    const updateRule = (type: 'ingress' | 'egress', idx: number, peerIdx: number, field: string, value: string, key?: string) => {
        const rules = type === 'ingress' ? [...ingressRules] : [...egressRules]
        const rule = { ...rules[idx] }
        const peers = [...rule.peers]

        // Handle Peer Edits (Simplified: 1st peer focuses)
        if (field === 'type') {
            if (value === 'pod') peers[peerIdx] = { podSelector: { app: 'frontend' } }
            if (value === 'ns') peers[peerIdx] = { namespaceSelector: { name: 'monitoring' } }
            if (value === 'ip') peers[peerIdx] = { ipBlock: { cidr: '0.0.0.0/0' } }
        } else if (field === 'key') {
            if (peers[peerIdx].podSelector) peers[peerIdx].podSelector = { [value]: Object.values(peers[peerIdx].podSelector!)[0] }
            if (peers[peerIdx].namespaceSelector) peers[peerIdx].namespaceSelector = { [value]: Object.values(peers[peerIdx].namespaceSelector!)[0] }
        } else if (field === 'value') {
            if (peers[peerIdx].podSelector) peers[peerIdx].podSelector = { [Object.keys(peers[peerIdx].podSelector!)[0]]: value }
            if (peers[peerIdx].namespaceSelector) peers[peerIdx].namespaceSelector = { [Object.keys(peers[peerIdx].namespaceSelector!)[0]]: value }
            if (peers[peerIdx].ipBlock) peers[peerIdx].ipBlock = { cidr: value }
        }

        rule.peers = peers
        rules[idx] = rule
        type === 'ingress' ? setIngressRules(rules) : setEgressRules(rules)
    }

    const updatePort = (type: 'ingress' | 'egress', idx: number, portIdx: number, field: keyof PortRule, value: string) => {
        const rules = type === 'ingress' ? [...ingressRules] : [...egressRules]
        const rule = { ...rules[idx] }
        const ports = [...rule.ports]
        ports[portIdx] = { ...ports[portIdx], [field]: value }
        rule.ports = ports
        rules[idx] = rule
        type === 'ingress' ? setIngressRules(rules) : setEgressRules(rules)
    }

    const addIngress = () => {
        setIngressRules([...ingressRules, { peers: [{ podSelector: { app: 'new' } }], ports: [{ port: '80', protocol: 'TCP' }] }])
    }
    const removeIngress = (idx: number) => setIngressRules(ingressRules.filter((_, i) => i !== idx))

    const addEgress = () => {
        setEgressRules([...egressRules, { peers: [{ ipBlock: { cidr: '0.0.0.0/0' } }], ports: [{ port: '443', protocol: 'TCP' }] }])
    }
    const removeEgress = (idx: number) => setEgressRules(egressRules.filter((_, i) => i !== idx))

    const toggleType = (t: 'Ingress' | 'Egress') => {
        if (types.includes(t)) setTypes(types.filter(current => current !== t))
        else setTypes([...types, t])
    }

    const renderRuleEditor = (rule: PolicyRule, idx: number, type: 'ingress' | 'egress') => {
        const peer = rule.peers[0] // Editing first peer for simplicity
        const port = rule.ports[0] // Editing first port for simplicity

        const peerType = peer.podSelector ? 'pod' : peer.namespaceSelector ? 'ns' : 'ip'
        const peerKey = peer.podSelector ? Object.keys(peer.podSelector)[0] : peer.namespaceSelector ? Object.keys(peer.namespaceSelector)[0] : ''
        const peerValue = peer.podSelector ? Object.values(peer.podSelector)[0] : peer.namespaceSelector ? Object.values(peer.namespaceSelector)[0] : peer.ipBlock?.cidr || ''

        return (
            <Card key={idx} className={`relative bg-white dark:bg-slate-950 border-l-4 ${type === 'ingress' ? 'border-green-500/30' : 'border-orange-500/30'}`}>
                <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6 z-10" onClick={() => type === 'ingress' ? removeIngress(idx) : removeEgress(idx)}>
                    <Trash2 className="w-3 h-3 text-muted-foreground" />
                </Button>
                <CardContent className="p-3 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                        <Globe className={`w-4 h-4 shrink-0 ${type === 'ingress' ? 'text-green-500' : 'text-orange-500'}`} />
                        <select
                            className="text-xs bg-muted border rounded p-1"
                            value={peerType}
                            onChange={(e) => updateRule(type, idx, 0, 'type', e.target.value)}
                        >
                            <option value="pod">Pod</option>
                            <option value="ns">Namespace</option>
                            <option value="ip">IP Block</option>
                        </select>

                        {peerType === 'ip' ? (
                            <Input
                                className="h-6 text-xs w-32"
                                value={peerValue}
                                onChange={(e) => updateRule(type, idx, 0, 'value', e.target.value)}
                            />
                        ) : (
                            <div className="flex items-center gap-1">
                                <Input
                                    className="h-6 text-xs w-20 bg-muted/50"
                                    value={peerKey}
                                    onChange={(e) => updateRule(type, idx, 0, 'key', e.target.value)}
                                />
                                <span className="text-muted-foreground">=</span>
                                <Input
                                    className="h-6 text-xs w-20"
                                    value={peerValue}
                                    onChange={(e) => updateRule(type, idx, 0, 'value', e.target.value)}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 pl-7">
                        <span className="text-xs text-muted-foreground">Port:</span>
                        <Input
                            className="h-6 text-xs w-16"
                            value={port?.port || ''}
                            placeholder="*"
                            onChange={(e) => updatePort(type, idx, 0, 'port', e.target.value)}
                        />
                        <select
                            className="text-xs bg-muted border rounded p-1 h-6"
                            value={port?.protocol || 'TCP'}
                            onChange={(e) => updatePort(type, idx, 0, 'protocol', e.target.value as any)}
                        >
                            <option value="TCP">TCP</option>
                            <option value="UDP">UDP</option>
                        </select>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Visual Editor Column */}
            <div className="lg:col-span-2 space-y-8">

                {/* 1. Target Definition */}
                <Card className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Box className="w-5 h-5 text-blue-500" />
                            Target Workload
                        </CardTitle>
                        <CardDescription>Which pods are you protecting?</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Policy Name</Label>
                            <Input value={name} onChange={e => setName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Namespace</Label>
                            <Input value={namespace} onChange={e => setNamespace(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Pod Selector (Selects Target)</Label>
                            <div className="flex gap-2">
                                <Input placeholder="key" value={Object.keys(podSelector)[0]} readOnly className="bg-muted" />
                                <Input placeholder="value" value={Object.values(podSelector)[0] as string} onChange={e => setPodSelector({ [Object.keys(podSelector)[0]]: e.target.value })} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Visual Traffic Flow */}
                <div className="relative flex flex-col items-center justify-center gap-8 py-8 bg-muted/20 rounded-xl border border-dashed">

                    {/* INGRESS ZONE */}
                    <div className={`w-full max-w-2xl p-4 transition-all ${types.includes('Ingress') ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Checkbox id="ingress" checked={types.includes('Ingress')} onCheckedChange={() => toggleType('Ingress')} />
                                <Label htmlFor="ingress" className="font-bold text-lg">Ingress (Incoming)</Label>
                            </div>
                            {types.includes('Ingress') && (
                                <Button variant="outline" size="sm" onClick={addIngress}><Plus className="w-4 h-4 mr-2" /> Source</Button>
                            )}
                        </div>

                        <div className="space-y-3">
                            {ingressRules.map((rule, idx) => renderRuleEditor(rule, idx, 'ingress'))}
                            {ingressRules.length === 0 && <div className="text-center text-sm text-muted-foreground italic p-2">Default Deny (No source rules)</div>}
                        </div>
                    </div>

                    {/* TARGET POD (CENTER) */}
                    <div className="relative z-10 bg-blue-600 text-white px-8 py-6 rounded-lg shadow-xl flex flex-col items-center">
                        <Shield className="w-8 h-8 mb-2" />
                        <div className="font-bold text-lg">Target Pods</div>
                        <div className="text-xs font-mono bg-blue-700 px-2 py-1 rounded mt-1">
                            {JSON.stringify(podSelector)}
                        </div>
                    </div>

                    {/* EGRESS ZONE */}
                    <div className={`w-full max-w-2xl p-4 transition-all ${types.includes('Egress') ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Checkbox id="egress" checked={types.includes('Egress')} onCheckedChange={() => toggleType('Egress')} />
                                <Label htmlFor="egress" className="font-bold text-lg">Egress (Outgoing)</Label>
                            </div>
                            {types.includes('Egress') && (
                                <Button variant="outline" size="sm" onClick={addEgress}><Plus className="w-4 h-4 mr-2" /> Destination</Button>
                            )}
                        </div>

                        <div className="space-y-3">
                            {egressRules.map((rule, idx) => renderRuleEditor(rule, idx, 'egress'))}
                            {egressRules.length === 0 && <div className="text-center text-sm text-muted-foreground italic p-2">Default Deny (No destination rules)</div>}
                        </div>
                    </div>

                </div>
            </div>

            {/* Output Column */}
            <div className="lg:col-span-1">
                <Card className="sticky top-6">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">NetworkPolicy YAML</CardTitle>
                        <Button variant="outline" size="sm" onClick={copyToClipboard}>
                            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                            {copied ? 'Copied' : 'Copy'}
                        </Button>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="relative w-full bg-slate-950 rounded-lg overflow-hidden h-[600px]">
                            <textarea
                                className="w-full h-full bg-transparent text-purple-300 font-mono text-xs p-4 resize-none focus:outline-none"
                                value={generateYaml()}
                                readOnly
                                spellCheck={false}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
