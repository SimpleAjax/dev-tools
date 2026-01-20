import { ToolShell } from "@/components/tool-shell";
import { SshConfigGenerator } from "@/components/tools/ssh-config-generator";
import { tools } from "@/lib/tool-metadata";
import { Terminal } from "lucide-react";

export const metadata = {
    title: "SSH Config Generator | Security Suite",
    description: "Easily generate ~/.ssh/config files. Manage SSH aliases, proxy jumps, and identity files visually.",
};

export default function SshConfigGeneratorPage() {
    const tool = tools.find((t) => t.slug === "ssh-config-generator");

    return (
        <ToolShell
            toolName={tool?.name || "SSH Config Generator"}
            description={tool?.description || "Simplify your SSH connections."}
            icon={<Terminal className="h-8 w-8" />}
        >
            <SshConfigGenerator />
        </ToolShell>
    );
}
