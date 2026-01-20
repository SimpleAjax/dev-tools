import { Metadata } from 'next';
import { MongoObjectIdAnalyzer } from '@/components/tools/mongodb-objectid-analyzer';

export const metadata: Metadata = {
    title: 'MongoDB ObjectId Analyzer | Database Engineering Suite',
    description: 'Decode MongoDB Object IDs to extract the hidden creation timestamp, machine ID, process ID, and counter.',
    keywords: ['mongodb objectid decoder', 'extract date from objectid', 'mongo id explainer', 'bson objectid'],
};

export default function MongoObjectIdPage() {
    return (
        <div className="space-y-6">
            <div className="border-b pb-4">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    MongoDB ObjectId Analyzer
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Did you know every MongoDB ID contains a creation date? Extract it here.
                </p>
            </div>

            <MongoObjectIdAnalyzer />

            <div className="mt-8 prose dark:prose-invert max-w-none">
                <hr className="my-8 border-slate-200 dark:border-slate-800" />
                <h3>Structure of an ObjectId</h3>
                <p>
                    A 12-byte ObjectId consists of:
                </p>
                <ul>
                    <li><strong>4-byte timestamp value:</strong> representing the ObjectId&apos;s creation, measured in seconds since the Unix epoch.</li>
                    <li><strong>3-byte random value:</strong> generated once per machine/process.</li>
                    <li><strong>2-byte process id:</strong> usually the process ID (PID).</li>
                    <li><strong>3-byte incrementing counter:</strong> initialized to a random value.</li>
                </ul>
            </div>
        </div>
    );
}
