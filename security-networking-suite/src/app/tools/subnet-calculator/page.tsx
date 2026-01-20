import { ToolShell } from "@/components/tool-shell";
import { SubnetSplitter } from "@/components/tools/subnet-splitter";
import { tools } from "@/lib/tool-metadata";
import { Network } from "lucide-react";

export const metadata = {
    title: "Subnet Calculator | Security Suite",
    description: "Split networks into smaller subnets visually.",
};

export default function SubnetSplitterPage() {
    const tool = tools.find((t) => t.slug === "subnet-calculator");

    return (
        <ToolShell
            toolName={tool?.name || "Subnet Splitter"}
            description={tool?.description || "Plan your network segmentation."}
            icon={<Network className="h-8 w-8" />}
        >
            <SubnetSplitter />
        </ToolShell>
    );
}
