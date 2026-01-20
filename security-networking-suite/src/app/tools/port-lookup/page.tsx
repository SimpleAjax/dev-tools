import { ToolShell } from "@/components/tool-shell";
import { PortLookup } from "@/components/tools/port-lookup";
import { tools } from "@/lib/tool-metadata";
import { Radio } from "lucide-react";

export const metadata = {
    title: "Port Number Lookup | Security Suite",
    description: "Search commonly used ports (TCP/UDP) and their associated services.",
};

export default function PortLookupPage() {
    const tool = tools.find((t) => t.slug === "port-lookup");

    return (
        <ToolShell
            toolName={tool?.name || "Port Number Lookup"}
            description={tool?.description || "Identify common network ports."}
            icon={<Radio className="h-8 w-8" />}
        >
            <PortLookup />
        </ToolShell>
    );
}
