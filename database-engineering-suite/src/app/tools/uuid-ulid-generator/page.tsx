import { Metadata } from 'next';
import { UuidUlidGenerator } from '@/components/tools/uuid-ulid-generator';

export const metadata: Metadata = {
    title: 'UUID v4/v7 & ULID Generator | Database Engineering Suite',
    description: 'Bulk generate UUIDs (v4 random, v7 time-sortable) and ULIDs. Essential for seeding databases and testing primary keys.',
    keywords: ['uuid generator', 'uuid v7', 'ulid generator', 'bulk guid', 'time sortable id', 'unique identifier'],
};

export default function UuidUlidPage() {
    return (
        <div className="space-y-6">
            <div className="border-b pb-4">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    UUID & ULID Generator
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Modern, collision-free identifiers. Supports the new time-sortable UUID v7.
                </p>
            </div>

            <UuidUlidGenerator />

            <div className="mt-8 prose dark:prose-invert max-w-none">
                <hr className="my-8 border-slate-200 dark:border-slate-800" />
                <h3>Which one should I use?</h3>
                <ul>
                    <li><strong>UUID v4:</strong> Completely random. The industry standard, but can cause fragmentation in B-Tree database indexes.</li>
                    <li><strong>UUID v7:</strong> New standard. Time-ordered (like Snowflake/ULID) but compatible with 32-char UUID fields. <strong>Recommended for databases.</strong></li>
                    <li><strong>ULID:</strong> Sortable, shorter (26 chars), and URL-safe (no special characters). Great for URLs and APIs.</li>
                </ul>
            </div>
        </div>
    );
}
