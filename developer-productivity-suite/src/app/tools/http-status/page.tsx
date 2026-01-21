import type { Metadata } from "next";
import { HttpStatusGuide } from "@/components/tools/http-status";

export const metadata: Metadata = {
    title: "HTTP Status Codes | DevTools",
    description: "Searchable reference guide for HTTP status codes (200, 404, 500, etc).",
};

export default function HttpStatusPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    HTTP Status Codes
                </h1>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                    A quick reference guide for every HTTP response status code.
                </p>
            </div>
            <HttpStatusGuide />
        </div>
    );
}
