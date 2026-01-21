import { Minifier } from "@/components/tools/minifier";

export const metadata = {
    title: "Code Minifier | DevTools",
    description: "Minify JavaScript, CSS, and JSON to reduce file size.",
};

export default function MinifierPage() {
    return <Minifier />;
}
