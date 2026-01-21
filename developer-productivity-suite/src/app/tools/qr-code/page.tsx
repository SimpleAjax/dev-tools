import { QrCodeGenerator } from "@/components/tools/qr-code";

export const metadata = {
    title: "QR Code Generator | DevTools",
    description: "Generate QR codes from text or URLs instantly.",
};

export default function QrCodePage() {
    return <QrCodeGenerator />;
}
