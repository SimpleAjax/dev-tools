import { Metadata } from "next";
import { AchViewer } from "@/components/tools/ach-viewer";

export const metadata: Metadata = {
    title: "ACH File Viewer (NACHA) | Fintech Tools",
    description: "Visualize and parse US ACH (NACHA) banking files. Supports PPD, CCD, and other standard entry classes.",
    keywords: ["ACH Viewer", "NACHA Parser", "Banking File", "Direct Deposit Debugger", "Fintech Utils"],
};

export default function Page() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">ACH File Viewer</h1>
                <p className="text-lg text-muted-foreground">
                    Parse NACHA fixed-width files used for US direct deposits and payments.
                </p>
            </div>
            <AchViewer />
        </div>
    );
}
