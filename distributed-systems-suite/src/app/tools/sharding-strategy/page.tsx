import type { Metadata } from 'next';
import ShardingStrategy from '@/components/tools/sharding-strategy';

export const metadata: Metadata = {
    title: 'Sharding Strategy Visualizer | Distributed Systems',
    description: 'Visualize the difference between Range and Hash sharding. Understand why sequential writes cause hotspots in range-based systems.',
};

export default function Page() {
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Sharding Strategy Visualizer</h1>
                <p className="text-muted-foreground mt-2 max-w-3xl">
                    Database Sharding distributes data across multiple nodes. <br />
                    <strong>Range Sharding</strong> keeps related data together (good for queries) but can create hotspots. <br />
                    <strong>Hash Sharding</strong> distributes data evenly but makes range queries expensive (Scatter-Gather).
                </p>
            </div>
            <ShardingStrategy />
        </div>
    );
}
