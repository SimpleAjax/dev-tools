import { ToolShell } from "@/components/tool-shell";
import { WireGuardKeyGenerator } from "@/components/tools/wireguard-keys";
import { tools } from "@/lib/tool-metadata";
import { Network } from "lucide-react";

export const metadata = {
    title: "WireGuard Key Generator | Security Suite",
    description: "Generate secure Curve25519 public/private key pairs and preshared keys for WireGuard VPNs.",
};

export default function WireGuardKeysPage() {
    const tool = tools.find((t) => t.slug === "wireguard-keys");

    return (
        <ToolShell
            toolName={tool?.name || "WireGuard Key Generator"}
            description={tool?.description || "Generate VPN keys client-side."}
            icon={<Network className="h-8 w-8" />}
        >
            <WireGuardKeyGenerator />
        </ToolShell>
    );
}
