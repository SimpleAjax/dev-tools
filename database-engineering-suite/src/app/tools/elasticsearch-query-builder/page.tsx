import { Metadata } from 'next';
import { ElasticQueryBuilder } from '@/components/tools/elasticsearch-query-builder';

export const metadata: Metadata = {
    title: 'Elasticsearch Query DSL Builder | Database Engineering Suite',
    description: 'Construct valid Elasticsearch JSON queries visually. Supports Match, Term, Range, and Boolean queries.',
    keywords: ['elasticsearch query builder', 'elastic dsl generator', 'kibana query helper', 'opensearch query builder'],
};

export default function ElasticQueryBuilderPage() {
    return (
        <div className="space-y-6">
            <div className="border-b pb-4">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    Elasticsearch Query Builder
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Stop wrestling with nested JSON brackets. Build Elastic DSL queries visually.
                </p>
            </div>

            <ElasticQueryBuilder />

            <div className="mt-8 prose dark:prose-invert max-w-none">
                <hr className="my-8 border-slate-200 dark:border-slate-800" />
                <h3>Query Types</h3>
                <ul>
                    <li><strong>Term:</strong> Exact match (good for IDs, Enums).</li>
                    <li><strong>Match:</strong> Full-text search (good for descriptions, logs).</li>
                    <li><strong>Bool:</strong> Combine multiple conditions (must, should, filter).</li>
                </ul>
            </div>
        </div>
    );
}
