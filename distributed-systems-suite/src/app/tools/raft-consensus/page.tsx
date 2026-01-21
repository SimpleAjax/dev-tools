import type { Metadata } from 'next';
import RaftSimulator from '@/components/tools/raft-consensus';

export const metadata: Metadata = {
    title: 'Raft Consensus Simulator | Distributed Systems',
    description: 'Interactive visualization of the Raft distributed consensus protocol, focusing on Leader Election and Heartbeats.',
};

export default function Page() {
    return (
        <div className="p-6">
            <div className="mb-4">
                <h1 className="text-3xl font-bold tracking-tight">Raft Consensus Simulator</h1>
                <p className="text-muted-foreground mt-2 max-w-3xl">
                    A visualization of the Raft leader election process. Watch how nodes time out, become candidates, request votes, and establish authority via heartbeats.
                </p>
            </div>
            <RaftSimulator />
        </div>
    );
}
