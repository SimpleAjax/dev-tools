import { Metadata } from 'next';
import { MigrationNamer } from '@/components/tools/migration-namer';

export const metadata: Metadata = {
    title: 'Migration File Namer | Database Engineering Suite',
    description: 'Generate standardized, timestamped filenames for database migrations (Rails, Django, Goose, etc.).',
    keywords: ['migration namer', 'database migration filename', 'rails migration generator', 'django makemigrations name', 'goose migration format'],
};

export default function MigrationNamerPage() {
    return (
        <div className="space-y-6">
            <div className="border-b pb-4">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    Migration File Namer
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Stop manually typing timestamps. Generate consistent migration filenames instantly.
                </p>
            </div>

            <MigrationNamer />

            <div className="mt-8 prose dark:prose-invert max-w-none">
                <hr className="my-8 border-slate-200 dark:border-slate-800" />
                <h3>Why use this?</h3>
                <p>
                    Frameworks like Rails, Django, and Goose rely on timestamped filenames to order migrations (e.g., <code>20231024000000_create_users.sql</code>). Manually typing generic filenames often leads to collisions or ordering issues.
                </p>
            </div>
        </div>
    );
}
