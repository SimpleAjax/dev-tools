"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ColorBlindnessSim() {
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setImageSrc(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-6">
            {/* SVG Filters Definition (Hidden) */}
            <svg className="hidden">
                <defs>
                    <filter id="protanopia">
                        <feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0 0.558, 0.442, 0, 0, 0 0, 0.242, 0.758, 0, 0 0, 0, 0, 1, 0" />
                    </filter>
                    <filter id="deuteranopia">
                        <feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0 0.7, 0.3, 0, 0, 0 0, 0.3, 0.7, 0, 0 0, 0, 0, 1, 0" />
                    </filter>
                    <filter id="tritanopia">
                        <feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0 0, 0.433, 0.567, 0, 0 0, 0.475, 0.525, 0, 0 0, 0, 0, 1, 0" />
                    </filter>
                    <filter id="achromatopsia">
                        <feColorMatrix type="matrix" values="0.299, 0.587, 0.114, 0, 0 0.299, 0.587, 0.114, 0, 0 0.299, 0.587, 0.114, 0, 0 0, 0, 0, 1, 0" />
                    </filter>
                </defs>
            </svg>

            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg bg-slate-50 dark:bg-slate-900/50">
                        <Label htmlFor="image-upload" className="mb-2 text-lg font-semibold text-slate-700 dark:text-slate-300">
                            Upload an Image
                        </Label>
                        <Input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="max-w-xs"
                            onChange={handleFileUpload}
                        />
                        <p className="mt-2 text-sm text-slate-500">
                            Supported: PNG, JPG, WEBP, GIF
                        </p>
                    </div>
                </CardContent>
            </Card>

            {imageSrc && (
                <Tabs defaultValue="original" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto">
                        <TabsTrigger value="original">Original</TabsTrigger>
                        <TabsTrigger value="protanopia">Protanopia (Red-Blind)</TabsTrigger>
                        <TabsTrigger value="deuteranopia">Deuteranopia (Green-Blind)</TabsTrigger>
                        <TabsTrigger value="tritanopia">Tritanopia (Blue-Blind)</TabsTrigger>
                        <TabsTrigger value="achromatopsia">Achromatopsia (Mono)</TabsTrigger>
                    </TabsList>

                    <div className="mt-6 flex justify-center bg-slate-100 dark:bg-slate-950 p-4 rounded-lg overflow-hidden">
                        <TabsContent value="original" className="mt-0">
                            <img src={imageSrc} alt="Original" className="max-h-[600px] object-contain" />
                        </TabsContent>
                        <TabsContent value="protanopia" className="mt-0">
                            <img src={imageSrc} alt="Protanopia" className="max-h-[600px] object-contain" style={{ filter: 'url(#protanopia)' }} />
                        </TabsContent>
                        <TabsContent value="deuteranopia" className="mt-0">
                            <img src={imageSrc} alt="Deuteranopia" className="max-h-[600px] object-contain" style={{ filter: 'url(#deuteranopia)' }} />
                        </TabsContent>
                        <TabsContent value="tritanopia" className="mt-0">
                            <img src={imageSrc} alt="Tritanopia" className="max-h-[600px] object-contain" style={{ filter: 'url(#tritanopia)' }} />
                        </TabsContent>
                        <TabsContent value="achromatopsia" className="mt-0">
                            <img src={imageSrc} alt="Achromatopsia" className="max-h-[600px] object-contain" style={{ filter: 'url(#achromatopsia)' }} />
                        </TabsContent>
                    </div>
                </Tabs>
            )}
        </div>
    );
}
