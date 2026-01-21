import {
    Regex,
    FileCode,
    Calendar,
    Link as LinkIcon,
    GitGraph,
    Maximize,
    Image,
    Clock,
    QrCode,
    Type,
    Code2,
    Palette,
    Tags,
    Terminal,
    Minimize,
    Hash,
    Crop,
    FileImage,
    List,
    Camera,
    ArrowRightLeft,
    Binary,
    Calculator,
    Eye,
    FileJson,
    Search,
} from "lucide-react";

export interface Tool {
    name: string;
    href: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any;
    description: string;
}

export interface Category {
    name: string;
    tools: Tool[];
}

export const toolsCategories: Category[] = [
    {
        name: "Text & Code",
        tools: [
            {
                name: "Regex Tester",
                href: "/tools/regex-tester",
                icon: Regex,
                description: "Test and explain regular expressions in real-time."
            },
            {
                name: "Diff Checker",
                href: "/tools/diff-checker",
                icon: FileCode,
                description: "Compare two text or code files side-by-side."
            },
            {
                name: "Markdown Preview",
                href: "/tools/markdown-preview",
                icon: Maximize,
                description: "Editor with live GitHub-flavored markdown preview."
            },
            {
                name: "String Escaper",
                href: "/tools/string-escaper",
                icon: Code2,
                description: "Escape text for JSON, Java, SQL, and more."
            },
            {
                name: "Minifier",
                href: "/tools/minifier",
                icon: Minimize,
                description: "Minify JS, CSS, and JSON code."
            },
            {
                name: "List to Array",
                href: "/tools/list-to-array",
                icon: List,
                description: "Convert a list of lines into a JSON array."
            },
            {
                name: "Slug Generator",
                href: "/tools/slug-generator",
                icon: LinkIcon,
                description: "Generate URL-friendly slugs from strings."
            },
            {
                name: "Case Converter",
                href: "/tools/case-converter",
                icon: Type,
                description: "Convert between camel, snake, kebab, and pascal case."
            },
        ],
    },
    {
        name: "Converters",
        tools: [
            {
                name: "Unix Timestamp",
                href: "/tools/unix-timestamp",
                icon: Clock,
                description: "Convert epoch time to human-readable dates."
            },
            {
                name: "URL Parser",
                href: "/tools/url-parser",
                icon: LinkIcon,
                description: " Parse URLs and decode query parameters."
            },
            {
                name: "Color Converter",
                href: "/tools/color-converter",
                icon: Palette,
                description: "Convert between HEX, RGB, and HSL formats."
            },
            {
                name: "SemVer Calc",
                href: "/tools/semver-calc",
                icon: GitGraph,
                description: "Calculate semantic versioning bumps."
            },
            {
                name: "Aspect Ratio",
                href: "/tools/aspect-ratio",
                icon: Crop,
                description: "Calculate aspect ratios and dimensions."
            },
            {
                name: "CSV to JSON",
                href: "/tools/csv-to-json",
                icon: FileJson,
                description: "Convert CSV data to JSON format."
            },
            {
                name: "Hex Editor",
                href: "/tools/hex-editor",
                icon: Binary,
                description: "View and edit binary data in hex format."
            },
        ],
    },
    {
        name: "Math & Logic",
        tools: [
            {
                name: "Base Converter",
                href: "/tools/base-converter",
                icon: ArrowRightLeft,
                description: "Convert numbers between Hex, Binary, Decimal, and Octal."
            },
            {
                name: "Bitwise Calculator",
                href: "/tools/bitwise-calc",
                icon: Binary,
                description: "Perform AND, OR, XOR, NOT, and shift operations."
            },
            {
                name: "Prime Checker",
                href: "/tools/prime-checker",
                icon: Calculator,
                description: "Check if a number is prime and find factors."
            },
            {
                name: "BigInt Calculator",
                href: "/tools/bigint-calc",
                icon: Calculator,
                description: "Perform arithmetic on arbitrarily large integers."
            },
        ],
    },
    {
        name: "Generators & Media",
        tools: [
            {
                name: "Base64 Encoder",
                href: "/tools/base64-encoder",
                icon: Image,
                description: "Convert images to Base64 strings."
            },
            {
                name: "Cron Generator",
                href: "/tools/cron-generator",
                icon: Calendar,
                description: "Generate and explain cron schedules."
            },
            {
                name: "QR Code",
                href: "/tools/qr-code",
                icon: QrCode,
                description: "Generate QR codes from text or URLs."
            },
            {
                name: "Lorem Ipsum",
                href: "/tools/lorem-ipsum",
                icon: Type,
                description: "Generate dummy text and code data."
            },
            {
                name: "Meta Tags",
                href: "/tools/meta-tags",
                icon: Tags,
                description: "Generate SEO meta tags and social previews."
            },
            {
                name: "Git Cheatsheet",
                href: "/tools/git-cheatsheet",
                icon: Terminal,
                description: "Interactive cheat sheet for Git commands."
            },
            {
                name: "ASCII Art",
                href: "/tools/ascii-art",
                icon: Hash,
                description: "Create ASCII art text banners."
            },
            {
                name: "Favicon Gen",
                href: "/tools/favicon-generator",
                icon: FileImage,
                description: "Generate favicons and app icons."
            },
            {
                name: "Code Screenshot",
                href: "/tools/code-screenshot",
                icon: Camera,
                description: "Create beautiful code screenshots."
            },
            {
                name: "Color Blindness Sim",
                href: "/tools/color-blindness",
                icon: Eye,
                description: "Simulate color blindness on images."
            },
        ],
    },
    {
        name: "Reference",
        tools: [
            {
                name: "HTTP Status Guide",
                href: "/tools/http-status",
                icon: Search,
                description: "Searchable reference for HTTP status codes."
            },
            {
                name: "MIME Type Lookup",
                href: "/tools/mime-lookup",
                icon: Search,
                description: "Searchable database of MIME types and extensions."
            },
        ],
    },
];
