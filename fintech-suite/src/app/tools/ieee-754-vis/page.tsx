import { Metadata } from "next";
import { Ieee754Vis } from "@/components/tools/ieee-754-vis";

export const metadata: Metadata = {
    title: "IEEE 754 Floating Point Visualizer | Fintech Tools",
    description: "Visualize how floating point numbers are stored in binary. Understand why 0.1 + 0.2 != 0.3.",
    keywords: ["IEEE 754", "Floating Point", "Binary visualizer", "JavaScript Math", "Fintech Utils"],
};

export default function Page() {
    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold tracking-tight">Floating Point Visualizer</h1>
                <p className="text-lg text-muted-foreground">
                    See the binary bits behind standard Double Precision numbers.
                </p>
            </div>
            <Ieee754Vis />
        </div>
    );
}
