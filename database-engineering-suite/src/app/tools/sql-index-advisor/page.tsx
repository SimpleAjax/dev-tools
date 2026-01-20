import { Metadata } from 'next';
import { SqlIndexAdvisor } from '@/components/tools/sql-index-advisor';

export const metadata: Metadata = {
    title: 'SQL Index Advisor (Rule-Based) | Database Engineering Suite',
    description: 'Paste your schema and queries to get instant index recommendations. Detects missing Foreign Key indexes, sort keys, and high-impact filter columns.',
    keywords: ['sql index advisor', 'database optimization tool', 'postgres index recommender', 'mysql index helper', 'slow query optimizer'],
};

export default function SqlIndexAdvisorPage() {
    return (
        <div className="space-y-6">
            <div className="border-b pb-4">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    SQL Index Advisor
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    A lightweight static analyzer that spots common indexing mistakes in your SQL.
                </p>
            </div>

            <SqlIndexAdvisor />

            <div className="mt-8 prose dark:prose-invert max-w-none">
                <hr className="my-8 border-slate-200 dark:border-slate-800" />
                <h3>How heuristics work</h3>
                <p>
                    This tool scans your SQL text for patterns that typically require indexing:
                </p>
                <ul>
                    <li><strong>Foreign Keys:</strong> Columns ending in <code>_id</code> used in <code>WHERE</code> or <code>JOIN</code> clauses usually need an index to avoid full table scans.</li>
                    <li><strong>Sorting:</strong> Columns used in <code>ORDER BY</code> clauses can benefit from B-Tree indexes to retrieve data in pre-sorted order.</li>
                    <li><strong>Filtering:</strong> High-cardinality columns used in equality checks (<code>=</code>) are prime candidates.</li>
                </ul>
                <p className="text-sm bg-yellow-50 dark:bg-yellow-900/20 p-4 border border-yellow-200 dark:border-yellow-900 rounded-lg">
                    <strong>Note:</strong> This is a static analysis tool. For perfect recommendations, a database needs to analyze actual data distribution statistics (histograms). Use <code>EXPLAIN ANALYZE</code> in production for final verification.
                </p>
            </div>
        </div>
    );
}
