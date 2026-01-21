import type { Metadata } from 'next';
import BTreeVis from '@/components/tools/btree-vis';

export const metadata: Metadata = {
    title: 'B-Tree Visualizer | Distributed Systems',
    description: 'Interactive B-Tree visualization. Watch how database indexes split and balance as you insert data.',
};

export default function Page() {
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">SQL Index B-Tree Visualizer</h1>
                <p className="text-muted-foreground mt-2 max-w-3xl">
                    B-Trees (Balanced Trees) are the fundamental data structure behind SQL Indexes (Postgres, MySQL). <br />
                    They remain "short and fat" to minimize disk seeks. Insert numbers below to see how nodes <strong>split</strong> and propagate upwards to maintain balance.
                </p>
            </div>
            <BTreeVis />
        </div>
    );
}
