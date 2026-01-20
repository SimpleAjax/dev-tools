"use client"

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, CheckCircle, ShieldAlert, Zap, FileText } from "lucide-react"

type Severity = 'error' | 'warning' | 'info'

interface LintRule {
    id: string
    severity: Severity
    message: string
    regex: RegExp
    fix?: string
    description: string
}

const RULES: LintRule[] = [
    {
        id: 'no-latest',
        severity: 'warning',
        message: 'Avoid using "latest" tag',
        regex: /FROM\s+[\w-/]+:latest/i,
        description: 'Using :latest is unpredictable. Pin to a specific version or SHA for deterministic builds.'
    },
    {
        id: 'no-root',
        severity: 'error',
        message: 'Running as root (missing USER)',
        regex: /^((?!USER).)*$/s, // Simplified check: if USER is likely missing. Logic below handles this better.
        description: 'Running containers as root is a security risk. Create a non-root user and switch to it.'
    },
    {
        id: 'apt-get-upgrade',
        severity: 'error',
        message: 'Avoid "apt-get upgrade"',
        regex: /apt-get\s+upgrade/i,
        description: 'apt-get upgrade can install unpredictable versions. Use specific versioning instead.'
    },
    {
        id: 'combine-run',
        severity: 'info',
        message: 'Multiple RUN instructions found',
        regex: /(RUN\s+.*){3,}/s, // Heuristic: 3+ RUN commands
        description: 'Consolidate RUN instructions to reduce image layers and size.'
    },
    {
        id: 'prefer-copy',
        severity: 'info',
        message: 'Prefer COPY over ADD',
        regex: /ADD\s+/i,
        description: 'ADD has magic behavior (tar extraction, remote URLs). COPY is more explicit and preferred for local files.'
    },
    {
        id: 'sudo-usage',
        severity: 'error',
        message: 'Avoid sudo',
        regex: /sudo\s+/i,
        description: 'sudo is typically not installed or needed in Docker containers. Run commands directly as root before switching users.'
    },
    {
        id: 'missing-pip-cache',
        severity: 'info',
        message: 'Pip cache not disabled',
        regex: /pip\s+install\s+(?!.*--no-cache-dir)/i,
        description: 'Use --no-cache-dir with pip install to reduce image size.'
    },
    {
        id: 'exposed-secrets',
        severity: 'error',
        message: 'Possible secret key exposed',
        regex: /(api_key|secret|password)\s*[:=]\s*['"][a-zA-Z0-9]{10,}['"]/i,
        description: 'Never hardcode secrets in Dockerfiles. Use build args or environment variables.'
    }
]

interface AuditResult {
    ruleId: string
    line: number
    content: string
    severity: Severity
    message: string
    description: string
}

export function DockerfileLinter() {
    const [content, setContent] = useState(`FROM node:latest
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
CMD ["npm", "start"]`)

    const [hasUserCheck, setHasUserCheck] = useState(true) // Helper logic for NO-ROOT rule

    const results = useMemo(() => {
        const hits: AuditResult[] = []
        const lines = content.split('\n')

        // 1. Line-by-line checks
        lines.forEach((line, idx) => {
            RULES.forEach(rule => {
                // Skip special full-file checks
                if (rule.id === 'no-root' || rule.id === 'combine-run') return

                if (rule.regex.test(line)) {
                    hits.push({
                        ruleId: rule.id,
                        line: idx + 1,
                        content: line.trim(),
                        severity: rule.severity,
                        message: rule.message,
                        description: rule.description
                    })
                }
            })
        })

        // 2. Full-content Checks

        // Check for USER instruction
        if (!/USER\s+/.test(content)) {
            hits.push({
                ruleId: 'no-root',
                line: 0,
                content: 'Global',
                severity: 'error',
                message: 'No USER instruction found',
                description: 'The Dockerfile does not switch to a non-root user. Add "USER <name>" towards the end.'
            })
        }

        // Check for excessive RUN commands (heuristically, distinct from chained &&)
        const runCount = lines.filter(l => l.trim().toUpperCase().startsWith("RUN ")).length
        if (runCount > 3) {
            hits.push({
                ruleId: 'combine-run',
                line: 0,
                content: 'Global',
                severity: 'info',
                message: `Found ${runCount} separate RUN instructions`,
                description: 'Consider chaining commands with "&&" to reduce layer count.'
            })
        }

        return hits.sort((a, b) => {
            const sevOrder = { error: 0, warning: 1, info: 2 }
            return sevOrder[a.severity] - sevOrder[b.severity]
        })
    }, [content])

    const stats = {
        error: results.filter(r => r.severity === 'error').length,
        warning: results.filter(r => r.severity === 'warning').length,
        info: results.filter(r => r.severity === 'info').length,
        score: Math.max(0, 100 - (results.reduce((acc, r) => acc + (r.severity === 'error' ? 10 : r.severity === 'warning' ? 5 : 1), 0)))
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[700px]">
            {/* Input Column */}
            <Card className="flex flex-col h-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-500" />
                        Dockerfile Source
                    </CardTitle>
                    <CardDescription>Paste your Dockerfile to analyze it</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 p-0 relative">
                    <textarea
                        className="w-full h-full p-6 font-mono text-sm bg-muted/20 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 leading-relaxed"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        spellCheck={false}
                        placeholder="FROM ubuntu..."
                    />
                </CardContent>
            </Card>

            {/* Results Column */}
            <div className="flex flex-col gap-6 h-full">
                {/* Score Card */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="justify-between items-center hidden">Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-3xl font-bold tracking-tight mb-1">
                                    {stats.score}/100
                                </div>
                                <div className="text-sm text-muted-foreground font-medium">
                                    Security & Optimization Score
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="text-center">
                                    <span className="block font-bold text-red-500 text-xl">{stats.error}</span>
                                    <span className="text-xs text-muted-foreground uppercase">Errors</span>
                                </div>
                                <div className="text-center">
                                    <span className="block font-bold text-yellow-500 text-xl">{stats.warning}</span>
                                    <span className="text-xs text-muted-foreground uppercase">Warns</span>
                                </div>
                                <div className="text-center">
                                    <span className="block font-bold text-blue-500 text-xl">{stats.info}</span>
                                    <span className="text-xs text-muted-foreground uppercase">Info</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Audit List */}
                <Card className="flex-1 overflow-hidden flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 text-primary" />
                            Audit Findings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 p-0">
                        <ScrollArea className="h-full">
                            {results.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full p-8 text-muted-foreground">
                                    <CheckCircle className="w-12 h-12 mb-4 text-green-500" />
                                    <p className="text-lg font-medium">No issues found!</p>
                                    <p className="text-sm">Your Dockerfile is looking clean.</p>
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {results.map((r, i) => (
                                        <div key={i} className="p-4 hover:bg-muted/50 transition-colors">
                                            <div className="flex items-start justify-between mb-1">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant={
                                                        r.severity === 'error' ? 'destructive' :
                                                            r.severity === 'warning' ? 'default' : 'secondary'
                                                    }>
                                                        {r.severity}
                                                    </Badge>
                                                    <span className="font-semibold text-sm">{r.message}</span>
                                                </div>
                                                {r.line > 0 && (
                                                    <span className="text-xs font-mono text-muted-foreground">Line {r.line}</span>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                {r.description}
                                            </p>
                                            {r.line > 0 && (
                                                <div className="bg-slate-950 text-slate-300 p-2 rounded text-xs font-mono">
                                                    {r.content}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
