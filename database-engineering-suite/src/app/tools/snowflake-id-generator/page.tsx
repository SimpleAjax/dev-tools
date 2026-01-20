import { Metadata } from 'next';
import { SnowflakeIdGenerator } from '@/components/tools/snowflake-id-generator';

export const metadata: Metadata = {
    title: 'Snowflake ID Generator | Database Engineering Suite',
    description: 'Generate unique, time-sortable 64-bit integers (Snowflake IDs) based on the Twitter standard. Customize worker and datacenter IDs.',
    keywords: ['snowflake id generator', 'twitter snowflake', 'unique id generator', 'distributed id', '64-bit integer generator'],
};

export default function SnowflakeIdPage() {
    return (
        <div className="space-y-6">
            <div className="border-b pb-4">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    Snowflake ID Generator
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Create distributed, unique, time-sortable IDs compatible with Twitter&apos;s Snowflake standard.
                </p>
            </div>

            <SnowflakeIdGenerator />

            <div className="mt-8 prose dark:prose-invert max-w-none">
                <hr className="my-8 border-slate-200 dark:border-slate-800" />
                <h3>Anatomy of a Snowflake ID</h3>
                <p>
                    A Snowflake ID is a 64-bit integer composed of:
                </p>
                <ul>
                    <li><strong>1 bit:</strong> Unused sign bit</li>
                    <li><strong>41 bits:</strong> Timestamp (milliseconds since custom epoch)</li>
                    <li><strong>5 bits:</strong> Datacenter ID</li>
                    <li><strong>5 bits:</strong> Worker ID</li>
                    <li><strong>12 bits:</strong> Sequence number</li>
                </ul>
            </div>
        </div>
    );
}
