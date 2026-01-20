import { ToolShell } from "@/components/tool-shell";
import { CidrCalculator } from "@/components/tools/cidr-calculator";
import { tools } from "@/lib/tool-metadata";
import { Globe } from "lucide-react";

export const metadata = {
    title: "CIDR Calculator | Security Suite",
    description: "Calculate IP ranges, first/last IP, and host counts from CIDR blocks.",
};

export default function CidrCalculatorPage() {
    const tool = tools.find((t) => t.slug === "cidr-calculator");

    return (
        <ToolShell
            toolName={tool?.name || "CIDR Calculator"}
            description={tool?.description || "Network address range calculator."}
            icon={<Globe className="h-8 w-8" />}
        >
            <CidrCalculator />
        </ToolShell>
    );
}
