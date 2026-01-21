"use client";

import { ToolShell } from "@/components/tool-shell";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CopyButton } from "@/components/tool-shell";
import { Cookie, Eye, Code2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CookieConsentConfig() {
    const [config, setConfig] = useState({
        position: "bottom-right",
        bgColor: "#202020",
        textColor: "#ffffff",
        btnColor: "#3b82f6",
        btnTextColor: "#ffffff",
        message: "We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.",
        linkText: "Learn more",
        linkUrl: "/privacy",
        btnText: "Got it!"
    });

    const generateCode = () => {
        return `
<!-- Cookie Consent Banner -->
<style>
.cookie-banner {
  position: fixed;
  ${config.position.includes("bottom") ? "bottom: 20px;" : "top: 20px;"}
  ${config.position.includes("right") ? "right: 20px;" : config.position.includes("left") ? "left: 20px;" : "left: 50%; transform: translateX(-50%);"}
  background: ${config.bgColor};
  color: ${config.textColor};
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  gap: 16px;
  z-index: 9999;
  max-width: 400px;
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 14px;
}
.cookie-btn {
  background: ${config.btnColor};
  color: ${config.btnTextColor};
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  white-space: nowrap;
}
.cookie-link {
  color: ${config.textColor};
  opacity: 0.8;
  text-decoration: underline;
}
</style>

<div id="cookie-banner" class="cookie-banner">
  <div>
    ${config.message} 
    <a href="${config.linkUrl}" class="cookie-link">${config.linkText}</a>
  </div>
  <button class="cookie-btn" onclick="document.getElementById('cookie-banner').style.display='none'">
    ${config.btnText}
  </button>
</div>
`.trim();
    };

    return (
        <ToolShell toolName="Cookie Consent Generator" description="Create a customizable cookie consent banner and get the code." icon={<Cookie className="h-6 w-6" />}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <Card className="p-6 space-y-4">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Eye className="h-5 w-5" />
                            Configuration
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Position</Label>
                                <Select value={config.position} onValueChange={(v) => setConfig({ ...config, position: v })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="bottom-left">Bottom Left</SelectItem>
                                        <SelectItem value="bottom-center">Bottom Center</SelectItem>
                                        <SelectItem value="bottom-right">Bottom Right</SelectItem>
                                        <SelectItem value="top-center">Top Center</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Button Text</Label>
                                <Input value={config.btnText} onChange={(e) => setConfig({ ...config, btnText: e.target.value })} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Message</Label>
                            <Textarea
                                value={config.message}
                                onChange={(e) => setConfig({ ...config, message: e.target.value })}
                                className="h-20"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Privacy Link Text</Label>
                                <Input value={config.linkText} onChange={(e) => setConfig({ ...config, linkText: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Privacy URL</Label>
                                <Input value={config.linkUrl} onChange={(e) => setConfig({ ...config, linkUrl: e.target.value })} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                            <div className="space-y-2">
                                <Label>Background Color</Label>
                                <div className="flex gap-2">
                                    <Input type="color" className="w-10 h-10 p-1" value={config.bgColor} onChange={(e) => setConfig({ ...config, bgColor: e.target.value })} />
                                    <Input value={config.bgColor} onChange={(e) => setConfig({ ...config, bgColor: e.target.value })} className="font-mono" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Text Color</Label>
                                <div className="flex gap-2">
                                    <Input type="color" className="w-10 h-10 p-1" value={config.textColor} onChange={(e) => setConfig({ ...config, textColor: e.target.value })} />
                                    <Input value={config.textColor} onChange={(e) => setConfig({ ...config, textColor: e.target.value })} className="font-mono" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Button Color</Label>
                                <div className="flex gap-2">
                                    <Input type="color" className="w-10 h-10 p-1" value={config.btnColor} onChange={(e) => setConfig({ ...config, btnColor: e.target.value })} />
                                    <Input value={config.btnColor} onChange={(e) => setConfig({ ...config, btnColor: e.target.value })} className="font-mono" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Button Text Color</Label>
                                <div className="flex gap-2">
                                    <Input type="color" className="w-10 h-10 p-1" value={config.btnTextColor} onChange={(e) => setConfig({ ...config, btnTextColor: e.target.value })} />
                                    <Input value={config.btnTextColor} onChange={(e) => setConfig({ ...config, btnTextColor: e.target.value })} className="font-mono" />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="p-6 relative min-h-[300px] flex items-center justify-center bg-slate-100 dark:bg-slate-900 overflow-hidden border-2 border-dashed">
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#888 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>

                        <p className="text-muted-foreground text-sm z-0">Preview Area</p>

                        {/* Preview */}
                        <div
                            style={{
                                position: "absolute",
                                bottom: config.position.includes("bottom") ? "20px" : "auto",
                                top: config.position.includes("top") ? "20px" : "auto",
                                left: config.position.includes("left") ? "20px" : config.position.includes("center") ? "50%" : "auto",
                                right: config.position.includes("right") ? "20px" : "auto",
                                transform: config.position.includes("center") ? "translateX(-50%)" : "none",
                                background: config.bgColor,
                                color: config.textColor,
                                padding: "16px",
                                borderRadius: "8px",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                display: "flex",
                                alignItems: "center",
                                gap: "16px",
                                zIndex: 10,
                                maxWidth: "340px",
                                fontSize: "14px"
                            }}
                        >
                            <div>
                                {config.message} {" "}
                                <span style={{ textDecoration: "underline", opacity: 0.8 }}>{config.linkText}</span>
                            </div>
                            <button style={{
                                background: config.btnColor,
                                color: config.btnTextColor,
                                border: "none",
                                padding: "8px 16px",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontWeight: 600,
                                whiteSpace: "nowrap"
                            }}>
                                {config.btnText}
                            </button>
                        </div>
                    </Card>

                    <Card className="p-0 overflow-hidden">
                        <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Code2 className="h-4 w-4" />
                                Generated Code
                            </h3>
                            <CopyButton text={generateCode()} />
                        </div>
                        <div className="p-4 bg-slate-950 text-slate-50 overflow-x-auto">
                            <pre className="text-xs font-mono whitespace-pre-wrap max-h-[200px] overflow-y-auto">
                                {generateCode()}
                            </pre>
                        </div>
                    </Card>
                </div>
            </div>
        </ToolShell>
    );
}
