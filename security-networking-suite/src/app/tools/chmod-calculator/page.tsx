import { ToolShell } from "@/components/tool-shell";
import { ChmodCalculator } from "@/components/tools/chmod-calculator";
import { tools } from "@/lib/tool-metadata";
import { Terminal } from "lucide-react";

export const metadata = {
    title: "Chmod Calculator | Security Suite",
    description: "Interactive visual chmod calculator. Convert Linux file permissions between octal (755) and symbolic (rwxr-xr-x) formats.",
};

export default function ChmodCalculatorPage() {
    const tool = tools.find((t) => t.slug === "chmod-calculator");

    return (
        <ToolShell
            toolName={tool?.name || "Chmod Calculator"}
            description={tool?.description || "Visual permission calculator."}
            icon={<Terminal className="h-8 w-8" />}
        >
            <ChmodCalculator />
        </ToolShell>
    );
}
