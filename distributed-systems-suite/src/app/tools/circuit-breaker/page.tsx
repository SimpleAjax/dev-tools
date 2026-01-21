import type { Metadata } from 'next';
import CircuitBreaker from '@/components/tools/circuit-breaker';

export const metadata: Metadata = {
    title: 'Circuit Breaker State Machine | Distributed Systems',
    description: 'Interactive state machine showing how Circuit Breakers protect systems from cascading failures.',
};

export default function Page() {
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Circuit Breaker Visualizer</h1>
                <p className="text-muted-foreground mt-2 max-w-3xl">
                    Interact with a failing backend to see the Circuit Breaker transition from <strong>Closed</strong> (Normal) to <strong>Open</strong> (Failing Fast). <br />
                    After a timeout, it enters <strong>Half-Open</strong> to test if the service has recovered.
                </p>
            </div>
            <CircuitBreaker />
        </div>
    );
}
