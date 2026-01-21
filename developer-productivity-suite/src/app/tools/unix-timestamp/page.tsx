import { UnixTimestamp } from "@/components/tools/unix-timestamp";

export const metadata = {
    title: "Unix Timestamp Converter | DevTools",
    description: "Convert Unix timestamps (Epoch) to human-readable dates and vice versa.",
};

export default function UnixTimestampPage() {
    return <UnixTimestamp />;
}
