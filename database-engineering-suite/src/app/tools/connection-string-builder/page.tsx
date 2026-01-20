import { Metadata } from 'next';
import { ConnectionStringBuilder } from '@/components/tools/connection-string-builder';

export const metadata: Metadata = {
    title: 'Connection String Builder | Database Engineering Suite',
    description: 'Generate valid JDBC, ODBC, and URI connection strings for PostgreSQL, MySQL, MongoDB, Redis, and SQL Server. Prevents syntax errors and handles special character escaping.',
    keywords: ['connection string generator', 'postgres connection string', 'jdbc url builder', 'mongodb uri generator', 'redis url', 'sql server connection string'],
};

export default function ConnectionStringBuilderPage() {
    return (
        <div className="space-y-6">
            <div className="border-b pb-4">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    Connection String Builder
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Stop Googling "postgres connection string format". Build it here, error-free.
                </p>
            </div>

            <ConnectionStringBuilder />

            <div className="mt-8 prose dark:prose-invert max-w-none">
                <hr className="my-8 border-slate-200 dark:border-slate-800" />
                <h3>How it works</h3>
                <p>
                    This tool constructs URIs and Connection Strings for popular databases by adhering to their specific driver standards.
                </p>
                <ul>
                    <li><strong>URL Encoding:</strong> Automatically handles special characters in passwords (like <code>@</code>, <code>:</code>, <code>/</code>) which often break connection strings.</li>
                    <li><strong>Standard Formats:</strong>
                        <ul>
                            <li>Postgres/MySQL/Mongo: Standard URI format (<code>protocol://user:pass@host:port/db</code>).</li>
                            <li>SQL Server: JDBC format (<code>jdbc:sqlserver://...</code>).</li>
                            <li>Redis: Supports both <code>redis://</code> and <code>rediss://</code> (SSL).</li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    );
}
