import { Metadata } from "next";
import { SanctionsSearch } from "@/components/tools/sanctions-search";

export const metadata: Metadata = {
    title: "Sanctions List Search (OFAC) | Fintech Tools",
    description: "Search against a mock OFAC Specially Designated Nationals (SDN) list. Understand KYC/AML screening checks.",
    keywords: ["OFAC Search", "Sanctions List", "AML", "KYC Check", "SDN List", "Fintech Utils"],
};

export default function Page() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Sanctions List Checker</h1>
                <p className="text-lg text-muted-foreground">
                    Simulate an AML (Anti-Money Laundering) screening check against the OFAC SDN list.
                </p>
            </div>
            <SanctionsSearch />
        </div>
    );
}
