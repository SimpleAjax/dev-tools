import { ToolShell } from "@/components/tool-shell";
import { HtaccessGenerator } from "@/components/tools/htaccess-generator";
import { tools } from "@/lib/tool-metadata";
import { FileJson } from "lucide-react";

export const metadata = {
    title: ".htaccess Generator | Security Suite",
    description: "Generate Apache .htaccess files for redirects, HTTPS enforcement, and security.",
};

export default function HtaccessGeneratorPage() {
    const tool = tools.find((t) => t.slug === "htaccess-generator");

    return (
        <ToolShell
            toolName={tool?.name || ".htaccess Generator"}
            description={tool?.description || "Apache configuration builder."}
            icon={<FileJson className="h-8 w-8" />}
        >
            <HtaccessGenerator />
        </ToolShell>
    );
}
