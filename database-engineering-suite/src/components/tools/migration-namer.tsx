'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Clock, Hash } from 'lucide-react';

export function MigrationNamer() {
    const [action, setAction] = useState('create');
    const [subject, setSubject] = useState('users_table');
    const [timestampFormat, setTimestampFormat] = useState('YYYYMMDDHHMMSS');
    const [output, setOutput] = useState('');

    useEffect(() => {
        generate();
    }, [action, subject, timestampFormat]);

    const generate = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        let ts = '';
        if (timestampFormat === 'YYYYMMDDHHMMSS') {
            ts = `${year}${month}${day}${hours}${minutes}${seconds}`;
        } else if (timestampFormat === 'unix') {
            ts = Math.floor(now.getTime() / 1000).toString();
        } else if (timestampFormat === 'YYYYMMDD') {
            ts = `${year}${month}${day}`;
        }

        // Clean subject: snake_case
        const cleanSubject = subject.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
        const cleanAction = action.toLowerCase();

        setOutput(`${ts}_${cleanAction}_${cleanSubject}`);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base font-medium">Migration Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Timestamp Format</Label>
                        <Select value={timestampFormat} onValueChange={setTimestampFormat}>
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="YYYYMMDDHHMMSS">Rails / Django (YYYYMMDDHHMMSS)</SelectItem>
                                <SelectItem value="unix">Unix Timestamp (Goose / db-migrate)</SelectItem>
                                <SelectItem value="YYYYMMDD">Simple Date (YYYYMMDD)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Action</Label>
                        <Select value={action} onValueChange={setAction}>
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="create">create</SelectItem>
                                <SelectItem value="add">add</SelectItem>
                                <SelectItem value="remove">remove</SelectItem>
                                <SelectItem value="alter">alter</SelectItem>
                                <SelectItem value="drop">drop</SelectItem>
                                <SelectItem value="rename">rename</SelectItem>
                                <SelectItem value="seed">seed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Subject (e.g., &quot;users table&quot;, &quot;email column&quot;)</Label>
                        <Input
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="users table"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-800 shadow-sm h-full flex flex-col justify-center bg-slate-50 dark:bg-slate-900/50">
                <CardContent className="flex flex-col items-center justify-center p-8 gap-4">
                    <div className="text-center space-y-2">
                        <Label className="uppercase text-xs font-bold text-slate-500 tracking-wider">Generated Filename</Label>
                        <div className="text-2xl font-mono font-medium text-slate-900 dark:text-slate-100 break-all">
                            {output}
                        </div>
                    </div>
                    <Button size="lg" onClick={copyToClipboard} className="gap-2">
                        <Copy className="h-4 w-4" /> Copy Filename
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
