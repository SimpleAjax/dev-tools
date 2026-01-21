"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const httpStatuses = [
    { code: 100, title: "Continue", desc: "The client should continue the request or ignore the response if the request is already finished.", cat: "1xx" },
    { code: 101, title: "Switching Protocols", desc: "The server is switching protocols as requested by the client (e.g., to WebSockets).", cat: "1xx" },

    { code: 200, title: "OK", desc: "The request succeeded.", cat: "2xx" },
    { code: 201, title: "Created", desc: "The request succeeded, and a new resource was created as a result.", cat: "2xx" },
    { code: 202, title: "Accepted", desc: "The request has been received but not yet acted upon.", cat: "2xx" },
    { code: 204, title: "No Content", desc: "There is no content to send for this request, but the headers may be useful.", cat: "2xx" },

    { code: 301, title: "Moved Permanently", desc: "The URL of the requested resource has been changed permanently.", cat: "3xx" },
    { code: 302, title: "Found", desc: "The URI of requested resource has been changed temporarily.", cat: "3xx" },
    { code: 304, title: "Not Modified", desc: "Used for caching purposes. The client can use the cached version.", cat: "3xx" },
    { code: 307, title: "Temporary Redirect", desc: "Client should get the requested resource at another URI with same method.", cat: "3xx" },
    { code: 308, title: "Permanent Redirect", desc: "Client should get the requested resource at another URI with same method.", cat: "3xx" },

    { code: 400, title: "Bad Request", desc: "The server cannot or will not process the request due to an apparent client error.", cat: "4xx" },
    { code: 401, title: "Unauthorized", desc: "Authentication is required and has failed or has not been yet provided.", cat: "4xx" },
    { code: 403, title: "Forbidden", desc: "The request was valid, but the server is refusing action.", cat: "4xx" },
    { code: 404, title: "Not Found", desc: "The requested resource could not be found but may be available in the future.", cat: "4xx" },
    { code: 405, title: "Method Not Allowed", desc: "A request method is not supported for the requested resource.", cat: "4xx" },
    { code: 408, title: "Request Timeout", desc: "The server timed out waiting for the request.", cat: "4xx" },
    { code: 409, title: "Conflict", desc: "Indicates that the request could not be processed because of conflict in the current state of the resource.", cat: "4xx" },
    { code: 410, title: "Gone", desc: "Indicates that the resource requested is no longer available and will not be available again.", cat: "4xx" },
    { code: 418, title: "I'm a teapot", desc: "The server refuses the attempt to brew coffee with a teapot.", cat: "4xx" },
    { code: 429, title: "Too Many Requests", desc: "The user has sent too many requests in a given amount of time.", cat: "4xx" },

    { code: 500, title: "Internal Server Error", desc: "A generic error message, given when an unexpected condition was encountered.", cat: "5xx" },
    { code: 501, title: "Not Implemented", desc: "The server either does not recognize the request method, or it lacks the ability to fulfil the request.", cat: "5xx" },
    { code: 502, title: "Bad Gateway", desc: "The server was acting as a gateway or proxy and received an invalid response from the upstream server.", cat: "5xx" },
    { code: 503, title: "Service Unavailable", desc: "The server is currently unavailable (overloaded or down for maintenance).", cat: "5xx" },
    { code: 504, title: "Gateway Timeout", desc: "The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.", cat: "5xx" },
];

export function HttpStatusGuide() {
    const [search, setSearch] = useState("");

    const filtered = httpStatuses.filter(s =>
        s.code.toString().includes(search) ||
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.desc.toLowerCase().includes(search.toLowerCase())
    );

    const getVariant = (cat: string) => {
        if (cat === "1xx") return "secondary"; // Info
        if (cat === "2xx") return "default"; // Success (green-ish usually, but default is dark)
        if (cat === "3xx") return "secondary"; // Redirect
        if (cat === "4xx") return "destructive"; // Client Err
        if (cat === "5xx") return "destructive"; // Server Err
        return "outline";
    };

    const getColorClass = (cat: string) => {
        if (cat === "2xx") return "text-green-600 dark:text-green-400";
        if (cat === "3xx") return "text-blue-600 dark:text-blue-400";
        if (cat === "4xx") return "text-amber-600 dark:text-amber-400";
        if (cat === "5xx") return "text-red-600 dark:text-red-400";
        return "text-slate-600 dark:text-slate-400";
    }

    return (
        <div className="space-y-6">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                    type="search"
                    placeholder="Search by code or description..."
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map(s => (
                    <Card key={s.code} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className={`text-2xl font-mono ${getColorClass(s.cat)}`}>
                                    {s.code}
                                </CardTitle>
                                <Badge variant={getVariant(s.cat) as any}>{s.cat}</Badge>
                            </div>
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100">{s.title}</h3>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                {s.desc}
                            </p>
                        </CardContent>
                    </Card>
                ))}
                {filtered.length === 0 && (
                    <div className="col-span-full text-center py-10 text-slate-500">
                        No status codes found matching "{search}".
                    </div>
                )}
            </div>
        </div>
    );
}
