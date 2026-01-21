import type { Metadata } from 'next';
import RateLimiter from '@/components/tools/rate-limiter';

export const metadata: Metadata = {
    title: 'Rate Limiter Simulator | Distributed Systems',
    description: 'Interactive comparison of Token Bucket vs Leaky Bucket algorithms for API rate limiting.',
};

export default function Page() {
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Rate Limiter Simulator</h1>
                <p className="text-muted-foreground mt-2 max-w-3xl">
                    Visualizing the difference between <strong>Token Bucket</strong> (allows bursts) and <strong>Leaky Bucket</strong> (smoothes traffic) algorithms. Control the capacity and refill rates to see how they handle traffic spikes.
                </p>
            </div>
            <RateLimiter />
        </div>
    );
}
