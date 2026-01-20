"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/tool-shell";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";

// Simplified static DB for demo purposes. In production this would be larger.
const PORTS = [
    { port: 21, service: "FTP", description: "File Transfer Protocol" },
    { port: 22, service: "SSH", description: "Secure Shell" },
    { port: 23, service: "Telnet", description: "Unencrypted remote login" },
    { port: 25, service: "SMTP", description: "Simple Mail Transfer Protocol (sending)" },
    { port: 53, service: "DNS", description: "Domain Name System" },
    { port: 80, service: "HTTP", description: "HyperText Transfer Protocol" },
    { port: 110, service: "POP3", description: "Post Office Protocol v3" },
    { port: 143, service: "IMAP", description: "Internet Message Access Protocol" },
    { port: 443, service: "HTTPS", description: "HTTP Secure" },
    { port: 1433, service: "MSSQL", description: "Microsoft SQL Server" },
    { port: 3306, service: "MySQL", description: "MySQL Database" },
    { port: 3389, service: "RDP", description: "Remote Desktop Protocol" },
    { port: 5432, service: "PostgreSQL", description: "PostgreSQL Database" },
    { port: 6379, service: "Redis", description: "Redis Key-Value Store" },
    { port: 8080, service: "HTTP-Alt", description: "Alternative HTTP port" },
    { port: 27017, service: "MongoDB", description: "MongoDB NoSQL Database" },
];

export function PortLookup() {
    const [query, setQuery] = useState("");

    const filtered = PORTS.filter(p =>
        p.port.toString().includes(query) ||
        p.service.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Search Ports</CardTitle>
                    <CardDescription>Find common port numbers and services.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by port (5432) or service (Postgres)..."
                            className="pl-10 text-lg"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Port</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead>Description</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.length > 0 ? filtered.map((p) => (
                            <TableRow key={p.port}>
                                <TableCell className="font-mono font-bold text-blue-600">{p.port}</TableCell>
                                <TableCell className="font-semibold">{p.service}</TableCell>
                                <TableCell className="text-muted-foreground">{p.description}</TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                                    No ports found matching "{query}"
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
