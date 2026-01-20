import { ToolShell } from "@/components/tool-shell";
import { RandomSecretsGenerator } from "@/components/tools/random-secrets";
import { tools } from "@/lib/tool-metadata";
import { Key } from "lucide-react";

export const metadata = {
    title: "Random Secret Key Generator | Security Suite",
    description: "Generate high-entropy random strings for API keys, passwords, and secret tokens.",
};

export default function RandomSecretsPage() {
    const tool = tools.find((t) => t.slug === "random-secrets");

    return (
        <ToolShell
            toolName={tool?.name || "Secret Key Generator"}
            description={tool?.description || "Generate secure random strings."}
            icon={<Key className="h-8 w-8" />}
        >
            <RandomSecretsGenerator />
        </ToolShell>
    );
}
