"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Trash2, Copy, Check, Plus, AlertTriangle, TriangleAlert } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type PgHbaRule = {
    id: string
    type: string
    database: string
    user: string
    address: string
    method: string
}

export function PgHbaGenerator() {
    const [rules, setRules] = useState<PgHbaRule[]>([
        { id: '1', type: 'local', database: 'all', user: 'postgres', address: '', method: 'peer' },
        { id: '2', type: 'host', database: 'all', user: 'all', address: '127.0.0.1/32', method: 'scram-sha-256' },
        { id: '3', type: 'host', database: 'all', user: 'all', address: '::1/128', method: 'scram-sha-256' },
    ])

    const [newRule, setNewRule] = useState<Omit<PgHbaRule, 'id'>>({
        type: 'host',
        database: 'all',
        user: 'all',
        address: '0.0.0.0/0',
        method: 'scram-sha-256'
    })

    // Address is irrelevant for 'local'
    const isAddressVisible = (type: string) => type !== 'local'

    const addRule = () => {
        setRules([...rules, { ...newRule, id: Math.random().toString(36).substr(2, 9) }])
    }

    const deleteRule = (id: string) => {
        setRules(rules.filter(r => r.id !== id))
    }

    const generateConfig = () => {
        return rules.map(r => {
            let line = `${r.type.padEnd(8)} ${r.database.padEnd(16)} ${r.user.padEnd(16)}`
            if (r.type !== 'local') {
                line += ` ${r.address.padEnd(24)}`
            }
            line += ` ${r.method}`

            // Warnings
            if (r.method === 'trust' && r.address === '0.0.0.0/0') {
                line += ` # DANGER: Open to world`
            }
            return line
        }).join('\n')
    }

    const [copied, setCopied] = useState(false)
    const handleCopy = () => {
        navigator.clipboard.writeText(generateConfig())
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const hasInsecureConfig = rules.some(r => r.method === 'trust' && (r.address === '0.0.0.0/0' || r.address === '::/0'))

    return (
        <Card className="w-full max-w-4xl mx-auto border-t-4 border-t-orange-500">
            <CardHeader>
                <CardTitle className="text-2xl text-orange-700 dark:text-orange-400">pg_hba.conf Generator</CardTitle>
                <CardDescription>
                    Securely configure client authentication without syntax errors.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">

                {/* Editor */}
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-2 items-end border p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                        <div className="w-32">
                            <label className="text-xs font-semibold mb-1 block">Type</label>
                            <Select value={newRule.type} onValueChange={(v) => setNewRule({ ...newRule, type: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="local">local</SelectItem>
                                    <SelectItem value="host">host</SelectItem>
                                    <SelectItem value="hostssl">hostssl</SelectItem>
                                    <SelectItem value="hostnossl">hostnossl</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="w-32">
                            <label className="text-xs font-semibold mb-1 block">Database</label>
                            <Input value={newRule.database} onChange={(e) => setNewRule({ ...newRule, database: e.target.value })} />
                        </div>

                        <div className="w-32">
                            <label className="text-xs font-semibold mb-1 block">User</label>
                            <Input value={newRule.user} onChange={(e) => setNewRule({ ...newRule, user: e.target.value })} />
                        </div>

                        {isAddressVisible(newRule.type) && (
                            <div className="w-48">
                                <label className="text-xs font-semibold mb-1 block">Address (CIDR)</label>
                                <Input value={newRule.address} onChange={(e) => setNewRule({ ...newRule, address: e.target.value })} placeholder="0.0.0.0/0" />
                            </div>
                        )}

                        <div className="w-40">
                            <label className="text-xs font-semibold mb-1 block">Method</label>
                            <Select value={newRule.method} onValueChange={(v) => setNewRule({ ...newRule, method: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="scram-sha-256">scram-sha-256</SelectItem>
                                    <SelectItem value="md5">md5 (legacy)</SelectItem>
                                    <SelectItem value="password">password (clear)</SelectItem>
                                    <SelectItem value="trust">trust</SelectItem>
                                    <SelectItem value="reject">reject</SelectItem>
                                    <SelectItem value="peer">peer</SelectItem>
                                    <SelectItem value="cert">cert</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button onClick={addRule} className="ml-auto">
                            <Plus className="w-4 h-4 mr-2" /> Add Rule
                        </Button>
                    </div>

                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Database</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Address</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead className="w-12"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rules.map((rule) => (
                                    <TableRow key={rule.id}>
                                        <TableCell className="font-mono">{rule.type}</TableCell>
                                        <TableCell className="font-mono">{rule.database}</TableCell>
                                        <TableCell className="font-mono">{rule.user}</TableCell>
                                        <TableCell className="font-mono">{rule.type === 'local' ? '-' : rule.address}</TableCell>
                                        <TableCell>
                                            <Badge variant={rule.method === 'trust' ? 'destructive' : 'outline'}>
                                                {rule.method}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="icon" onClick={() => deleteRule(rule.id)}>
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Output */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Generated pg_hba.conf</h3>
                        <Button variant="outline" size="sm" onClick={handleCopy}>
                            {copied ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
                            {copied ? "Copied" : "Copy Config"}
                        </Button>
                    </div>

                    <div className="bg-slate-950 text-slate-50 p-6 rounded-lg font-mono text-sm whitespace-pre overflow-x-auto relative">
                        <div className="absolute top-2 right-2 text-slate-600 text-xs select-none">pg_hba.conf</div>
                        {generateConfig()}
                    </div>

                    {hasInsecureConfig && (
                        <Alert variant="destructive">
                            <TriangleAlert className="h-4 w-4" />
                            <AlertTitle>Security Warning</AlertTitle>
                            <AlertDescription>
                                You are using <code>trust</code> authentication with worldwide access (0.0.0.0/0). This allows anyone to connect without a password.
                            </AlertDescription>
                        </Alert>
                    )}

                </div>

            </CardContent>
        </Card>
    )
}
