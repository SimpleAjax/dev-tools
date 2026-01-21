import type { Metadata } from "next";
import { MimeLookup } from "@/components/tools/mime-lookup";

export const metadata: Metadata = {
    title: "MIME Type Lookup | DevTools",
    description: "Search for Media Types (MIME) and file extensions.",
};

export default function MimeLookupPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    MIME Type Lookup
                </h1>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                    Find the correct Content-Type for any file extension.
                </p>
            </div>
            <MimeLookup />
        </div>
    );
}
