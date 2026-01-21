import type { Metadata } from 'next';
import QuorumTuner from '@/components/tools/quorum-tuner';

export const metadata: Metadata = {
    title: 'Quorum Tuner (R+W>N) | Distributed Systems',
    description: 'Calculate consistency guarantees. Visualize how Read (R) and Write (W) quorums must overlap to ensure Strong Consistency.',
};

export default function Page() {
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Quorum Consistency Tuner</h1>
                <p className="text-muted-foreground mt-2 max-w-3xl">
                    In distributed databases (like Cassandra, DynamoDB), you tune availability vs consistency by setting <strong>N</strong> (Replicas), <strong>W</strong> (Write Quorum), and <strong>R</strong> (Read Quorum).
                </p>
            </div>
            <QuorumTuner />
        </div>
    );
}
