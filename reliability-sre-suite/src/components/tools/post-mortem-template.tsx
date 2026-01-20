"use client"

import * as React from "react"
import { Copy, FileText } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function PostMortemTemplate() {
    const [title, setTitle] = React.useState("Production API Latency Spike")
    const [date, setDate] = React.useState(new Date().toISOString().split('T')[0])
    const [impact, setImpact] = React.useState("500 users experienced 5s+ latency for 10 minutes.")
    const [rootCause, setRootCause] = React.useState("Redis connection pool exhaustion due to missing timeout config.")
    const [trigger, setTrigger] = React.useState("Marketing push notification campaign sent at 10:00 AM.")
    const [resolution, setResolution] = React.useState("Restarted API pods and increased Redis pool size to 50.")
    const [detection, setDetection] = React.useState("Paged by 'High Latency' alert in Datadog.")

    const generateMarkdown = () => {
        return `
# Incident Post-Mortem: ${title}

## Overview
| Metric | Detail |
| :--- | :--- |
| **Date** | ${date} |
| **Authors** | [Your Name] |
| **Status** | Resolved |
| **Severity** | SEV-2 |

## Executive Summary
${impact}

## Root Cause
${rootCause}

## Trigger
${trigger}

## Resolution
${resolution}

## Detection
${detection}

## Timeline
- **10:00 UTC** - Issue started.
- **10:05 UTC** - Alert fired.
- **10:10 UTC** - Engineer acknowledged.
- **10:15 UTC** - Fix deployed.

## Action Items
- [ ] Fix connection pool config (Immediate)
- [ ] Add circuit breaker for Redis (Medium)
- [ ] Update runbook for saturation alerts (Low)

## Lessons Learned
1. Connection pools default to "unlimited" in some libraries.
2. We need better separation between read/write traffic.
`.trim()
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generateMarkdown())
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Incident Details</CardTitle>
                        <CardDescription>Fill in the key facts of the incident.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label>Incident Title</Label>
                            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                        </div>

                        <div className="grid gap-2">
                            <Label>Date</Label>
                            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                        </div>

                        <Separator />

                        <div className="grid gap-2">
                            <Label>Customer Impact (Executive Summary)</Label>
                            <Textarea
                                value={impact}
                                onChange={(e) => setImpact(e.target.value)}
                                rows={3}
                                placeholder="What happened from user perspective?"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Technical Root Cause</Label>
                            <Textarea
                                value={rootCause}
                                onChange={(e) => setRootCause(e.target.value)}
                                rows={3}
                                placeholder="Why did it actually break?"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Trigger</Label>
                            <Input
                                value={trigger}
                                onChange={(e) => setTrigger(e.target.value)}
                                placeholder="What changed?"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Resolution</Label>
                            <Input
                                value={resolution}
                                onChange={(e) => setResolution(e.target.value)}
                                placeholder="How was it fixed?"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card className="h-full flex flex-col bg-slate-50 dark:bg-slate-900">
                    <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                        <CardTitle className="text-base flex items-center gap-2">
                            <FileText className="size-4" />
                            Preview (Markdown)
                        </CardTitle>
                        <Button variant="outline" size="sm" onClick={copyToClipboard}>
                            <Copy className="mr-2 size-3" /> Copy Markdown
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0 flex-1">
                        <div className="prose prose-sm dark:prose-invert max-w-none p-6 overflow-auto max-h-[700px]">
                            <h1>Incident Post-Mortem: {title}</h1>

                            <h3>Overview</h3>
                            <div className="grid grid-cols-[100px_1fr] gap-x-4 gap-y-1 text-sm mb-4 border rounded p-3 bg-background">
                                <div className="font-semibold text-muted-foreground">Date</div><div>{date}</div>
                                <div className="font-semibold text-muted-foreground">Authors</div><div>[Your Name]</div>
                                <div className="font-semibold text-muted-foreground">Status</div><div>Resolved</div>
                                <div className="font-semibold text-muted-foreground">Severity</div><div>SEV-2</div>
                            </div>

                            <h3>Executive Summary</h3>
                            <p>{impact}</p>

                            <h3>Root Cause</h3>
                            <p>{rootCause}</p>

                            <h3>Trigger</h3>
                            <p>{trigger}</p>

                            <h3>Resolution</h3>
                            <p>{resolution}</p>

                            <h3>Detection</h3>
                            <p>{detection}</p>

                            <h3>Timeline (Example)</h3>
                            <ul className="list-disc pl-4">
                                <li><strong>10:00 UTC</strong> - Issue started.</li>
                                <li><strong>10:05 UTC</strong> - Alert fired.</li>
                                <li><strong>10:15 UTC</strong> - Fix deployed.</li>
                            </ul>

                            <h3>Action Items (Example)</h3>
                            <ul className="list-disc pl-4">
                                <li>[ ] Fix connection pool config</li>
                                <li>[ ] Update runbook</li>
                            </ul>

                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
