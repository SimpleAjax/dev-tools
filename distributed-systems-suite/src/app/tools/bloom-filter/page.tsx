import type { Metadata } from 'next';
import BloomFilter from '@/components/tools/bloom-filter';

export const metadata: Metadata = {
    title: 'Bloom Filter Calculator | Distributed Systems',
    description: 'Understand probabilistic data structures. Visualize how Bloom Filters avoid expensive disk lookups at the cost of false positives.',
};

export default function Page() {
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Bloom Filter Calculator</h1>
                <p className="text-muted-foreground mt-2 max-w-3xl">
                    A Bloom filter is a space-efficient probabilistic data structure that is used to test whether an element is a member of a set. <br />
                    False positive matches are possible, but false negatives are not &ndash; in other words, a query returns either "possibly in set" or "definitely not in set".
                </p>
            </div>
            <BloomFilter />
        </div>
    );
}
