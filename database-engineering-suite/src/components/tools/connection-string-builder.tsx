'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Cable, CheckCircle2, RotateCcw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

type DbType = 'postgres' | 'mysql' | 'mongodb' | 'redis' | 'sqlserver';

const defaultPorts: Record<DbType, number> = {
    postgres: 5432,
    mysql: 3306,
    mongodb: 27017,
    redis: 6379,
    sqlserver: 1433,
};

const placeholders: Record<DbType, string> = {
    postgres: 'postgresql://user:password@localhost:5432/dbname',
    mysql: 'mysql://user:password@localhost:3306/dbname',
    mongodb: 'mongodb://user:password@localhost:27017/dbname',
    redis: 'redis://:password@localhost:6379/0',
    sqlserver: 'sqlserver://localhost:1433;database=dbname;user=user;password=password;',
};

export function ConnectionStringBuilder() {
    const [dbType, setDbType] = useState<DbType>('postgres');
    const [host, setHost] = useState('localhost');
    const [port, setPort] = useState<string>('5432');
    const [database, setDatabase] = useState('mydb');
    const [username, setUsername] = useState('postgres');
    const [password, setPassword] = useState('');
    const [ssl, setSsl] = useState(false);
    const [params, setParams] = useState('');
    const [output, setOutput] = useState('');

    // Redis specific
    const [redisDb, setRedisDb] = useState('0');

    // Update port when db type changes
    useEffect(() => {
        setPort(defaultPorts[dbType].toString());
        if (dbType === 'postgres') setUsername('postgres');
        if (dbType === 'mysql') setUsername('root');
        if (dbType === 'mongodb') setUsername('admin');
        if (dbType === 'sqlserver') setUsername('sa');
    }, [dbType]);

    useEffect(() => {
        generateConnectionString();
    }, [dbType, host, port, database, username, password, ssl, params, redisDb]);

    const generateConnectionString = () => {
        let uri = '';
        const safeUser = encodeURIComponent(username);
        const safePass = encodeURIComponent(password);
        const safeHost = host || 'localhost';
        const safePort = port || defaultPorts[dbType];

        switch (dbType) {
            case 'postgres':
                uri = `postgresql://${safeUser}${safePass ? `:${safePass}` : ''}@${safeHost}:${safePort}/${database}`;
                if (ssl) uri += '?sslmode=require';
                break;
            case 'mysql':
                uri = `mysql://${safeUser}${safePass ? `:${safePass}` : ''}@${safeHost}:${safePort}/${database}`;
                if (ssl) uri += '?ssl={"rejectUnauthorized":true}';
                break;
            case 'mongodb':
                uri = `mongodb://${safeUser}${safePass ? `:${safePass}` : ''}@${safeHost}:${safePort}/${database}`;
                if (ssl) uri += '?ssl=true';
                break;
            case 'redis':
                uri = `redis://${safePass ? `:${safePass}@` : ''}${safeHost}:${safePort}/${redisDb}`;
                if (ssl) uri = uri.replace('redis://', 'rediss://');
                break;
            case 'sqlserver':
                // JDBC format often used, or connection string format
                uri = `jdbc:sqlserver://${safeHost}:${safePort};databaseName=${database};user=${safeUser};password=${safePass};`;
                if (ssl) uri += 'encrypt=true;trustServerCertificate=false;';
                break;
        }

        if (params && dbType !== 'sqlserver') {
            const separator = uri.includes('?') ? '&' : '?';
            uri += `${separator}${params}`;
        }

        setOutput(uri);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                            <Cable className="h-5 w-5 text-blue-500" /> Configuration
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Tabs value={dbType} onValueChange={(v) => setDbType(v as DbType)} className="w-full">
                            <TabsList className="grid w-full grid-cols-5">
                                <TabsTrigger value="postgres">Postgres</TabsTrigger>
                                <TabsTrigger value="mysql">MySQL</TabsTrigger>
                                <TabsTrigger value="mongodb">Mongo</TabsTrigger>
                                <TabsTrigger value="redis">Redis</TabsTrigger>
                                <TabsTrigger value="sqlserver">MSSQL</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Host</Label>
                                <Input value={host} onChange={(e) => setHost(e.target.value)} placeholder="localhost" />
                            </div>
                            <div className="space-y-2">
                                <Label>Port</Label>
                                <Input value={port} onChange={(e) => setPort(e.target.value)} placeholder={defaultPorts[dbType].toString()} />
                            </div>
                        </div>

                        {dbType !== 'redis' && (
                            <div className="space-y-2">
                                <Label>Database Name</Label>
                                <Input value={database} onChange={(e) => setDatabase(e.target.value)} placeholder="my_database" />
                            </div>
                        )}

                        {dbType === 'redis' && (
                            <div className="space-y-2">
                                <Label>DB Index</Label>
                                <Input value={redisDb} onChange={(e) => setRedisDb(e.target.value)} placeholder="0" type="number" />
                            </div>
                        )}

                        {dbType !== 'redis' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Username</Label>
                                    <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="user" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Password</Label>
                                    <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••" />
                                </div>
                            </div>
                        )}

                        {dbType === 'redis' && (
                            <div className="space-y-2">
                                <Label>Password (Optional)</Label>
                                <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••" />
                            </div>
                        )}

                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                            <div className="space-y-0.5">
                                <Label className="text-base">SSL / TLS</Label>
                                <p className="text-xs text-slate-500">Enable secure connection</p>
                            </div>
                            <Switch checked={ssl} onCheckedChange={setSsl} />
                        </div>

                        <div className="space-y-2">
                            <Label>Extra Parameters (URL encoded)</Label>
                            <Input value={params} onChange={(e) => setParams(e.target.value)} placeholder="key=value&timeout=5000" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="lg:col-span-5 space-y-6">
                <Card className="h-full border-blue-100 dark:border-blue-900 shadow-md">
                    <CardHeader className="bg-blue-50/50 dark:bg-blue-900/20 pb-4 border-b border-blue-100 dark:border-blue-900">
                        <CardTitle className="text-blue-700 dark:text-blue-300 text-sm font-semibold uppercase tracking-wider">Generated Connection String</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="p-4 bg-slate-950 rounded-lg group relative">
                            <code className="text-green-400 font-mono text-sm break-all leading-relaxed block">
                                {output}
                            </code>
                        </div>

                        <Button size="lg" className="w-full gap-2" onClick={copyToClipboard}>
                            <Copy className="h-4 w-4" /> Copy to Clipboard
                        </Button>

                        <Alert className="bg-slate-50 dark:bg-slate-900 border-0">
                            <CheckCircle2 className="h-4 w-4 text-slate-500" />
                            <AlertDescription className="text-xs text-slate-500">
                                This string is generated entirely in your browser. No credentials are transmitted.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
