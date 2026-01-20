import { ToolShell } from "@/components/tool-shell";
import { RobotsTxtGenerator } from "@/components/tools/robots-txt";
import { tools } from "@/lib/tool-metadata";
import { FileJson } from "lucide-react";

export const metadata = {
    title: "Robots.txt Generator | Security Suite",
    description: "Create standard robots.txt files to control search engine crawlers and bots.",
};

export default function RobotsTxtGeneratorPage() {
    const tool = tools.find((t) => t.slug === "robots-txt");

    return (
        <ToolShell
            toolName={tool?.name || "Robots.txt Gen"}
            description={tool?.description || "Control crawler access."}
            icon={<FileJson className="h-8 w-8" />}
        >
            <RobotsTxtGenerator />
        </ToolShell>
    );
}
