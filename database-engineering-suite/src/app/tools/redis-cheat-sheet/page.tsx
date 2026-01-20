import { Metadata } from 'next';
import { RedisCheatSheet } from '@/components/tools/redis-cheat-sheet';

export const metadata: Metadata = {
    title: 'Redis Commands Cheat Sheet & Time Complexity | Database Engineering Suite',
    description: 'Searchable reference for Redis commands including Time Complexity (Big O). Avoid performance killers in production.',
    keywords: ['redis commands', 'redis cheat sheet', 'redis time complexity', 'redis o(n) commands', 'redis performance'],
};

export default function RedisCheatSheetPage() {
    return (
        <div className="space-y-6">
            <div className="border-b pb-4">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    Redis Command Cheat Sheet
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Know your Big O before you deploy. Don't run <code>KEYS *</code> in production.
                </p>
            </div>

            <RedisCheatSheet />

            <div className="mt-8 prose dark:prose-invert max-w-none">
                <hr className="my-8 border-slate-200 dark:border-slate-800" />
                <h3>Why Time Complexity Matters in Redis</h3>
                <p>
                    Redis is single-threaded. This means if you run a command with <strong>O(N)</strong> complexity (like <code>KEYS *</code> or <code>HGETALL</code> on a huge hash), you block the <strong>entire server</strong> until it finishes.
                </p>
                <ul>
                    <li><span className="bg-green-100 text-green-800 px-1 rounded">O(1)</span>: Safe. Constant time, regardless of data size.</li>
                    <li><span className="bg-yellow-100 text-yellow-800 px-1 rounded">O(log N)</span>: Usually safe. Time grows slowly (logarithmically) with data size.</li>
                    <li><span className="bg-red-100 text-red-800 px-1 rounded">O(N)</span>: <strong>Dangerous.</strong> Time grows linearly. Executing this on 1 million items can freeze Redis for seconds.</li>
                </ul>
            </div>
        </div>
    );
}
