import type { Metadata } from "next";
import { BitwiseCalc } from "@/components/tools/bitwise-calc";

export const metadata: Metadata = {
    title: "Bitwise Calculator | DevTools",
    description: "Visualize and calculate bitwise operations (AND, OR, XOR, Shift).",
};

export default function BitwiseCalcPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    Bitwise Calculator
                </h1>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                    Perform low-level bitwise operations and see the binary representation.
                </p>
            </div>
            <BitwiseCalc />
        </div>
    );
}
