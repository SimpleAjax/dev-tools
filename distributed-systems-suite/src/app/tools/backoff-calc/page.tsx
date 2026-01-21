import type { Metadata } from 'next';
import BackoffCalc from '@/components/tools/backoff-calc';

export const metadata: Metadata = {
    title: 'Exponential Backoff Calculator | Distributed Systems',
    description: 'Visualize retry strategies. Compare simple exponential backoff vs jittered backoff to prevent Thundering Herds.',
};

export default function Page() {
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Exponential Backoff Calculator</h1>
                <p className="text-muted-foreground mt-2 max-w-3xl">
                    Visualizing the difference between standard Exponential Backoff and <strong>Jittered</strong> strategies. <br />
                    See how adding randomness (Jitter) desynchronizes retries from multiple clients, protecting your backend from synchronized load spikes ("Thundering Herd").
                </p>
            </div>
            <BackoffCalc />
        </div>
    );
}
