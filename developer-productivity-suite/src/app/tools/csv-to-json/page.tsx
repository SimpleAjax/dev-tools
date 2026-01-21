import type { Metadata } from "next";
import { CsvToJson } from "@/components/tools/csv-to-json";

export const metadata: Metadata = {
    title: "CSV to JSON Converter | DevTools",
    description: "Convert CSV data to JSON objects or arrays instantly.",
};

export default function CsvToJsonPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    CSV to JSON Converter
                </h1>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                    Transform comma-separated values into usable JSON for your API or app.
                </p>
            </div>
            <CsvToJson />
        </div>
    );
}
