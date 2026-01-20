import { Metadata } from 'next';
import { PgHbaGenerator } from '@/components/tools/pg-hba-generator';

export const metadata: Metadata = {
    title: 'Postgres pg_hba.conf Generator | Database Engineering Suite',
    description: 'Generate secure Client Authentication Configuration (pg_hba.conf) files for PostgreSQL. Visual editor with built-in security warnings.',
    keywords: ['postgres auth config', 'pg_hba generator', 'postgresql remote access', 'postgres security config', 'pg_hba.conf example'],
};

export default function PgHbaPage() {
    return (
        <div className="space-y-6">
            <div className="border-b pb-4">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    Postgres pg_hba.conf Generator
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Configure "Who can access What from Where" without syntax errors.
                </p>
            </div>

            <PgHbaGenerator />

            <div className="mt-8 prose dark:prose-invert max-w-none">
                <hr className="my-8 border-slate-200 dark:border-slate-800" />
                <h3>Understanding <code>pg_hba.conf</code></h3>
                <p>
                    PostgreSQL Client Authentication is controlled by a file named <code>pg_hba.conf</code> (HBA = Host Based Authentication).
                </p>
                <ul>
                    <li><strong>TYPE:</strong> <code>local</code> uses Unix sockets (faster), <code>host</code> uses TCP/IP (remote).</li>
                    <li><strong>METHOD:</strong>
                        <ul>
                            <li><code>peer</code>: Trusts the OS user (OS username must match DB username).</li>
                            <li><code>scram-sha-256</code>: The modern, secure password hashing method.</li>
                            <li><code>trust</code>: <strong>Dangerous!</strong> Allows anyone to connect without a password.</li>
                        </ul>
                    </li>
                    <li><strong>Evaluation Order:</strong> Records are read top-to-bottom. The <strong>first</strong> matching record is used.</li>
                </ul>
            </div>
        </div>
    );
}
