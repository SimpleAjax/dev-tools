import type { Metadata } from "next";
import { CaseConverter } from "@/components/tools/case-converter";

export const metadata: Metadata = {
    title: "Case Converter | DevTools",
    description: "Convert text between Camel, Pascal, Snake, Kebab, and other cases.",
};

export default function CaseConverterPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    Case Converter
                </h1>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                    Transform text into any variable naming convention instantly.
                </p>
            </div>
            <CaseConverter />
        </div>
    );
}
