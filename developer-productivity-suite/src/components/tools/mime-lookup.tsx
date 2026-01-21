"use client";

import { useState } from "react";
import { Search, Copy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const mimes = [
    { ext: ".aac", mime: "audio/aac", desc: "AAC audio" },
    { ext: ".abw", mime: "application/x-abiword", desc: "AbiWord document" },
    { ext: ".arc", mime: "application/x-freearc", desc: "Archive document (multiple files)" },
    { ext: ".avif", mime: "image/avif", desc: "AVIF image" },
    { ext: ".avi", mime: "video/x-msvideo", desc: "AVI: Audio Video Interleave" },
    { ext: ".azw", mime: "application/vnd.amazon.ebook", desc: "Amazon Kindle eBook format" },
    { ext: ".bin", mime: "application/octet-stream", desc: "Any kind of binary data" },
    { ext: ".bmp", mime: "image/bmp", desc: "Windows OS/2 Bitmap Graphics" },
    { ext: ".bz", mime: "application/x-bzip", desc: "BZip archive" },
    { ext: ".bz2", mime: "application/x-bzip2", desc: "BZip2 archive" },
    { ext: ".csh", mime: "application/x-csh", desc: "C-Shell script" },
    { ext: ".css", mime: "text/css", desc: "Cascading Style Sheets (CSS)" },
    { ext: ".csv", mime: "text/csv", desc: "Comma-separated values (CSV)" },
    { ext: ".doc", mime: "application/msword", desc: "Microsoft Word" },
    { ext: ".docx", mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", desc: "Microsoft Word (OpenXML)" },
    { ext: ".eot", mime: "application/vnd.ms-fontobject", desc: "MS Embedded OpenType fonts" },
    { ext: ".epub", mime: "application/epub+zip", desc: "Electronic publication (EPUB)" },
    { ext: ".gz", mime: "application/gzip", desc: "GZip Compressed Archive" },
    { ext: ".gif", mime: "image/gif", desc: "Graphics Interchange Format (GIF)" },
    { ext: ".htm .html", mime: "text/html", desc: "HyperText Markup Language (HTML)" },
    { ext: ".ico", mime: "image/vnd.microsoft.icon", desc: "Icon format" },
    { ext: ".ics", mime: "text/calendar", desc: "iCalendar format" },
    { ext: ".jar", mime: "application/java-archive", desc: "Java Archive (JAR)" },
    { ext: ".jpeg .jpg", mime: "image/jpeg", desc: "JPEG images" },
    { ext: ".js", mime: "text/javascript", desc: "JavaScript" },
    { ext: ".json", mime: "application/json", desc: "JSON format" },
    { ext: ".jsonld", mime: "application/ld+json", desc: "JSON-LD format" },
    { ext: ".mid .midi", mime: "audio/midi", desc: "Musical Instrument Digital Interface (MIDI)" },
    { ext: ".mjs", mime: "text/javascript", desc: "JavaScript module" },
    { ext: ".mp3", mime: "audio/mpeg", desc: "MP3 audio" },
    { ext: ".mp4", mime: "video/mp4", desc: "MP4 video" },
    { ext: ".mpeg", mime: "video/mpeg", desc: "MPEG Video" },
    { ext: ".mpkg", mime: "application/vnd.apple.installer+xml", desc: "Apple Installer Package" },
    { ext: ".odp", mime: "application/vnd.oasis.opendocument.presentation", desc: "OpenDocument presentation document" },
    { ext: ".ods", mime: "application/vnd.oasis.opendocument.spreadsheet", desc: "OpenDocument spreadsheet document" },
    { ext: ".odt", mime: "application/vnd.oasis.opendocument.text", desc: "OpenDocument text document" },
    { ext: ".oga", mime: "audio/ogg", desc: "OGG audio" },
    { ext: ".ogv", mime: "video/ogg", desc: "OGG video" },
    { ext: ".ogx", mime: "application/ogg", desc: "OGG" },
    { ext: ".opus", mime: "audio/opus", desc: "Opus audio" },
    { ext: ".otf", mime: "font/otf", desc: "OpenType font" },
    { ext: ".png", mime: "image/png", desc: "Portable Network Graphics" },
    { ext: ".pdf", mime: "application/pdf", desc: "Adobe Portable Document Format (PDF)" },
    { ext: ".php", mime: "application/x-httpd-php", desc: "Hypertext Preprocessor (Personal Home Page)" },
    { ext: ".ppt", mime: "application/vnd.ms-powerpoint", desc: "Microsoft PowerPoint" },
    { ext: ".pptx", mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation", desc: "Microsoft PowerPoint (OpenXML)" },
    { ext: ".rar", mime: "application/vnd.rar", desc: "RAR archive" },
    { ext: ".rtf", mime: "application/rtf", desc: "Rich Text Format (RTF)" },
    { ext: ".sh", mime: "application/x-sh", desc: "Bourne shell script" },
    { ext: ".svg", mime: "image/svg+xml", desc: "Scalable Vector Graphics (SVG)" },
    { ext: ".tar", mime: "application/x-tar", desc: "Tape Archive (TAR)" },
    { ext: ".tif .tiff", mime: "image/tiff", desc: "Tagged Image File Format (TIFF)" },
    { ext: ".ts", mime: "video/mp2t", desc: "MPEG transport stream" },
    { ext: ".ttf", mime: "font/ttf", desc: "TrueType Font" },
    { ext: ".txt", mime: "text/plain", desc: "Text, (generally ASCII or ISO 8859-n)" },
    { ext: ".vsd", mime: "application/vnd.visio", desc: "Microsoft Visio" },
    { ext: ".wav", mime: "audio/wav", desc: "Waveform Audio Format" },
    { ext: ".weba", mime: "audio/webm", desc: "WEBM audio" },
    { ext: ".webm", mime: "video/webm", desc: "WEBM video" },
    { ext: ".webp", mime: "image/webp", desc: "WEBP image" },
    { ext: ".woff", mime: "font/woff", desc: "Web Open Font Format (WOFF)" },
    { ext: ".woff2", mime: "font/woff2", desc: "Web Open Font Format (WOFF)" },
    { ext: ".xhtml", mime: "application/xhtml+xml", desc: "XHTML" },
    { ext: ".xls", mime: "application/vnd.ms-excel", desc: "Microsoft Excel" },
    { ext: ".xlsx", mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", desc: "Microsoft Excel (OpenXML)" },
    { ext: ".xml", mime: "application/xml", desc: "XML" },
    { ext: ".xul", mime: "application/vnd.mozilla.xul+xml", desc: "XUL" },
    { ext: ".zip", mime: "application/zip", desc: "ZIP archive" },
    { ext: ".3gp", mime: "video/3gpp", desc: "3GPP audio/video container" },
    { ext: ".3g2", mime: "video/3gpp2", desc: "3GPP2 audio/video container" },
    { ext: ".7z", mime: "application/x-7z-compressed", desc: "7-zip archive" },
];

export function MimeLookup() {
    const [search, setSearch] = useState("");

    const filtered = mimes.filter(m =>
        m.ext.includes(search.toLowerCase()) ||
        m.mime.includes(search.toLowerCase()) ||
        m.desc.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Card className="h-full flex flex-col">
            <CardContent className="pt-6">
                <div className="relative mb-6">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                    <Input
                        type="search"
                        placeholder="Search extension or mime type (e.g. 'json', 'image')..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="rounded-md border">
                    <div className="grid grid-cols-[100px,1fr,1fr] p-3 font-semibold bg-slate-50 dark:bg-slate-900 border-b">
                        <div>Ext</div>
                        <div>MIME Type</div>
                        <div>Description</div>
                    </div>
                    <ScrollArea className="h-[500px]">
                        {filtered.map((item, i) => (
                            <div key={i} className="grid grid-cols-[100px,1fr,1fr] p-3 border-b last:border-0 hover:bg-slate-50 dark:hover:bg-slate-900/50 items-center">
                                <div className="font-mono text-sm font-semibold text-slate-900 dark:text-slate-100">{item.ext}</div>
                                <div className="flex items-center space-x-2 overflow-hidden">
                                    <span className="font-mono text-xs text-blue-600 dark:text-blue-400 truncate" title={item.mime}>
                                        {item.mime}
                                    </span>
                                    <Button
                                        size="icon" variant="ghost" className="h-6 w-6 opacity-0 hover:opacity-100 group-hover:opacity-100"
                                        onClick={() => navigator.clipboard.writeText(item.mime)}
                                    >
                                        <Copy className="h-3 w-3" />
                                    </Button>
                                </div>
                                <div className="text-sm text-slate-500 dark:text-slate-400 truncate" title={item.desc}>
                                    {item.desc}
                                </div>
                            </div>
                        ))}
                        {filtered.length === 0 && (
                            <div className="p-8 text-center text-slate-500">
                                No MIME types found.
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </CardContent>
        </Card>
    );
}
