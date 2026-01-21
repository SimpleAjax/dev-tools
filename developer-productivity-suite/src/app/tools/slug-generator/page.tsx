import type { Metadata } from "next";
import { SlugGenerator } from "@/components/tools/slug-generator";

export const metadata: Metadata = {
    title: "Slug Generator | DevTools",
    description: "Convert strings into URL-friendly slugs with custom separators.",
};

export default function SlugGeneratorPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    Slug Generator
                </h1>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                    Instantly generate SEO-friendly URL slugs from any text.
                </p>
            </div>
            <SlugGenerator />
        </div>
    );
}
