'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Database, FileJson, Table, Code, Cable, FileCode, Workflow, ArrowRightLeft, FileSpreadsheet, Lock, Fingerprint, Microscope, WrapText, Clock, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';

const tools = [
    {
        name: 'JSON to SQL',
        href: '/tools/json-to-sql-converter',
        icon: FileJson,
        phase: 1
    },
    {
        name: 'CSV to SQL',
        href: '/tools/csv-to-sql-converter',
        icon: FileSpreadsheet,
        phase: 1
    },
    {
        name: 'SQL Formatter',
        href: '/tools/sql-formatter',
        icon: Code,
        phase: 1
    },
    {
        name: 'JSON <> YAML',
        href: '/tools/json-yaml-converter',
        icon: ArrowRightLeft,
        phase: 1
    },
    {
        name: 'Connection String',
        href: '/tools/connection-string-builder',
        icon: Cable,
        phase: 1
    },
    {
        name: 'ERD to SQL',
        href: '/tools/erd-to-sql',
        icon: Workflow,
        phase: 2
    },
    {
        name: 'pg_hba.conf',
        href: '/tools/pg-hba-generator',
        icon: Lock,
        phase: 2
    },
    {
        name: 'Backup Scheduler',
        href: '/tools/db-backup-scheduler',
        icon: Database,
        phase: 2
    },
    {
        name: 'SQL Index Advisor',
        href: '/tools/sql-index-advisor',
        icon: Table,
        phase: 2
    },
    {
        name: 'Redis Cheat Sheet',
        href: '/tools/redis-cheat-sheet',
        icon: FileCode,
        phase: 2
    },
    {
        name: 'SQL to JSON',
        href: '/tools/sql-to-json-converter',
        icon: FileJson,
        phase: 1
    },
    {
        name: 'XML to JSON',
        href: '/tools/xml-json-converter',
        icon: ArrowRightLeft,
        phase: 1
    },
    {
        name: 'TOML <> JSON',
        href: '/tools/toml-json-converter',
        icon: ArrowRightLeft,
        phase: 1
    },
    {
        name: 'DynamoDB JSON',
        href: '/tools/dynamodb-json-marshaller',
        icon: Database,
        phase: 2
    },
    {
        name: 'Snowflake ID',
        href: '/tools/snowflake-id-generator',
        icon: Fingerprint,
        phase: 2
    },
    {
        name: 'MongoDB ObjectId',
        href: '/tools/mongodb-objectid-analyzer',
        icon: Microscope,
        phase: 2
    },
    {
        name: 'UUID/ULID Gen',
        href: '/tools/uuid-ulid-generator',
        icon: Fingerprint,
        phase: 2
    },
    {
        name: 'SQL IN Builder',
        href: '/tools/sql-in-builder',
        icon: WrapText,
        phase: 2
    },
    {
        name: 'Migration Namer',
        href: '/tools/migration-namer',
        icon: Clock,
        phase: 2
    },
    {
        name: 'Elastic Query',
        href: '/tools/elasticsearch-query-builder',
        icon: Search,
        phase: 2
    }
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 border-r bg-slate-50/40 dark:bg-slate-900/40 h-screen flex flex-col sticky top-0 hidden md:flex">
            <div className="p-6 border-b">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                    <Database className="h-6 w-6 text-blue-600" />
                    <span>DB Engineering</span>
                </Link>
            </div>
            <ScrollArea className="flex-1 py-4">
                <div className="px-4 space-y-6">
                    <div>
                        <h3 className="mb-2 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Data Transformation
                        </h3>
                        {tools.filter(t => t.phase === 1).map((tool) => (
                            <Button
                                key={tool.href}
                                variant={pathname === tool.href ? "secondary" : "ghost"}
                                asChild
                                className="w-full justify-start"
                            >
                                <Link href={tool.href}>
                                    <tool.icon className="mr-2 h-4 w-4" /> {tool.name}
                                </Link>
                            </Button>
                        ))}
                    </div>

                    <div>
                        <h3 className="mb-2 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Logic & Design
                        </h3>
                        {tools.filter(t => t.phase === 2).map((tool) => (
                            <Button
                                key={tool.href}
                                variant={pathname === tool.href ? "secondary" : "ghost"}
                                asChild
                                className="w-full justify-start"
                            >
                                <Link href={tool.href}>
                                    <tool.icon className="mr-2 h-4 w-4" /> {tool.name}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}
