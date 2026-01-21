import { FaviconGenerator } from "@/components/tools/favicon-generator";

export const metadata = {
    title: "Favicon Generator | DevTools",
    description: "Generate standard .ico and .png favicons from any image.",
};

export default function FaviconGeneratorPage() {
    return <FaviconGenerator />;
}
