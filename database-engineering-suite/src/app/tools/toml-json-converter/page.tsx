import { Metadata } from 'next';
import { TomlJsonConverter } from '@/components/tools/toml-json-converter';

export const metadata: Metadata = {
    title: 'TOML to JSON / JSON to TOML Converter | Database Engineering Suite',
    description: 'Convert Tom\'s Obvious Minimal Language (TOML) to JSON and vice-versa. Perfect for cargo.toml, pyproject.toml, and netlify.toml configurations.',
    keywords: ['toml to json', 'json to toml', 'toml parser', 'toml validator', 'configuration converter'],
};

export default function TomlJsonPage() {
    return (
        <div className="space-y-6">
            <div className="border-b pb-4">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    TOML &lt;&gt; JSON Converter
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Parse and validate TOML files instantly. Useful for Rust crates, Python projects, and modern static site configs.
                </p>
            </div>

            <TomlJsonConverter />

            <div className="mt-8 prose dark:prose-invert max-w-none">
                <hr className="my-8 border-slate-200 dark:border-slate-800" />
                <h3>About TOML</h3>
                <p>
                    TOML (Tom&apos;s Obvious, Minimal Language) is designed to be easy to read due to obvious semantics. It is widely used in the Rust ecosystem (Cargo), Python (Poetry/Pip), and Hugo.
                </p>
            </div>
        </div>
    );
}
