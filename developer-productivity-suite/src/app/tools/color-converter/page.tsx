import { ColorConverter } from "@/components/tools/color-converter";

export const metadata = {
    title: "Color Converter | DevTools",
    description: "Convert colors between HEX, RGB, HSL, and CMYK formats.",
};

export default function ColorConverterPage() {
    return <ColorConverter />;
}
