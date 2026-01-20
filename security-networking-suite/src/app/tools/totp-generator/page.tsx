import { ToolShell } from "@/components/tool-shell";
import { TotpGenerator } from "@/components/tools/totp-generator";
import { tools } from "@/lib/tool-metadata";
import { Lock } from "lucide-react";

export const metadata = {
    title: "TOTP / 2FA Debugger | Security Suite",
    description: "Debug Time-based One-Time Passwords (TOTP). Generate 2FA codes and QR codes from secrets.",
};

export default function TotpGeneratorPage() {
    const tool = tools.find((t) => t.slug === "totp-generator");

    return (
        <ToolShell
            toolName={tool?.name || "TOTP Debugger"}
            description={tool?.description || "Validate 2FA implementations."}
            icon={<Lock className="h-8 w-8" />}
        >
            <TotpGenerator />
        </ToolShell>
    );
}
