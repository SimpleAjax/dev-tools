"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Plus, Trash2, CheckCircle2, XCircle, AlertTriangle, ArrowRight } from "lucide-react"

type Effect = 'NoSchedule' | 'PreferNoSchedule' | 'NoExecute'
type Operator = 'Equal' | 'Exists'

interface Taint {
    key: string
    value: string
    effect: Effect
}

interface Toleration {
    key: string
    operator: Operator
    value?: string
    effect?: Effect
}

export function TaintTolerationVisualizer() {
    const [taints, setTaints] = useState<Taint[]>([
        { key: 'gpu', value: 'true', effect: 'NoSchedule' }
    ])

    const [tolerations, setTolerations] = useState<Toleration[]>([])

    // -- Logic Engine --

    // Check if a single taint is tolerated by ANY of the pod's tolerations
    const isTaintTolerated = (taint: Taint) => {
        return tolerations.some(tol => {
            // 1. Key must match (or toleration has no key for global wildcard, though rare in practice usually explicit)
            if (tol.key && tol.key !== taint.key) return false

            // 2. Effect must match (if specified in toleration)
            if (tol.effect && tol.effect !== taint.effect) return false

            // 3. Value check based on Operator
            if (tol.operator === 'Exists') return true // Value doesn't matter
            if (tol.operator === 'Equal') return tol.value === taint.value

            return false
        })
    }

    // Determine final status
    const calculateStatus = () => {
        const untoleratedTaints = taints.filter(t => !isTaintTolerated(t))

        // If there are ANY untolerated taints with NoSchedule or NoExecute, the pod is rejected/evicted
        const blockage = untoleratedTaints.find(t => t.effect === 'NoSchedule' || t.effect === 'NoExecute')
        const preference = untoleratedTaints.find(t => t.effect === 'PreferNoSchedule')

        if (blockage) {
            return {
                status: 'Rejected',
                reason: `Untolerated ${blockage.effect} taint on key "${blockage.key}"`,
                color: 'text-red-500',
                bg: 'bg-red-500/10',
                icon: XCircle
            }
        }

        if (preference) {
            return {
                status: 'Scheduled',
                reason: `Scheduled, but node is unpreferred due to "${preference.key}" taint.`,
                color: 'text-yellow-500',
                bg: 'bg-yellow-500/10',
                icon: AlertTriangle
            }
        }

        return {
            status: 'Scheduled',
            reason: "All hard taints are tolerated or strictly preferred.",
            color: 'text-green-500',
            bg: 'bg-green-500/10',
            icon: CheckCircle2
        }
    }

    const result = calculateStatus()

    // -- Handlers --
    const addTaint = () => setTaints([...taints, { key: 'new-key', value: 'value', effect: 'NoSchedule' }])
    const removeTaint = (i: number) => setTaints(taints.filter((_, idx) => idx !== i))
    const updateTaint = (i: number, field: keyof Taint, val: string) => {
        const newTaints = [...taints]
        newTaints[i] = { ...newTaints[i], [field]: val }
        setTaints(newTaints)
    }

    const addTol = () => setTolerations([...tolerations, { key: 'new-key', operator: 'Equal', value: 'value', effect: 'NoSchedule' }])
    const removeTol = (i: number) => setTolerations(tolerations.filter((_, idx) => idx !== i))
    const updateTol = (i: number, field: keyof Toleration, val: string) => {
        const newTols = [...tolerations]
        newTols[i] = { ...newTols[i], [field]: val }
        setTolerations(newTols)
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

            {/* NODE TEINT CONFIG */}
            <div className="lg:col-span-2 space-y-4">
                <Card className="border-l-4 border-l-blue-500 h-full">
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center text-lg">
                            <span>Node Taints</span>
                            <Button size="sm" variant="outline" onClick={addTaint}><Plus className="w-4 h-4" /></Button>
                        </CardTitle>
                        <CardDescription>Locks on the door.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {taints.length === 0 && <p className="text-sm text-muted-foreground italic">No taints. Node is open.</p>}
                        {taints.map((t, i) => (
                            <div key={i} className="p-3 border rounded-lg bg-background space-y-2 relative">
                                <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => removeTaint(i)}>
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <Label className="text-xs text-muted-foreground">Key</Label>
                                        <Input className="h-7 text-sm" value={t.key} onChange={e => updateTaint(i, 'key', e.target.value)} />
                                    </div>
                                    <div className="flex-1">
                                        <Label className="text-xs text-muted-foreground">Value</Label>
                                        <Input className="h-7 text-sm" value={t.value} onChange={e => updateTaint(i, 'value', e.target.value)} />
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">Effect</Label>
                                    <Select value={t.effect} onValueChange={v => updateTaint(i, 'effect', v)}>
                                        <SelectTrigger className="h-7"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="NoSchedule">NoSchedule</SelectItem>
                                            <SelectItem value="NoExecute">NoExecute</SelectItem>
                                            <SelectItem value="PreferNoSchedule">PreferNoSchedule</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* VISUALIZER CENTER */}
            <div className="lg:col-span-1 flex flex-col items-center justify-center py-10 space-y-4">
                <div className="text-center space-y-2">
                    <h3 className="font-bold text-muted-foreground uppercase text-xs tracking-wider">Result</h3>
                    <div className={`flex flex-col items-center justify-center p-6 rounded-full border-4 ${result.color === 'text-green-500' ? 'border-green-500' : result.color === 'text-red-500' ? 'border-red-500' : 'border-yellow-500'} bg-background w-32 h-32`}>
                        <result.icon className={`w-12 h-12 ${result.color} mb-2`} />
                        <span className={`font-bold text-xs uppercase ${result.color}`}>{result.status}</span>
                    </div>
                </div>
                <div className={`p-4 rounded-lg text-sm text-center ${result.bg} ${result.color} border border-current`}>
                    {result.reason}
                </div>
                <ArrowRight className="text-muted-foreground w-6 h-6 rotate-90 lg:rotate-0" />
            </div>

            {/* POD TOLERATION CONFIG */}
            <div className="lg:col-span-2 space-y-4">
                <Card className="border-r-4 border-r-purple-500 h-full">
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center text-lg">
                            <span>Pod Tolerations</span>
                            <Button size="sm" variant="outline" onClick={addTol}><Plus className="w-4 h-4" /></Button>
                        </CardTitle>
                        <CardDescription>Keys to open the door.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {tolerations.length === 0 && <p className="text-sm text-muted-foreground italic">No tolerations. Can only land on untainted nodes.</p>}
                        {tolerations.map((t, i) => (
                            <div key={i} className="p-3 border rounded-lg bg-background space-y-2 relative">
                                <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => removeTol(i)}>
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <Label className="text-xs text-muted-foreground">Key</Label>
                                        <Input className="h-7 text-sm" value={t.key} onChange={e => updateTol(i, 'key', e.target.value)} />
                                    </div>
                                    <div>
                                        <Label className="text-xs text-muted-foreground">Operator</Label>
                                        <Select value={t.operator} onValueChange={v => updateTol(i, 'operator', v)}>
                                            <SelectTrigger className="h-7"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Equal">Equal</SelectItem>
                                                <SelectItem value="Exists">Exists</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {t.operator === 'Equal' && (
                                        <div className="col-span-2">
                                            <Label className="text-xs text-muted-foreground">Value</Label>
                                            <Input className="h-7 text-sm" value={t.value} onChange={e => updateTol(i, 'value', e.target.value)} />
                                        </div>
                                    )}
                                    <div className="col-span-2">
                                        <Label className="text-xs text-muted-foreground">Effect (Optional)</Label>
                                        <Select value={t.effect || "All"} onValueChange={v => updateTol(i, 'effect', v === "All" ? "" : v)}>
                                            <SelectTrigger className="h-7"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="All">All Costs (Empty)</SelectItem>
                                                <SelectItem value="NoSchedule">NoSchedule</SelectItem>
                                                <SelectItem value="NoExecute">NoExecute</SelectItem>
                                                <SelectItem value="PreferNoSchedule">PreferNoSchedule</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <p className="text-[10px] text-muted-foreground mt-1">Empty matches all effects.</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
