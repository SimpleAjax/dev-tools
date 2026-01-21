import { UrlParser } from "@/components/tools/url-parser";

export const metadata = {
    title: "URL Parser & Encoder | DevTools",
    description: "Parse URLs into components (Protocol, Host, Path, Query) and decode/encode them.",
};

export default function UrlParserPage() {
    return <UrlParser />;
}
