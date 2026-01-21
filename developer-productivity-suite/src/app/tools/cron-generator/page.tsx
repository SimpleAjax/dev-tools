import { CronGenerator } from "@/components/tools/cron-generator";

export const metadata = {
    title: "Cron Expression Generator | DevTools",
    description: "Generate and explain cron schedules with an interactive UI.",
};

export default function CronGeneratorPage() {
    return <CronGenerator />;
}
