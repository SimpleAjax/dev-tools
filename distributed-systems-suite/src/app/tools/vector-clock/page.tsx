import type { Metadata } from 'next';
import VectorClockSim from '@/components/tools/vector-clock';

export const metadata: Metadata = {
    title: 'Vector Clocks | Distributed Systems',
    description: 'Interactive playground for Vector Clocks. Understand logical time, ordering, and causality in distributed systems.',
};

export default function Page() {
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Vector Clock Simulator</h1>
                <p className="text-muted-foreground mt-2 max-w-3xl">
                    In distributed systems without a global clock, we use Vector Clocks to track the partial ordering of events. <br />
                    This simulator lets you generate events and exchange messages to see how logical timestamps update.
                </p>
            </div>
            <VectorClockSim />
        </div>
    );
}
