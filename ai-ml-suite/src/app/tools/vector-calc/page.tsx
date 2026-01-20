import { VectorCalc } from "@/components/tools/vector-calc";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Vector DB Sizing Calculator | AI Stack",
    description: "Estimate storage requirements for Pinecone, Weaviate, Milvus based on dimensions and count.",
};

export default function VectorCalcPage() {
    return (
        <div className="container mx-auto max-w-6xl h-full flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Vector Database Sizing</h1>
                <p className="text-muted-foreground mt-2">
                    Calculate the memory and storage footprint of your vector embeddings and metadata.
                </p>
            </div>

            <VectorCalc />
        </div>
    );
}
