import type { Metadata } from 'next';
import LoadBalancerSim from '@/components/tools/load-balancer';

export const metadata: Metadata = {
    title: 'Load Balancer Simulator | Distributed Systems',
    description: 'Interactive visualization of Round Robin, Least Connections, and IP Hash load balancing algorithms.',
};

export default function Page() {
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Load Balancer Visualizer</h1>
                <p className="text-muted-foreground mt-2 max-w-3xl">
                    See how different algorithms distribute traffic across healthy and unhealthy nodes.
                    Use "Least Connections" for optimal distribution when tasks have varying durations.
                </p>
            </div>
            <LoadBalancerSim />
        </div>
    );
}
