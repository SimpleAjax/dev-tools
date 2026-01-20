"use client"

import React, { useState } from 'react'
import yaml from 'js-yaml'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Bell, Copy, Check, Info } from "lucide-react"

export function PrometheusAlertBuilder() {
    const [copied, setCopied] = useState(false)
    const [form, setForm] = useState({
        alertName: 'HighErrorRate',
        metric: 'http_requests_total',
        operator: '>',
        threshold: '100',
        duration: '5m',
        severity: 'critical',
        summary: 'Instance {{ $labels.instance }} down',
        description: '{{ $labels.instance }} of job {{ $labels.job }} has been down for more than 5 minutes.',
        isRate: true, // If true, wrap metric in rate()
        rateWindow: '5m'
    })

    // Generate PromQL Expression
    const expr = form.isRate
        ? `rate(${form.metric}[${form.rateWindow}]) ${form.operator} ${form.threshold}`
        : `${form.metric} ${form.operator} ${form.threshold}`

    // Generate Complete YAML Rule
    const ruleObject = {
        groups: [
            {
                name: 'generated-alerts',
                rules: [
                    {
                        alert: form.alertName,
                        expr: expr,
                        for: form.duration,
                        labels: {
                            severity: form.severity
                        },
                        annotations: {
                            summary: form.summary,
                            description: form.description
                        }
                    }
                ]
            }
        ]
    }

    const generatedYaml = yaml.dump(ruleObject)

    const handleChange = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedYaml)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Builder Form */}
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="w-5 h-5 text-primary" />
                            Alert Configuration
                        </CardTitle>
                        <CardDescription>Define your alert logic visually</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">

                        {/* Basic Info */}
                        <div className="space-y-2">
                            <Label>Alert Name (PascalCase)</Label>
                            <Input
                                value={form.alertName}
                                onChange={e => handleChange('alertName', e.target.value)}
                                placeholder="HighCpuLoad"
                            />
                        </div>

                        {/* Logic Builder */}
                        <div className="p-4 bg-muted/30 rounded-lg space-y-4 border">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-bold uppercase text-muted-foreground">PromQL Logic</Label>
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="isRate" className="text-xs">Use rate()?</Label>
                                    <Switch
                                        id="isRate"
                                        checked={form.isRate}
                                        onCheckedChange={c => handleChange('isRate', c)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                                <Label>Metric Name</Label>
                                <Input
                                    value={form.metric}
                                    onChange={e => handleChange('metric', e.target.value)}
                                    className="font-mono text-sm"
                                />
                            </div>

                            {form.isRate && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-1">
                                        <Label>Rate Window</Label>
                                        <Select value={form.rateWindow} onValueChange={v => handleChange('rateWindow', v)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1m">1m</SelectItem>
                                                <SelectItem value="5m">5m</SelectItem>
                                                <SelectItem value="15m">15m</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-3 gap-2">
                                <div className="col-span-1">
                                    <Label>Operator</Label>
                                    <Select value={form.operator} onValueChange={v => handleChange('operator', v)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value=">">&gt;</SelectItem>
                                            <SelectItem value="<">&lt;</SelectItem>
                                            <SelectItem value="==">==</SelectItem>
                                            <SelectItem value="!=">!=</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="col-span-2">
                                    <Label>Threshold</Label>
                                    <Input
                                        value={form.threshold}
                                        onChange={e => handleChange('threshold', e.target.value)}
                                        placeholder="0.5"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 pt-2">
                                <Label>For (Duration)</Label>
                                <div className="flex gap-2">
                                    {['1m', '5m', '10m', '1h'].map(dur => (
                                        <Badge
                                            key={dur}
                                            variant={form.duration === dur ? 'default' : 'outline'}
                                            className="cursor-pointer hover:bg-primary/90"
                                            onClick={() => handleChange('duration', dur)}
                                        >
                                            {dur}
                                        </Badge>
                                    ))}
                                    <Input
                                        className="w-20 h-6 text-xs"
                                        value={form.duration}
                                        onChange={e => handleChange('duration', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Meta and Severity */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Severity</Label>
                                <Select value={form.severity} onValueChange={v => handleChange('severity', v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="critical">Critical</SelectItem>
                                        <SelectItem value="warning">Warning</SelectItem>
                                        <SelectItem value="info">Info</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Summary</Label>
                            <Input value={form.summary} onChange={e => handleChange('summary', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Input value={form.description} onChange={e => handleChange('description', e.target.value)} />
                        </div>

                    </CardContent>
                </Card>
            </div>

            {/* Output Preview */}
            <div className="h-full flex flex-col gap-6">
                <Card className="border-l-4 border-l-primary bg-muted/10">
                    <CardHeader className="py-4">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Info className="w-4 h-4" />
                            Logic Explanation
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="py-0 pb-4 text-sm text-foreground/80 leading-relaxed">
                        If <code className="bg-primary/20 px-1 rounded">{form.isRate ? `rate(${form.metric}[${form.rateWindow}])` : form.metric}</code> is
                        <span className="font-bold mx-1">{form.operator === '>' ? 'greater than' : form.operator === '<' ? 'less than' : 'equal to'}</span>
                        <span className="font-mono bg-slate-900 text-white px-1 rounded mx-1">{form.threshold}</span>
                        for <span className="font-bold">{form.duration}</span>, then trigger a
                        <Badge variant={form.severity === 'critical' ? 'destructive' : 'secondary'} className="mx-1 text-[10px]">{form.severity}</Badge> alert.
                    </CardContent>
                </Card>

                <Card className="flex-1 flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Prometheus Rule YAML</CardTitle>
                        <Button variant="outline" size="sm" onClick={copyToClipboard}>
                            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                            {copied ? 'Copied' : 'Copy'}
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1 pt-4 p-0">
                        <div className="relative h-full min-h-[400px] w-full bg-slate-950 rounded-b-lg overflow-hidden">
                            <textarea
                                className="w-full h-full bg-transparent text-green-400 font-mono text-sm p-4 resize-none focus:outline-none"
                                value={generatedYaml}
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
