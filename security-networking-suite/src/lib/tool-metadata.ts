
import { Shield, FileJson, Terminal, Lock, Hash, Key, Network, Globe, Radio, Server } from "lucide-react";

export interface ToolConfig {
    slug: string;
    name: string;
    description: string;
    icon: any;
    category: "crypto" | "secrets" | "network" | "web";
}

export const tools: ToolConfig[] = [
    // 6.1 Cryptography & Permissions
    {
        slug: "jwt-debugger",
        name: "JWT Debugger",
        description: "Decode and verify JWTs entirely client-side. Visualize header, payload, and signature.",
        icon: Shield,
        category: "crypto",
    },
    {
        slug: "chmod-calculator",
        name: "Chmod Calculator",
        description: "Convert between Linux file permissions (rwx) and octal (755) notation visually.",
        icon: Terminal,
        category: "crypto",
    },
    {
        slug: "ssl-csr-generator",
        name: "SSL CSR Generator",
        description: "Generate OpenSSL commands for Certificate Signing Requests without leaving the browser.",
        icon: Lock,
        category: "crypto",
    },
    {
        slug: "password-entropy",
        name: "Password Entropy",
        description: "Calculate password strength and estimated crack time based on entropy bits.",
        icon: Key,
        category: "crypto",
    },
    {
        slug: "hash-generator",
        name: "Hash Generator",
        description: "Calculate MD5, SHA1, SHA256, and SHA512 hashes for text or files locally.",
        icon: Hash,
        category: "crypto",
    },

    // 6.2 Secrets & Generators (Next Phase)
    {
        slug: "htpasswd-generator",
        name: "HTPasswd Generator",
        description: "Generate Apache Basic Auth entries securely with bcrypt or md5.",
        icon: Lock,
        category: "secrets",
    },
    {
        slug: "ssh-config-generator",
        name: "SSH Config Generator",
        description: "Build ~/.ssh/config files with host aliases and identity settings.",
        icon: Terminal,
        category: "secrets",
    },
    {
        slug: "wireguard-keys",
        name: "WireGuard Keys",
        description: "Generate WireGuard public/private key pairs using client-side crypto.",
        icon: Network,
        category: "secrets",
    },
    {
        slug: "random-secrets",
        name: "Secret Key Gen",
        description: "Generate cryptographically strong API keys and salts.",
        icon: Key,
        category: "secrets",
    },
    {
        slug: "totp-generator",
        name: "TOTP Debugger",
        description: "Debug 2FA by generating codes from a secret key in your browser.",
        icon: Lock,
        category: "secrets",
    },

    // 6.3 Networking (Next Phase)
    {
        slug: "cidr-calculator",
        name: "CIDR Calculator",
        description: "Calculate IP ranges, netmasks, and broadcast addresses from CIDR blocks.",
        icon: Globe,
        category: "network",
    },
    {
        slug: "subnet-calculator",
        name: "Subnet Splitter",
        description: "Visual subnet calculator to split networks into smaller blocks.",
        icon: Network,
        category: "network",
    },
    {
        slug: "curl-to-code",
        name: "Curl to Code",
        description: "Convert Curl commands to Python, Node.js, Go, or Rust code.",
        icon: Terminal,
        category: "network",
    },
    {
        slug: "port-lookup",
        name: "Port Lookup",
        description: "Search commonly used ports and their associated services.",
        icon: Radio,
        category: "network",
    },
    {
        slug: "mac-lookup",
        name: "MAC Vendor Lookup",
        description: "Identify hardware manufacturers from MAC address OUI prefixes.",
        icon: Network,
        category: "network",
    },
    // 6.4 Web Config
    {
        slug: "htaccess-generator",
        name: ".htaccess Gen",
        description: "Generate Apache rewrite rules, redirects, and security headers.",
        icon: FileJson,
        category: "web"
    },
    {
        slug: "security-headers",
        name: "Header Analyzer",
        description: "Analyze and generate secure HTTP headers (HSTS, CSP, etc).",
        icon: Shield,
        category: "web"
    },
    {
        slug: "csp-generator",
        name: "CSP Generator",
        description: "Build robust Content Security Policy headers visually to prevent XSS.",
        icon: Shield,
        category: "web"
    },
    {
        slug: "spf-dkim-generator",
        name: "SPF/DKIM Gen",
        description: "Generate DNS records for email security (SPF, DMARC) to prevent spoofing.",
        icon: Globe,
        category: "web"
    },
    {
        slug: "robots-txt",
        name: "Robots.txt Gen",
        description: "Create robots.txt files to control crawler access.",
        icon: FileJson,
        category: "web"
    }
];

export const categories = {
    crypto: "Cryptography & Permissions",
    secrets: "Secrets & Generators",
    network: "Networking Utilities",
    web: "Web Configuration"
}
