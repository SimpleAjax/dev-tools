"use client";

import { ToolShell } from "@/components/tool-shell";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wifi, MapPin, Globe, Server, RefreshCw } from "lucide-react";

interface IpData {
    ip: string;
    city: string;
    region: string;
    country_name: string;
    org: string;
    timezone: string;
    latitude: number;
    longitude: number;
}

export default function PublicIP() {
    const [data, setData] = useState<IpData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchIp = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("https://ipapi.co/json/");
            if (!res.ok) throw new Error("Failed to fetch IP data");
            const json = await res.json();
            if (json.error) throw new Error(json.reason);
            setData(json);
        } catch (e) {
            setError("Could not retrieve public IP information. Ad blockers may be interfering.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIp();
    }, []);

    return (
        <ToolShell toolName="Public IP Checker" description="View your current public IP address, location, and ISP details." icon={<Wifi className="h-6 w-6" />}>
            <div className="max-w-2xl mx-auto space-y-6">
                <Card className="p-8 flex flex-col items-center justify-center text-center space-y-6 min-h-[300px]">
                    {loading ? (
                        <div className="flex flex-col items-center gap-4 animate-pulse">
                            <div className="h-4 w-32 bg-muted rounded"></div>
                            <div className="h-12 w-64 bg-muted rounded"></div>
                            <div className="h-4 w-48 bg-muted rounded"></div>
                        </div>
                    ) : error ? (
                        <div className="text-red-500 space-y-4">
                            <p>{error}</p>
                            <Button onClick={fetchIp} variant="outline">Try Again</Button>
                        </div>
                    ) : data ? (
                        <>
                            <div className="space-y-2">
                                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Your IP Address</span>
                                <h1 className="text-5xl font-mono font-bold tracking-tight text-blue-600 dark:text-blue-400">
                                    {data.ip}
                                </h1>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-8">
                                <div className="p-4 bg-muted/50 rounded-xl flex items-start gap-3 text-left">
                                    <MapPin className="h-5 w-5 text-red-500 mt-0.5" />
                                    <div>
                                        <div className="font-semibold">Location</div>
                                        <div className="text-sm text-muted-foreground">{data.city}, {data.region}</div>
                                        <div className="text-sm text-muted-foreground">{data.country_name}</div>
                                    </div>
                                </div>
                                <div className="p-4 bg-muted/50 rounded-xl flex items-start gap-3 text-left">
                                    <Server className="h-5 w-5 text-indigo-500 mt-0.5" />
                                    <div>
                                        <div className="font-semibold">ISP / Org</div>
                                        <div className="text-sm text-muted-foreground">{data.org}</div>
                                    </div>
                                </div>
                                <div className="p-4 bg-muted/50 rounded-xl flex items-start gap-3 text-left">
                                    <Globe className="h-5 w-5 text-green-500 mt-0.5" />
                                    <div>
                                        <div className="font-semibold">Coordinates</div>
                                        <div className="text-sm text-muted-foreground">{data.latitude}, {data.longitude}</div>
                                    </div>
                                </div>
                                <div className="p-4 bg-muted/50 rounded-xl flex flex-col justify-center text-center">
                                    <Button variant="outline" size="sm" onClick={fetchIp} className="w-full">
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Refresh
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : null}
                </Card>
            </div>
        </ToolShell>
    );
}
