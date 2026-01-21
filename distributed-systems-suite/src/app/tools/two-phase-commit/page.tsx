import type { Metadata } from 'next';
import TwoPhaseCommit from '@/components/tools/two-phase-commit';

export const metadata: Metadata = {
    title: '2-Phase Commit (2PC) | Distributed Systems',
    description: 'Visualize the Two-Phase Commit protocol for atomic distributed transactions.',
};

export default function Page() {
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Two-Phase Commit (2PC) Simulator</h1>
                <p className="text-muted-foreground mt-2 max-w-3xl">
                    2PC ensures that a transaction is committed on all participating nodes or none at all (Atomicity). <br />
                    It involves a <strong>Prepare Phase</strong> (Voting) and a <strong>Commit Phase</strong> (Action). It is blocking and prone to coordinator failure issues.
                </p>
            </div>
            <TwoPhaseCommit />
        </div>
    );
}
