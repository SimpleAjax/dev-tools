import { Metadata } from 'next';
import { SqlFormatter } from '@/components/tools/sql-formatter';

export const metadata: Metadata = {
    title: 'Online SQL Formatter & Beautifier | Database Engineering Suite',
    description: 'Instantly format and beautify complex SQL queries. Supports PostgreSQL, MySQL, SQL Server, Snowflake, BigQuery, and more with customizable indentation and capitalization.',
    keywords: ['sql formatter', 'prettify sql', 'sql beautifier', 'format sql online', 'postgres formatter', 'mysql formatter', 'snowflake sql formatter'],
};

export default function SqlFormatterPage() {
    return (
        <div className="space-y-6">
            <div className="border-b pb-4">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    SQL Formatter / Beautifier
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Make readable sense of messy, generated, or minified SQL queries.
                </p>
            </div>

            <SqlFormatter />

            <div className="mt-8 prose dark:prose-invert max-w-none">
                <hr className="my-8 border-slate-200 dark:border-slate-800" />
                <h3>Features</h3>
                <ul>
                    <li><strong>Multi-Dialect Support:</strong> accurately formats syntax for PostgreSQL, MySQL, SQLite, SQL Server, Snowflake, Redshift, and BigQuery.</li>
                    <li><strong>Privacy First:</strong> Your queries are formatted locally in your browser using WebAssembly/JS. No logic is sent to a server.</li>
                    <li><strong>Customizable:</strong> Toggle between Uppercase/Lowercase keywords, adjust tab width, and choose between spaces or tabs.</li>
                </ul>
            </div>
        </div>
    );
}
