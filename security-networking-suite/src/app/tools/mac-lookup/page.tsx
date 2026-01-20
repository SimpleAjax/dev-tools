import { ToolShell } from "@/components/tool-shell";
import { MacLookup } from "@/components/tools/mac-lookup";
import { tools } from "@/lib/tool-metadata";
import { Network } from "lucide-react";

export const metadata = {
    title: "MAC Address Vendor Lookup | Security Suite",
    description: "Identify hardware manufacturers from MAC address OUI prefixes.",
};

export default function MacLookupPage() {
    const tool = tools.find((t) => t.slug === "mac-lookup");

    return (
        <ToolShell
            toolName={tool?.name || "MAC Vendor Lookup"}
            description={tool?.description || "Find MAC address manufacturers."}
            icon={<Network className="h-8 w-8" />}
        >
            <MacLookup />
        </ToolShell>
    );
}
