"use client"

import React, { useState } from 'react'
import yaml from 'js-yaml'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Lock, Plus, Trash2, ShieldCheck, Copy, Check } from "lucide-react"

type RbacType = 'Role' | 'ClusterRole' | 'ServiceAccount' | 'RoleBinding'

interface Rule {
    apiGroups: string[]
    resources: string[]
    verbs: string[]
}

const COMMON_RESOURCES = [
    'pods', 'pods/log', 'services', 'deployments', 'replicasets', 'statefulsets', 'daemonsets',
    'configmaps', 'secrets', 'ingresses', 'nodes', 'events', 'namespaces', 'serviceaccounts'
]

const ALL_VERBS = ['get', 'list', 'watch', 'create', 'update', 'patch', 'delete', 'deletecollection']
const READ_VERBS = ['get', 'list', 'watch']
const WRITE_VERBS = ['create', 'update', 'patch', 'delete']

export function RbacGenerator() {
    const [name, setName] = useState('my-app-role')
    const [namespace, setNamespace] = useState('default')
    const [type, setType] = useState<RbacType>('Role')
    const [rules, setRules] = useState<Rule[]>([
        {
            apiGroups: [''],
            resources: ['pods', 'services'],
            verbs: ['get', 'list', 'watch']
        }
    ])
    const [copied, setCopied] = useState(false)

    const updateRule = (index: number, field: keyof Rule, value: any) => {
        const newRules = [...rules]
        newRules[index] = { ...newRules[index], [field]: value }
        setRules(newRules)
    }

    const toggleRuleItem = (index: number, field: 'resources' | 'verbs', item: string) => {
        const currentItems = rules[index][field]
        const newItems = currentItems.includes(item)
            ? currentItems.filter(i => i !== item)
            : [...currentItems, item]
        updateRule(index, field, newItems)
    }

    const addRule = () => {
        setRules([...rules, { apiGroups: [''], resources: [], verbs: [] }])
    }

    const removeRule = (index: number) => {
        setRules(rules.filter((_, i) => i !== index))
    }

    // Generate K8s Manifest
    const generateYaml = () => {
        const manifest: any = {
            apiVersion: 'rbac.authorization.k8s.io/v1',
            kind: type,
            metadata: {
                name: name
            },
            rules: rules.map(r => ({
                apiGroups: r.apiGroups,
                resources: r.resources,
                verbs: r.verbs
            }))
        }

        if (type === 'Role') {
            manifest.metadata.namespace = namespace
        }

        return yaml.dump(manifest)
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generateYaml())
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-primary" />
                            Role Configuration
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Name</Label>
                                <Input value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Kind</Label>
                                <Select value={type} onValueChange={(v) => setType(v as RbacType)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Role">Role (Namespaced)</SelectItem>
                                        <SelectItem value="ClusterRole">ClusterRole (Global)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        {type === 'Role' && (
                            <div className="space-y-2">
                                <Label>Namespace</Label>
                                <Input value={namespace} onChange={e => setNamespace(e.target.value)} />
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Policy Rules</h3>
                        <Button variant="outline" size="sm" onClick={addRule}>
                            <Plus className="w-4 h-4 mr-2" /> Add Rule
                        </Button>
                    </div>

                    {rules.map((rule, idx) => (
                        <Card key={idx} className="relative group">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                                onClick={() => removeRule(idx)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                            <CardContent className="pt-6 space-y-4">

                                {/* Verbs Selection */}
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-muted-foreground font-bold">Access Level (Verbs)</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {ALL_VERBS.map(verb => (
                                            <Badge
                                                key={verb}
                                                variant={rule.verbs.includes(verb) ? 'default' : 'outline'}
                                                className="cursor-pointer select-none hover:bg-primary/80"
                                                onClick={() => toggleRuleItem(idx, 'verbs', verb)}
                                            >
                                                {verb}
                                            </Badge>
                                        ))}
                                        <div className="w-px h-4 bg-border mx-2 self-center" />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-5 text-xs px-2"
                                            onClick={() => updateRule(idx, 'verbs', READ_VERBS)}
                                        >Read-Only</Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-5 text-xs px-2"
                                            onClick={() => updateRule(idx, 'verbs', [...READ_VERBS, ...WRITE_VERBS])}
                                        >Read/Write</Button>
                                    </div>
                                </div>

                                {/* Resources Selection */}
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-muted-foreground font-bold">Resources</Label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {COMMON_RESOURCES.map(res => (
                                            <div key={res} className="flex items-center space-x-2 bg-muted/30 px-2 py-1 rounded border">
                                                <Checkbox
                                                    id={`rule-${idx}-${res}`}
                                                    checked={rule.resources.includes(res)}
                                                    onCheckedChange={() => toggleRuleItem(idx, 'resources', res)}
                                                />
                                                <label
                                                    htmlFor={`rule-${idx}-${res}`}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                >
                                                    {res}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    <Input
                                        placeholder="Custom resources (comma separated)..."
                                        className="h-8 text-sm"
                                        onChange={(e) => {
                                            const custom = e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                                            // Handling custom input requires more complex state merging, simplifying for MVP
                                            // For now, let's just use the checkbox list + manual merge if needed
                                        }}
                                    />
                                    <p className="text-[10px] text-muted-foreground">Select resources from the list above.</p>
                                </div>

                                {/* API Groups */}
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-muted-foreground font-bold">API Groups</Label>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary">"" (core)</Badge>
                                        <Badge variant="secondary">apps</Badge>
                                        <Badge variant="secondary">batch</Badge>
                                        <Badge variant="secondary">rbac.authorization.k8s.io</Badge>
                                    </div>
                                    <Input
                                        value={rule.apiGroups.join(', ')}
                                        onChange={e => updateRule(idx, 'apiGroups', e.target.value.split(',').map(s => s.trim()))}
                                        placeholder='"" (core), apps, batch...'
                                    />
                                    <p className="text-[10px] text-muted-foreground">Default is empty string "" for core resources (Pods, Nodes, etc).</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Output Column */}
            <div className="lg:col-span-1">
                <Card className="sticky top-6">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Generated Manifest</CardTitle>
                        <Button variant="outline" size="sm" onClick={copyToClipboard}>
                            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                            {copied ? 'Copied' : 'Copy'}
                        </Button>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="relative w-full bg-slate-950 rounded-lg overflow-hidden min-h-[500px]">
                            <textarea
                                className="w-full h-full bg-transparent text-blue-300 font-mono text-xs p-4 resize-none focus:outline-none"
                                value={generateYaml()}
                                readOnly
                                spellCheck={false}
                                style={{ minHeight: '500px' }}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
