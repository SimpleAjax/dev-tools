import { Metadata } from 'next';
import { DbBackupScheduler } from '@/components/tools/db-backup-scheduler';

export const metadata: Metadata = {
    title: 'Postgres/MySQL Backup to S3 Script Generator | Database Engineering Suite',
    description: 'Generate a robust bash script to dump your database, compress it, and upload it to AWS S3. Cron schedule visualizer included.',
    keywords: ['postgres backup script', 'mysql s3 backup', 'pg_dump to s3', 'database backup cron', 'automate db backup'],
};

export default function DbBackupPage() {
    return (
        <div className="space-y-6">
            <div className="border-b pb-4">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    Database Backup Scheduler (S3)
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Don't write backup scripts from scratch. Generate a standard <code>pg_dump | gzip | aws s3 cp</code> pipeline customized for your env.
                </p>
            </div>

            <DbBackupScheduler />

            <div className="mt-8 prose dark:prose-invert max-w-none">
                <hr className="my-8 border-slate-200 dark:border-slate-800" />
                <h3>Prerequisites</h3>
                <p>
                    To run the generated script, your server needs:
                </p>
                <ul>
                    <li><code>pg_dump</code> (for Postgres) or <code>mysqldump</code> (for MySQL) installed.</li>
                    <li><code>aws-cli</code> configured (run <code>aws configure</code> to set credentials or use IAM roles).</li>
                    <li><code>gzip</code> for compression.</li>
                </ul>
                <h3>Security Tip</h3>
                <p>
                    Do not hardcode passwords in the script if possible. Use <code>~/.pgpass</code> for Postgres or <code>~/.my.cnf</code> for MySQL to allow passwordless authentication for the backup user.
                </p>
            </div>
        </div>
    );
}
