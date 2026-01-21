import type { Metadata } from 'next';
import GossipProtocol from '@/components/tools/gossip-protocol';

export const metadata: Metadata = {
    title: 'Gossip Protocol Visualizer | Distributed Systems',
    description: 'Simulate epidemic (Gossip) protocols for state propagation in distributed clusters.',
};

export default function Page() {
    return (
        <div className="p-6">
            <div className="mb-4">
                <h1 className="text-3xl font-bold tracking-tight">Gossip Protocol Visualizer</h1>
                <p className="text-muted-foreground mt-2 max-w-3xl">
                    Visualizing the "Epidemic" behavior of Gossip protocols (like SWIM/Serf). See how information spreads exponentially through a cluster even with limited peer-to-peer connections.
                </p>
            </div>
            <GossipProtocol />
        </div>
    );
}
