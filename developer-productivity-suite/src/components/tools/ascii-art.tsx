"use client";

import { useState, useEffect } from "react";
import figlet from "figlet";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const FONT_NAMES = [
    "3-D", "3x5", "5 Line Oblique", "Acrobatic", "Alligator", "Alligator2", "Alpha", "Alphabet", "Arrows", "Avatar",
    "B1FF", "Banner", "Banner3-D", "Banner3", "Banner4", "Barbwire", "Basic", "Bear", "Bell", "Benjamin", "Big",
    "Big Chief", "Bigfig", "Binary", "Block", "Blocks", "Bolgar", "Braced", "Bright", "Broadway", "Bubble", "Bulbhead",
    "Caligraphy", "Catwalk", "Chunky", "Coinstak", "Cola", "Colossal", "Computer", "Contessa", "Contrast", "Cosmike",
    "Crawford", "Crazy", "Cricket", "Cursive", "Cyberlarge", "Cybersmall", "Cygnet", "Dancin", "David", "Decimal",
    "Def Leppard", "Diamond", "Diet Cola", "Digital", "Doh", "Doom", "Dot Matrix", "Double", "Double Shorts", "Dr Pepper",
    "Efti Face", "Efti Font", "Efti Italic", "Efti Piti", "Efti Robot", "Efti Wall", "Efti Water", "Electronic", "Elite",
    "Epic", "Fender", "FourTops", "Fuzzy", "Georgi16", "Ghost", "Gothic", "Graffiti", "Greek", "Heart Left", "Heart Right",
    "Henry 3D", "Hollywood", "Hooray", "Invita", "Isometric1", "Isometric2", "Isometric3", "Isometric4", "Italic",
    "Ivory", "Jacky", "Jazmine", "Jerusalem", "Katakana", "Kban", "Keyboard", "Knob", "Larry 3D", "LCD", "Lean", "Letters",
    "Linux", "Lockergnome", "Madrid", "Marquee", "Maxfour", "Mike", "Mini", "Mirror", "Mnemonic", "Morse", "Moscow",
    "Nancyj", "Nancyj-Underlined", "Nipples", "NT Greek", "O8", "Ogre", "Pawp", "Peaks", "Pebbles", "Pepper", "Poison",
    "Puffy", "Puzzle", "Pyramid", "Rammstein", "Rectangles", "Red Phoenix", "Relief", "Relief2", "Reverse", "Roman",
    "Rot13", "Rotated", "Rounded", "Rowan Cap", "Rozzo", "Runyc", "S Blood", "SL Script", "Santa Clara", "Script",
    "Serifcap", "Shadow", "Shimrod", "Short", "Slant", "Slide", "Small", "Small Caps", "Small Isometric1", "Small Keyboard",
    "Small Poison", "Small Script", "Small Shadow", "Small Slant", "Small Tengwar", "Soft", "Speed", "Spliff", "Stacy",
    "Stampate", "Standard", "Star Wars", "Stellar", "Stforek", "Stop", "Straight", "Sub-Zero", "Swamp Land", "Swan",
    "Sweet", "Tanne", "Tengwar", "Term", "Test1", "Thick", "Thin", "Thorned", "Three Point", "Ticks", "Ticks Slant",
    "Tiles", "Tinker-Toy", "Tombstone", "Train", "Trek", "Tsalagi", "Tubular", "Twisted", "Two Point", "USA Flag",
    "Univers", "Velvet", "Vignette", "Wavy", "Weird", "Wet Letter", "Whimsy", "Wow"
];

export function AsciiArtGenerator() {
    const [text, setText] = useState("DevTools");
    const [font, setFont] = useState("Standard");
    const [color, setColor] = useState("#4ade80"); // green-400
    const [output, setOutput] = useState("");

    useEffect(() => {
        // Configure figlet to look for fonts in standard /fonts directory
        // Note: in Next.js public folder maps to root /
        figlet.defaults({ fontPath: "/fonts" });
    }, []);

    useEffect(() => {
        figlet.text(text, {
            font: font as any,
        }, (err, res) => {
            if (err) {
                setOutput("Error: " + err);
            } else {
                setOutput(res || "");
            }
        });
    }, [text, font]);

    return (
        <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
            <div className="flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px] space-y-2">
                    <Label>Text</Label>
                    <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type here..." />
                </div>
                <div className="w-[200px] space-y-2">
                    <Label>Font ({FONT_NAMES.length})</Label>
                    <Select value={font} onValueChange={setFont}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {FONT_NAMES.sort().map(f => (
                                <SelectItem key={f} value={f}>{f}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-[100px] space-y-2">
                    <Label>Color</Label>
                    <div className="flex gap-2">
                        <Input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="p-1 h-10 w-full cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            <Card className="flex-1 min-h-0 flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between py-2">
                    <CardTitle>Output</CardTitle>
                    <Button size="sm" variant="ghost" onClick={() => navigator.clipboard.writeText(output)}>Copy</Button>
                </CardHeader>
                <CardContent
                    className="flex-1 min-h-0 bg-slate-950 p-4 rounded-b-lg overflow-auto"
                    style={{ color: color }}
                >
                    <pre className="font-mono text-xs md:text-sm leading-none whitespace-pre select-all">
                        {output}
                    </pre>
                </CardContent>
            </Card>
        </div>
    );
}
