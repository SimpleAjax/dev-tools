"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Clock, Download, HardDrive, Wifi } from "lucide-react"


const SIZE_UNITS = [
    { value: "KB", label: "KB", multiplier: 1024 },
    { value: "MB", label: "MB", multiplier: 1024 * 1024 },
    { value: "GB", label: "GB", multiplier: 1024 * 1024 * 1024 },
    { value: "TB", label: "TB", multiplier: 1024 * 1024 * 1024 * 1024 },
    { value: "PB", label: "PB", multiplier: 1024 * 1024 * 1024 * 1024 * 1024 },
]

const SPEED_UNITS = [
    { value: "Kbps", label: "Kbps (Kilobits/s)", multiplier: 1000 / 8 }, // bit to byte = /8
    { value: "Mbps", label: "Mbps (Megabits/s)", multiplier: 1000 * 1000 / 8 },
    { value: "Gbps", label: "Gbps (Gigabits/s)", multiplier: 1000 * 1000 * 1000 / 8 },
    { value: "KBps", label: "KB/s (Kilobytes/s)", multiplier: 1024 },
    { value: "MBps", label: "MB/s (Megabytes/s)", multiplier: 1024 * 1024 },
    { value: "GBps", label: "GB/s (Gigabytes/s)", multiplier: 1024 * 1024 * 1024 },
]

export function BandwidthTransferCalc() {
    const [fileSize, setFileSize] = useState(10)
    const [sizeUnit, setSizeUnit] = useState("GB")
    const [speed, setSpeed] = useState(100)
    const [speedUnit, setSpeedUnit] = useState("Mbps")

    const [transferTime, setTransferTime] = useState<number>(0)
    const [formattedTime, setFormattedTime] = useState("")

    useEffect(() => {
        calculateTime()
    }, [fileSize, sizeUnit, speed, speedUnit])

    const calculateTime = () => {
        if (!fileSize || !speed) return

        const sizeInBytes = fileSize * (SIZE_UNITS.find(u => u.value === sizeUnit)?.multiplier || 1)
        const speedInBytesPerSecond = speed * (SPEED_UNITS.find(u => u.value === speedUnit)?.multiplier || 1)

        if (speedInBytesPerSecond === 0) return

        const seconds = sizeInBytes / speedInBytesPerSecond
        setTransferTime(seconds)
        setFormattedTime(formatDuration(seconds))
    }

    const formatDuration = (seconds: number) => {
        if (seconds === 0) return "0s"

        const units = [
            { label: "y", seconds: 60 * 60 * 24 * 365 },
            { label: "d", seconds: 60 * 60 * 24 },
            { label: "h", seconds: 60 * 60 },
            { label: "m", seconds: 60 },
            { label: "s", seconds: 1 },
        ]

        let remaining = seconds
        let result = []

        for (const unit of units) {
            if (remaining >= unit.seconds) {
                const count = Math.floor(remaining / unit.seconds)
                remaining %= unit.seconds
                result.push(`${count}${unit.label}`)
            }
        }

        // If it's less than 1 second but greater than 0
        if (result.length === 0 && seconds > 0) {
            return "< 1s"
        }

        return result.slice(0, 3).join(" ") // Show top 3 significant units
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="md:col-span-2 lg:col-span-2 border-primary/20 shadow-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Download className="w-5 h-5 text-primary" />
                        Transfer Details
                    </CardTitle>
                    <CardDescription>Enter file size and network speed to calculate transfer time.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <Label className="text-base flex items-center gap-2">
                                <HardDrive className="w-4 h-4 text-muted-foreground" />
                                File Size
                            </Label>
                            <div className="flex rounded-md shadow-sm">
                                <Input
                                    type="number"
                                    value={fileSize}
                                    onChange={(e) => setFileSize(Number(e.target.value))}
                                    className="rounded-r-none border-r-0 focus-visible:ring-0"
                                />
                                <Select value={sizeUnit} onValueChange={setSizeUnit}>
                                    <SelectTrigger className="w-[100px] rounded-l-none bg-muted hover:bg-muted/80">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SIZE_UNITS.map(u => (
                                            <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Label className="text-base flex items-center gap-2">
                                <Wifi className="w-4 h-4 text-muted-foreground" />
                                Network Speed
                            </Label>
                            <div className="flex rounded-md shadow-sm">
                                <Input
                                    type="number"
                                    value={speed}
                                    onChange={(e) => setSpeed(Number(e.target.value))}
                                    className="rounded-r-none border-r-0 focus-visible:ring-0"
                                />
                                <Select value={speedUnit} onValueChange={setSpeedUnit}>
                                    <SelectTrigger className="w-[180px] rounded-l-none bg-muted hover:bg-muted/80">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SPEED_UNITS.map(u => (
                                            <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-secondary/20 rounded-xl border border-border flex flex-col items-center justify-center min-h-[160px] space-y-2">
                        <div className="text-muted-foreground font-medium uppercase tracking-wider text-sm">Estimated Transfer Time</div>
                        <div className="text-5xl font-bold tracking-tight text-primary">
                            {formattedTime}
                        </div>
                        <div className="text-sm text-muted-foreground mt-2">
                            {(transferTime / 60).toFixed(2)} minutes / {(transferTime / 3600).toFixed(2)} hours
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-muted/30">
                <CardHeader>
                    <CardTitle>Common Scenarios</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ScenarioRow
                        label="Docker Image (500MB)"
                        speed="4G (20 Mbps)"
                        time={formatDuration((500 * 1024 * 1024) / (20 * 1000 * 1000 / 8))}
                    />
                    <ScenarioRow
                        label="Db Backup (50GB)"
                        speed="Fiber (1 Gbps)"
                        time={formatDuration((50 * 1024 * 1024 * 1024) / (1000 * 1000 * 1000 / 8))}
                    />
                    <ScenarioRow
                        label="Dataset (1TB)"
                        speed="LAN (10 Gbps)"
                        time={formatDuration((1024 * 1024 * 1024 * 1024) / (10000 * 1000 * 1000 / 8))}
                    />
                </CardContent>
                <CardFooter>
                    <p className="text-xs text-muted-foreground">
                        Theoretical max speeds shown. Real-world speeds are often 10-20% slower due to protocol overhead over TCP/IP.
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}

function ScenarioRow({ label, speed, time }: { label: string, speed: string, time: string }) {
    return (
        <div className="flex justify-between items-center text-sm p-2 rounded hover:bg-background transition-colors">
            <div>
                <div className="font-medium">{label}</div>
                <div className="text-xs text-muted-foreground">{speed}</div>
            </div>
            <div className="font-mono font-bold">{time}</div>
        </div>
    )
}
