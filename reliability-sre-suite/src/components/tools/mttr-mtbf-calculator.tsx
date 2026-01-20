"use client"

import * as React from "react"
import { Plus, Trash2, RotateCcw } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Incident = {
    id: string
    durationMinutes: number
}

export function MttrMtbfCalculator() {
    const [incidents, setIncidents] = React.useState<Incident[]>([
        { id: "1", durationMinutes: 45 },
        { id: "2", durationMinutes: 120 },
        { id: "3", durationMinutes: 15 },
    ])
    const [newDuration, setNewDuration] = React.useState("")
    const [observationPeriod, setObservationPeriod] = React.useState(30) // days

    const addIncident = () => {
        if (!newDuration) return
        setIncidents([...incidents, { id: Math.random().toString(), durationMinutes: Number(newDuration) }])
        setNewDuration("")
    }

    const removeIncident = (id: string) => {
        setIncidents(incidents.filter((i) => i.id !== id))
    }

    // Calculations
    const totalIncidents = incidents.length
    const totalDowntimeMinutes = incidents.reduce((acc, curr) => acc + curr.durationMinutes, 0)

    // MTTR = Total Downtime / Total Incidents
    const mttr = totalIncidents > 0 ? totalDowntimeMinutes / totalIncidents : 0

    // Total time in period (minutes)
    const totalTimeMinutes = observationPeriod * 24 * 60

    // Uptime = Total Time - Total Downtime
    const uptimeMinutes = totalTimeMinutes - totalDowntimeMinutes

    // MTBF = Uptime / Total Incidents
    const mtbf = totalIncidents > 0 ? uptimeMinutes / totalIncidents : uptimeMinutes

    // Availability %
    const availability = (uptimeMinutes / totalTimeMinutes) * 100

    const formatDuration = (mins: number) => {
        if (mins < 60) return `${mins.toFixed(0)}m`
        const hours = Math.floor(mins / 60)
        const remainingMins = Math.floor(mins % 60)
        return `${hours}h ${remainingMins}m`
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Incident Log</CardTitle>
                        <CardDescription>
                            Record the downtime duration of each incident in the observation window.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Observation Period (Days)</Label>
                            <Input
                                type="number"
                                value={observationPeriod}
                                onChange={(e) => setObservationPeriod(Number(e.target.value))}
                            />
                        </div>

                        <div className="flex gap-2 items-end">
                            <div className="grid w-full gap-2">
                                <Label>Add Incident Duration (minutes)</Label>
                                <Input
                                    type="number"
                                    placeholder="e.g. 45"
                                    value={newDuration}
                                    onChange={(e) => setNewDuration(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && addIncident()}
                                />
                            </div>
                            <Button onClick={addIncident}>
                                <Plus className="size-4" /> Add
                            </Button>
                        </div>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Incident</TableHead>
                                        <TableHead>Duration</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {incidents.map((incident, idx) => (
                                        <TableRow key={incident.id}>
                                            <TableCell>Incident #{idx + 1}</TableCell>
                                            <TableCell>{formatDuration(incident.durationMinutes)}</TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="icon" onClick={() => removeIncident(incident.id)} className="h-8 w-8 text-destructive">
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {incidents.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center text-muted-foreground h-24">
                                                No incidents recorded.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">MTTR</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{formatDuration(mttr)}</div>
                            <p className="text-xs text-muted-foreground mt-1">Mean Time To Recovery</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">MTBF</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{formatDuration(mtbf)}</div>
                            <p className="text-xs text-muted-foreground mt-1">Mean Time Between Failures</p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="bg-gradient-to-br from-sidebar-primary to-blue-700 text-white border-none">
                    <CardHeader>
                        <CardTitle>Calculated Availability</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-5xl font-bold tracking-tighter">
                            {availability.toFixed(4)}%
                        </div>
                        <div className="flex justify-between text-sm opacity-90 border-t border-white/20 pt-4">
                            <span>Total Downtime: {formatDuration(totalDowntimeMinutes)}</span>
                            <span>Incidents: {totalIncidents}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
