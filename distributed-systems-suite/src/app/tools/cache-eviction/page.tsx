import type { Metadata } from 'next';
import CacheEviction from '@/components/tools/cache-eviction';

export const metadata: Metadata = {
    title: 'Cache Eviction Policies | Distributed Systems',
    description: 'Visualize how LRU, LFU, and FIFO eviction algorithms work.',
};

export default function Page() {
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Cache Eviction Simulator</h1>
                <p className="text-muted-foreground mt-2 max-w-3xl">
                    Caches have limited size and must decide what to evict when full. <br />
                    Compare standard policies: <strong>LRU</strong> (Least Recently Used), <strong>LFU</strong> (Least Frequently Used), and <strong>FIFO</strong> (First In First Out).
                </p>
            </div>
            <CacheEviction />
        </div>
    );
}
