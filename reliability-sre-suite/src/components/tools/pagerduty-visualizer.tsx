"use client"

import * as React from "react"
import { Calendar as CalendarIcon, User } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export function PagerDutyVisualizer() {
    const [rotationType, setRotationType] = React.useState("weekly")
    const [responders, setResponders] = React.useState(["Alice", "Bob", "Charlie", "Dave"])
    const [startDate, setStartDate] = React.useState(new Date().toISOString().split('T')[0])

    // Simulation logic
    const generateSchedule = () => {
        const schedule: { date: string, responder: string }[] = []

        // Generate 30 days
        for (let i = 0; i < 35; i++) {
            const d = new Date(startDate)
            d.setDate(d.getDate() + i)

            let responderIndex = 0

            if (rotationType === "weekly") {
                // Change every 7 days
                const weeksPassed = Math.floor(i / 7)
                responderIndex = weeksPassed % responders.length
            } else if (rotationType === "daily") {
                responderIndex = i % responders.length
            } else if (rotationType === "2-2-3") {
                // 2-2-3 pattern (Panama Schedule): 2 days on, 2 off, 3 on, 2 off, 2 on, 3 off.
                // Usually split between 2 teams/people. 
                // Cycle is 14 days.
                // Day 0,1: A
                // Day 2,3: B
                // Day 4,5,6: A
                // Day 7,8: B
                // Day 9,10: A
                // Day 11,12,13: B

                const dayOfCycle = i % 14
                const isTeamA = [0, 1, 4, 5, 6, 9, 10].includes(dayOfCycle)

                // Map Team A to even indices, Team B to odd indices? 
                // Simplified: Just toggle between first 2 responders for this demo
                responderIndex = isTeamA ? 0 : 1
            }

            schedule.push({
                date: d.toISOString().split('T')[0],
                responder: responders[responderIndex] || "Unassigned"
            })
        }
        return schedule
    }

    const schedule = generateSchedule()

    const getInitials = (name: string) => name.substring(0, 2).toUpperCase()

    const getColor = (name: string) => {
        const colors = [
            "bg-red-500", "bg-blue-500", "bg-green-500", "bg-purple-500",
            "bg-orange-500", "bg-pink-500", "bg-cyan-500", "bg-teal-500"
        ]
        const index = responders.indexOf(name) % colors.length
        return colors[index]
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Rotation Settings</CardTitle>
                        <CardDescription>Configure your on-call team and schedule.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Rotation Pattern</Label>
                            <Select value={rotationType} onValueChange={setRotationType}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="2-2-3">2-2-3 (Panama)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Responders (comma separated)</Label>
                            <Input
                                value={responders.join(", ")}
                                onChange={(e) => setResponders(e.target.value.split(",").map(s => s.trim()))}
                            />
                            <div className="flex flex-wrap gap-2 mt-2">
                                {responders.map(r => (
                                    <Badge key={r} variant="secondary" className="gap-1">
                                        <User className="size-3" /> {r}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card className="h-full">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>5-Week Preview</CardTitle>
                        <CalendarIcon className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-7 gap-2 text-center text-xs text-muted-foreground mb-2">
                            <div>Sun</div>
                            <div>Mon</div>
                            <div>Tue</div>
                            <div>Wed</div>
                            <div>Thu</div>
                            <div>Fri</div>
                            <div>Sat</div>
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                            {schedule.map((day, i) => (
                                <div key={day.date} className="flex flex-col gap-1 rounded-md border p-2 min-h-[80px] text-left hover:bg-muted/50 transition-colors">
                                    <span className="text-xs font-medium text-muted-foreground">{day.date.slice(8)}</span>
                                    <div className={`mt-1 flex items-center gap-1 rounded px-1.5 py-1 text-xs font-medium text-white ${getColor(day.responder)}`}>
                                        {getInitials(day.responder)}
                                        <span className="truncate hidden sm:inline">{day.responder}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
