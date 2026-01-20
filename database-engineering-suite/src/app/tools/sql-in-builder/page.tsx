import { Metadata } from 'next';
import { SqlInBuilder } from '@/components/tools/sql-in-builder';

export const metadata: Metadata = {
    title: 'SQL IN Clause Builder | Database Engineering Suite',
    description: 'Paste a list of IDs, emails, or values and instantly get a formatted SQL IN (...) clause. Handles quoting, deduplication, and comma separation.',
    keywords: ['sql in builder', 'sql value list generator', 'csv to sql in', 'format sql list', 'prepare sql query'],
};

export default function SqlInBuilderPage() {
    return (
        <div className="space-y-6">
            <div className="border-b pb-4">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    SQL IN Clause Builder
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Turn a spreadsheet column or list of IDs into a query-ready <code>IN (...)</code> list.
                </p>
            </div>

            <SqlInBuilder />

            <div className="mt-8 prose dark:prose-invert max-w-none">
                <hr className="my-8 border-slate-200 dark:border-slate-800" />
                <h3>Tips</h3>
                <ul>
                    <li><strong>Deduplication:</strong> Automatically removes duplicate values from your list.</li>
                    <li><strong>Quoting:</strong> Select single quotes (<code>&apos;value&apos;</code>) for strings or no quotes for IDs/Integrs.</li>
                    <li><strong>Formatting:</strong> Choose multi-line output for cleaner, Git-friendly queries when dealing with large lists.</li>
                </ul>
            </div>
        </div>
    );
}
