import type { Metadata } from 'next';
import CapTheorem from '@/components/tools/cap-theorem';

export const metadata: Metadata = {
    title: 'CAP Theorem Explorer | Distributed Systems',
    description: 'Interactive visualization of the CAP Theorem tradeoffs (Consistency, Availability, Partition Tolerance).',
};

export default function Page() {
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">CAP Theorem Explorer</h1>
                <p className="text-muted-foreground mt-2 max-w-3xl">
                    The CAP theorem states that any distributed data store can effectively provide only two of the following three guarantees: <br />
                    <strong>Consistency</strong>, <strong>Availability</strong>, and <strong>Partition Tolerance</strong>. <br />
                    Since network partitions (P) are inevitable in distributed systems, you must choose between C and A.
                </p>
            </div>
            <CapTheorem />
        </div>
    );
}
