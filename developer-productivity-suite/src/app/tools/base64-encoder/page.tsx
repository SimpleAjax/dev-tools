import { Base64Encoder } from "@/components/tools/base64-encoder";

export const metadata = {
    title: "Base64 Image Encoder | DevTools",
    description: "Convert images to Base64 strings for embedding in HTML or CSS.",
};

export default function Base64EncoderPage() {
    return <Base64Encoder />;
}
