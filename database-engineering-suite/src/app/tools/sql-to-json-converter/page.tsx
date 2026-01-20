import { Metadata } from 'next';
import { SqlToJsonConverter } from '@/components/tools/sql-to-json-converter';

export const metadata: Metadata = {
    title: 'SQL Output to JSON Converter | Database Engineering Suite',
    description: 'Convert ASCII tables, Pipe tables, and Tab-Separated SQL query results into clean JSON objects.',
    keywords: ['sql to json', 'ascii table to json', 'convert postgres output to json', 'mysql output parser', 'tsv to json'],
};

export default function SqlToJsonPage() {
    return (
        <div className="space-y-6">
            <div className="border-b pb-4">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    SQL Output to JSON
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Paste the text output from your database terminal (CLI) and transform it into JSON.
                </p>
            </div>

            <SqlToJsonConverter />

            <div className="mt-8 prose dark:prose-invert max-w-none">
                <hr className="my-8 border-slate-200 dark:border-slate-800" />
                <h3>Supported Formats</h3>
                <ul>
                    <li><strong>ASCII / Pipe Tables:</strong> Standard output from MySQL/PostgreSQL CLI (<code>+---+---+</code> style).</li>
                    <li><strong>TSV (Tab Separated):</strong> Common output when copying from Excel or certain DB GUIs (DBeaver, DataGrip).</li>
                    <li><strong>CSV:</strong> Comma separated values.</li>
                </ul>
                <p>
                    <strong>Heuristic Inference:</strong> The tool automatically converts obvious numbers to Integers/Floats and <code>NULL</code> text to actual <code>null</code> values.
                </p>
            </div>
        </div>
    );
}
