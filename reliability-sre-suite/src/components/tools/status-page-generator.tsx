"use client"

import * as React from "react"
import { Copy, Plus, Trash2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Service = {
    id: string
    name: string
    status: "operational" | "degraded" | "outage" | "maintenance"
    description: string
}

export function StatusPageGenerator() {
    const [services, setServices] = React.useState<Service[]>([
        { id: "1", name: "API Gateway", status: "operational", description: "All systems go" },
        { id: "2", name: "Database Primary", status: "operational", description: "Healthy" },
    ])

    const [newName, setNewName] = React.useState("")
    const [newStatus, setNewStatus] = React.useState<Service["status"]>("operational")

    const addService = () => {
        if (!newName) return
        setServices([
            ...services,
            {
                id: Math.random().toString(),
                name: newName,
                status: newStatus,
                description: newStatus === "operational" ? "All systems go" : "Issues detected"
            }
        ])
        setNewName("")
    }

    const updateServiceStatus = (id: string, status: Service["status"]) => {
        setServices(services.map(s => s.id === id ? { ...s, status } : s))
    }

    const removeService = (id: string) => {
        setServices(services.filter(s => s.id !== id))
    }

    const generateJson = () => {
        const output = {
            page: {
                id: "generated-id",
                name: "My Status Page",
                url: "https://status.example.com",
                updated_at: new Date().toISOString(),
            },
            components: services.map(s => ({
                name: s.name,
                status: s.status,
                description: s.description,
            }))
        }
        return JSON.stringify(output, null, 2)
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generateJson())
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "operational": return "bg-green-500"
            case "degraded": return "bg-yellow-500"
            case "outage": return "bg-red-500"
            case "maintenance": return "bg-blue-500"
            default: return "bg-gray-500"
        }
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Manage Services</CardTitle>
                        <CardDescription>Add components to your status page.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex gap-2 items-end">
                            <div className="grid w-full gap-2">
                                <Label>Service Name</Label>
                                <Input
                                    placeholder="e.g. Payments API"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && addService()}
                                />
                            </div>
                            <div className="w-[140px]">
                                <Label>Initial Status</Label>
                                <Select value={newStatus} onValueChange={(v: any) => setNewStatus(v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="operational">Operational</SelectItem>
                                        <SelectItem value="degraded">Degraded</SelectItem>
                                        <SelectItem value="outage">Outage</SelectItem>
                                        <SelectItem value="maintenance">Maintenance</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick={addService}>
                                <Plus className="size-4" />
                            </Button>
                        </div>

                        <div className="space-y-2">
                            {services.map((service) => (
                                <div key={service.id} className="flex items-center justify-between rounded-md border p-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`size-3 rounded-full ${getStatusColor(service.status)}`} />
                                        <span className="font-medium">{service.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Select value={service.status} onValueChange={(v: any) => updateServiceStatus(service.id, v)}>
                                            <SelectTrigger className="h-8 w-[130px] text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="operational">Operational</SelectItem>
                                                <SelectItem value="degraded">Degraded</SelectItem>
                                                <SelectItem value="outage">Outage</SelectItem>
                                                <SelectItem value="maintenance">Maintenance</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeService(service.id)}>
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card className="h-full bg-slate-950 text-slate-50">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800 bg-slate-900/50">
                        <CardTitle className="text-sm font-mono">status.json</CardTitle>
                        <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-8 text-xs hover:bg-slate-800 hover:text-white">
                            <Copy className="mr-2 size-3" /> Copy
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <pre className="overflow-x-auto p-4 text-xs font-mono md:text-sm leading-relaxed text-blue-200">
                            <code>{generateJson()}</code>
                        </pre>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
