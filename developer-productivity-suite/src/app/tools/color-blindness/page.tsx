import type { Metadata } from "next";
import { ColorBlindnessSim } from "@/components/tools/color-blindness";

export const metadata: Metadata = {
    title: "Color Blindness Simulator | DevTools",
    description: "Simulate how your images look to people with different types of color blindness.",
};

export default function ColorBlindnessPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    Color Blindness Simulator
                </h1>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                    Ensure accessible design by visualizing color vision deficiencies.
                </p>
            </div>
            <ColorBlindnessSim />
        </div>
    );
}
