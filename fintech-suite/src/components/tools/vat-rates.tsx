"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock Data
const TAX_RATES = [
    { country: "United Kingdom", code: "GB", standard: 20, reduced: "5, 0", name: "VAT" },
    { country: "Germany", code: "DE", standard: 19, reduced: "7", name: "VAT (MwSt)" },
    { country: "France", code: "FR", standard: 20, reduced: "10, 5.5, 2.1", name: "VAT (TVA)" },
    { country: "Italy", code: "IT", standard: 22, reduced: "10, 5, 4", name: "VAT (IVA)" },
    { country: "Spain", code: "ES", standard: 21, reduced: "10, 4", name: "VAT (IVA)" },
    { country: "Netherlands", code: "NL", standard: 21, reduced: "9", name: "VAT (BTW)" },
    { country: "Sweden", code: "SE", standard: 25, reduced: "12, 6", name: "VAT (Moms)" },
    { country: "Denmark", code: "DK", standard: 25, reduced: "0 (Newspapers)", name: "VAT (Moms)" },
    { country: "Ireland", code: "IE", standard: 23, reduced: "13.5, 9, 4.8, 0", name: "VAT" },
    { country: "Australia", code: "AU", standard: 10, reduced: "0", name: "GST" },
    { country: "Canada", code: "CA", standard: 5, reduced: "0", name: "GST (Federal)" },
    { country: "Japan", code: "JP", standard: 10, reduced: "8", name: "Consumption Tax" },
    { country: "India", code: "IN", standard: 18, reduced: "28, 12, 5, 0", name: "GST" },
    { country: "United States", code: "US", standard: 0, reduced: "-", name: "Sales Tax (State var.)" },
    { country: "Singapore", code: "SG", standard: 9, reduced: "0", name: "GST" },
    { country: "United Arab Emirates", code: "AE", standard: 5, reduced: "0", name: "VAT" },
];

export function VatRates() {
    const [search, setSearch] = useState("");

    const filtered = TAX_RATES.filter(r =>
        r.country.toLowerCase().includes(search.toLowerCase()) ||
        r.code.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search Country or Code..."
                    className="pl-9"
                />
            </div>

            <Card className="border-slate-800 bg-slate-900/50">
                <CardHeader><CardTitle>Global Tax Rates (2025 Est)</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-800 hover:bg-transparent">
                                <TableHead>Code</TableHead>
                                <TableHead>Country</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Standard Rate</TableHead>
                                <TableHead>Reduced Rates</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((row) => (
                                <TableRow key={row.code} className="border-slate-800/50 hover:bg-slate-900">
                                    <TableCell className="font-mono text-xs text-muted-foreground">{row.code}</TableCell>
                                    <TableCell className="font-medium">{row.country}</TableCell>
                                    <TableCell className="text-muted-foreground">{row.name}</TableCell>
                                    <TableCell className="text-primary font-bold">{row.standard}%</TableCell>
                                    <TableCell className="text-muted-foreground text-sm">{row.reduced}%</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {filtered.length === 0 && <div className="p-8 text-center text-muted-foreground">No countries found.</div>}
                </CardContent>
            </Card>
        </div>
    );
}
