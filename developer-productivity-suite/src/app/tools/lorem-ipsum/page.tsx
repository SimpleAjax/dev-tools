import { LoremIpsumGenerator } from "@/components/tools/lorem-ipsum";

export const metadata = {
    title: "Lorem Ipsum & Data Generator | DevTools",
    description: "Generate dummy text, JSON data, or SQL inserts for testing.",
};

export default function LoremIpsumPage() {
    return <LoremIpsumGenerator />;
}
