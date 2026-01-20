import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, FileJson, Table, Code, Cable, FileCode, Workflow, ArrowRightLeft, FileSpreadsheet, Lock } from 'lucide-react';

const tools = [
  {
    name: 'JSON to SQL Converter',
    description: 'Convert JSON objects into CREATE TABLE and INSERT statements. Smart type inference.',
    href: '/tools/json-to-sql-converter',
    icon: FileJson,
    phase: 1,
    slug: 'DB-01'
  },
  {
    name: 'CSV to SQL Import Generator',
    description: 'Parses CSV headers and generates SQL import scripts with customizable delimiters.',
    href: '/tools/csv-to-sql-converter',
    icon: FileSpreadsheet,
    phase: 1,
    slug: 'DB-02'
  },
  {
    name: 'SQL Formatter/Beautifier',
    description: 'Auto-indent and colorize messy SQL queries. Supports dialects (Postgres, MySQL).',
    href: '/tools/sql-formatter',
    icon: Code,
    phase: 1,
    slug: 'DB-03'
  },
  {
    name: 'JSON <> YAML Converter',
    description: 'Bi-directional converter. Essential for debugging K8s/Config maps.',
    href: '/tools/json-yaml-converter',
    icon: ArrowRightLeft,
    phase: 1,
    slug: 'DB-04'
  },
  {
    name: 'Connection String Builder',
    description: 'Build JDBC/ODBC strings for Postgres, MySQL, Mongo, Redis.',
    href: '/tools/connection-string-builder',
    icon: Cable,
    phase: 1,
    slug: 'DB-05'
  },

  {
    name: 'Postgres pg_hba.conf',
    description: 'GUI for generating the complex, error-prone Postgres authentication config file.',
    href: '/tools/pg-hba-generator',
    icon: Lock,
    phase: 2,
    slug: 'DB-12'
  },
  {
    name: 'DB Backup Scheduler',
    description: 'Generates the bash script for pg_dump or mysqldump to S3 with cron timing.',
    href: '/tools/db-backup-scheduler',
    icon: Database,
    phase: 2,
    slug: 'DB-13'
  },
  {
    name: 'SQL Index Advisor',
    description: 'Analyzes simple CREATE TABLE and SELECT statements to suggest basic indexes.',
    href: '/tools/sql-index-advisor',
    icon: Table,
    phase: 2,
    slug: 'DB-14'
  },
  {
    name: 'Redis Cheat Sheet',
    description: 'Searchable list of Redis commands with Time Complexity (O(1), O(N)).',
    href: '/tools/redis-cheat-sheet',
    icon: FileCode,
    phase: 2,
    slug: 'DB-15'
  }
];

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Database & Backend Engineering Utilities
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          A collection of client-side tools to help you format data, build queries, and design database schemas without sending data to a server.
        </p>
      </div>

      <div className="border-b border-slate-200 dark:border-slate-800" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link href={tool.href} key={tool.slug} className="block group">
            <Card className="h-full transition-all hover:border-blue-500 hover:shadow-md dark:hover:border-blue-400">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                    <tool.icon className="h-5 w-5 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                  </div>
                  <Badge variant="outline" className="text-xs text-slate-500">
                    {tool.slug}
                  </Badge>
                </div>
                <CardTitle className="text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {tool.name}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {tool.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
