import { StringEscaper } from "@/components/tools/string-escaper";

export const metadata = {
    title: "String Escaper / Unescaper | DevTools",
    description: "Escape or unescape strings for use in JSON, Java, JavaScript, SQL, HTML, etc.",
};

export default function StringEscaperPage() {
    return <StringEscaper />;
}
