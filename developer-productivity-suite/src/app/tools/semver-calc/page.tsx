import { SemVerCalc } from "@/components/tools/semver-calc";

export const metadata = {
    title: "Semantic Versioning Calculator | DevTools",
    description: "Calculate next versions based on SemVer rules (Major, Minor, Patch, Pre-release).",
};

export default function SemVerCalcPage() {
    return <SemVerCalc />;
}
