import { MetaTagGenerator } from "@/components/tools/meta-tags";

export const metadata = {
    title: "Meta Tag Generator | DevTools",
    description: "Generate SEO meta tags and preview typical search engine results and social cards.",
};

export default function MetaTagsPage() {
    return <MetaTagGenerator />;
}
