import type { Metadata } from "next";
import { BigIntCalc } from "@/components/tools/bigint-calc";

export const metadata: Metadata = {
    title: "BigInt Calculator | DevTools",
    description: "Perform arithmetic operations on arbitrarily large integers.",
};

export default function BigIntCalcPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    BigInt Calculator
                </h1>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                    Calculate without limits. Handle numbers larger than 2^53.
                </p>
            </div>
            <BigIntCalc />
        </div>
    );
}
