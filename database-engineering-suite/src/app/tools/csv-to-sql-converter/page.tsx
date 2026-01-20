import { Metadata } from 'next';
import { CsvToSqlConverter } from '@/components/tools/csv-to-sql-converter';

export const metadata: Metadata = {
    title: 'CSV to SQL Converter | Database Engineering Suite',
    description: 'Convert CSV files to SQL INSERT statements directly in your browser. Auto-detects headers, supports custom delimiters, and handles large files efficiently.',
    keywords: ['csv to sql', 'import csv to mysql', 'convert csv to postgres', 'csv sql generator', 'csv import tool'],
};

export default function CsvToSqlPage() {
    return (
        <div className="space-y-6">
            <div className="border-b pb-4">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    CSV to SQL Import Generator
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Turn any CSV file into a SQL Import script without uploading it to a server.
                </p>
            </div>

            <CsvToSqlConverter />

            <div className="mt-8 prose dark:prose-invert max-w-none">
                <hr className="my-8 border-slate-200 dark:border-slate-800" />
                <h3>How it works</h3>
                <p>
                    This tool uses the <code>PapaParse</code> library to read your CSV file directly in the browser memory.
                </p>
                <ul>
                    <li><strong>No Uploads:</strong> Your sensitive CSV data never leaves your computer.</li>
                    <li><strong>Smart Parsing:</strong> Automatically handles custom delimiters (Comma, Tab, Semicolon) and quoted fields.</li>
                    <li><strong>Batch Inserts:</strong> Generates optimized batch <code>INSERT</code> statements for faster execution.</li>
                </ul>
            </div>
        </div>
    );
}
