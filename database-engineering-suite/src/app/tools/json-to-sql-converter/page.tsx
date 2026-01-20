import { Metadata } from 'next';
import { JsonToSqlConverter } from '@/components/tools/json-to-sql-converter';

export const metadata: Metadata = {
    title: 'JSON to SQL Converter | Database Engineering Suite',
    description: 'Convert JSON objects or arrays into SQL CREATE TABLE and INSERT statements instantly. Supports PostgreSQL and MySQL syntax with smart type inference.',
    keywords: ['json to sql', 'convert json to database', 'json sql generator', 'postgres insert generator', 'mysql insert generator'],
};

export default function JsonToSqlPage() {
    return (
        <div className="space-y-6">
            <div className="border-b pb-4">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    JSON to SQL Converter
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Turn messy JSON blobs into ready-to-execute SQL statements.
                </p>
            </div>

            <JsonToSqlConverter />

            <div className="mt-8 prose dark:prose-invert max-w-none">
                <hr className="my-8 border-slate-200 dark:border-slate-800" />
                <h3>How it works</h3>
                <p>
                    This tool parses your JSON input (either a single object or an array of objects) and:
                </p>
                <ol>
                    <li><strong>Infers Types:</strong> Scans your data to detect <code>INT</code>, <code>DECIMAL</code>, <code>BOOLEAN</code>, <code>TIMESTAMP</code>, or defaults to <code>TEXT</code>.</li>
                    <li><strong>Generates DDL:</strong> Creates a <code>CREATE TABLE</code> statement compatible with your chosen dialect.</li>
                    <li><strong>Generates DML:</strong> Builds a bulk <code>INSERT INTO</code> statement with proper escaping for strings and handling of <code>NULL</code> values.</li>
                </ol>
                <p>
                    <strong>Privacy Note:</strong> All processing happens 100% in your browser. Your data is never sent to any server.
                </p>
            </div>
        </div>
    );
}
