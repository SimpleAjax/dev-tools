import { AsciiArtGenerator } from "@/components/tools/ascii-art";

export const metadata = {
    title: "ASCII Art Generator | DevTools",
    description: "Convert text into ASCII art banners using standard FIGlet fonts.",
};

export default function AsciiArtPage() {
    return <AsciiArtGenerator />;
}
