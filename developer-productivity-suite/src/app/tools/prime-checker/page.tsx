import type { Metadata } from "next";
import { PrimeChecker } from "@/components/tools/prime-checker";

export const metadata: Metadata = {
    title: "Prime Number Checker | DevTools",
    description: "Check if a number is prime and find its factors.",
};

export default function PrimeCheckerPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    Prime Number Checker
                </h1>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                    Determine if a number is prime instantly.
                </p>
            </div>
            <PrimeChecker />
        </div>
    );
}
