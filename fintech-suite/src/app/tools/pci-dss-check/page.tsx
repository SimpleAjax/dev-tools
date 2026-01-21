import { Metadata } from "next";
import { PciDssCheck } from "@/components/tools/pci-dss-check";

export const metadata: Metadata = {
    title: "PCI-DSS 4.0 Checklist | Fintech Tools",
    description: "Interactive audit checklist for PCI-DSS v4.0 compliance. Track your progress across the 12 key requirements.",
    keywords: ["PCI-DSS", "Compliance Checklist", "Credit Card Security", "Audit Tool", "Fintech Utils"],
};

export default function Page() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">PCI-DSS 4.0 Checklist</h1>
                <p className="text-lg text-muted-foreground">
                    A self-assessment tool to track progress towards Payment Card Industry Data Security Standards.
                </p>
            </div>
            <PciDssCheck />
        </div>
    );
}
