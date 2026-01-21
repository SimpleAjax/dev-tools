import type { Metadata } from "next";
import { BaseConverter } from "@/components/tools/base-converter";

export const metadata: Metadata = {
    title: "Base Converter | DevTools",
    description: "Convert numbers between Decimal, Hexadecimal, Binary, and Octal formats.",
};

export default function BaseConverterPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    Base Converter
                </h1>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                    Real-time conversion between common number systems. Supports large integers.
                </p>
            </div>
            <BaseConverter />
        </div>
    );
}
