import type { Metadata } from 'next';
import ConsistentHashing from '@/components/tools/consistent-hashing';

export const metadata: Metadata = {
    title: 'Consistent Hashing Simulator | Distributed Systems',
    description: 'Visualize how Consistent Hashing distributes keys across nodes and handles scale events with minimal rebalancing.',
};

export default function Page() {
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Consistent Hashing Ring</h1>
                <p className="text-muted-foreground mt-2 max-w-3xl">
                    Visualizing how modern distributed databases (Cassandra, DynamoDB, Riak) distribute data.
                    Notice how adding/removing a node only affects keys in its immediate "Arc", unlike simple Modulo Hashing.
                </p>
            </div>
            <ConsistentHashing />
        </div>
    );
}
