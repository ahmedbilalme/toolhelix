// ToolHelix — Central Tool Registry
// Single source of truth for all tools, categories, metadata, and routing.

export type CategoryId =
  | "converters"
  | "generators"
  | "calculators"
  | "developer-tools"
  | "text-tools"
  | "image-tools";

export interface ToolMeta {
  id: string;
  name: string;
  slug: string;
  category: CategoryId;
  description: string;
  longDescription: string;
  icon: string;           // emoji for now — swap for SVG later
  keywords: string[];
  related: string[];      // tool ids
  apiEndpoint?: string;   // FastAPI endpoint, undefined = pure frontend
  isNew?: boolean;
  isFeatured?: boolean;
}

export interface CategoryMeta {
  id: CategoryId;
  name: string;
  description: string;
  icon: string;
  color: string;           // CSS var reference
  badgeClass: string;
}

// ── Categories ──────────────────────────────────────────────────────────────

export const CATEGORIES: CategoryMeta[] = [
  {
    id: "converters",
    name: "Converters",
    description: "Transform files and data between formats instantly.",
    icon: "🔄",
    color: "#6E56CF",
    badgeClass: "badge-violet",
  },
  {
    id: "generators",
    name: "Generators",
    description: "Create passwords, QR codes, palettes, and more.",
    icon: "✨",
    color: "#3B82F6",
    badgeClass: "badge-blue",
  },
  {
    id: "calculators",
    name: "Calculators",
    description: "Crunch numbers: loans, BMI, percentages, and beyond.",
    icon: "🧮",
    color: "#10B981",
    badgeClass: "badge-green",
  },
  {
    id: "developer-tools",
    name: "Developer Tools",
    description: "Format JSON, test regex, encode, diff — built for devs.",
    icon: "⚡",
    color: "#F59E0B",
    badgeClass: "badge-orange",
  },
  {
    id: "text-tools",
    name: "Text Tools",
    description: "Count words, convert cases, and compare text.",
    icon: "📝",
    color: "#EC4899",
    badgeClass: "badge-pink",
  },
  {
    id: "image-tools",
    name: "Image Tools",
    description: "Compress, resize, and convert images without losing quality.",
    icon: "🖼️",
    color: "#06B6D4",
    badgeClass: "badge-cyan",
  },
];

// ── Tools ────────────────────────────────────────────────────────────────────

export const TOOLS: ToolMeta[] = [
  // Converters
  {
    id: "image-format-converter",
    name: "Image Format Converter",
    slug: "image-format-converter",
    category: "converters",
    description: "Convert images between JPEG, PNG, WEBP, GIF, BMP, and TIFF instantly.",
    longDescription:
      "Upload any image and convert it to your preferred format in seconds. Supports JPEG, PNG, WEBP, GIF, BMP, and TIFF. Perfect for web optimization, design workflows, and compatibility fixes.",
    icon: "🖼️",
    keywords: ["image converter", "jpg to png", "png to webp", "image format conversion"],
    related: ["image-compressor", "image-resizer", "unit-converter"],
    apiEndpoint: "/api/converters/image-format",
    isFeatured: true,
  },
  {
    id: "unit-converter",
    name: "Unit Converter",
    slug: "unit-converter",
    category: "converters",
    description: "Convert between length, weight, temperature, area, volume, and more.",
    longDescription:
      "A comprehensive unit conversion tool covering 8 measurement categories. Convert meters to feet, Celsius to Fahrenheit, kilograms to pounds — all instantly with no page reload.",
    icon: "📏",
    keywords: ["unit converter", "length converter", "temperature converter", "metric to imperial"],
    related: ["percentage-calculator", "bmi-calculator", "currency-converter"],
  },
  {
    id: "currency-converter",
    name: "Currency Converter",
    slug: "currency-converter",
    category: "converters",
    description: "Real-time currency conversion between 170+ world currencies.",
    longDescription:
      "Convert between 170+ currencies with live exchange rates. Great for travel planning, international pricing, and financial calculations.",
    icon: "💱",
    keywords: ["currency converter", "forex", "exchange rate", "usd to eur"],
    related: ["unit-converter", "loan-calculator", "percentage-calculator"],
    isFeatured: true,
  },

  // Generators
  {
    id: "password-generator",
    name: "Password Generator",
    slug: "password-generator",
    category: "generators",
    description: "Generate strong, cryptographically secure passwords instantly.",
    longDescription:
      "Create strong passwords with custom length, character sets (uppercase, lowercase, numbers, symbols), and a live strength meter. Uses the Web Crypto API — nothing is sent to any server.",
    icon: "🔐",
    keywords: ["password generator", "strong password", "random password", "secure password"],
    related: ["base64", "qr-code-generator", "lorem-ipsum-generator"],
    isFeatured: true,
    isNew: false,
  },
  {
    id: "qr-code-generator",
    name: "QR Code Generator",
    slug: "qr-code-generator",
    category: "generators",
    description: "Generate QR codes from any text, URL, or data. Download as PNG.",
    longDescription:
      "Create custom QR codes for URLs, contact info, Wi-Fi credentials, or any text. Customize foreground/background colors, size, and error correction level.",
    icon: "📱",
    keywords: ["qr code generator", "qr code maker", "free qr code", "url to qr code"],
    related: ["password-generator", "image-format-converter", "lorem-ipsum-generator"],
    apiEndpoint: "/api/generators/qr-code",
    isNew: true,
  },
  {
    id: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    slug: "lorem-ipsum-generator",
    category: "generators",
    description: "Generate placeholder text — paragraphs, sentences, or words.",
    longDescription:
      "Generate classic lorem ipsum or varied placeholder text for mockups, wireframes, and designs. Choose output type (paragraphs, sentences, words), count, and format.",
    icon: "📄",
    keywords: ["lorem ipsum generator", "placeholder text", "dummy text", "filler text"],
    related: ["word-counter", "case-converter", "text-comparer"],
  },
  {
    id: "color-palette-generator",
    name: "Color Palette Generator",
    slug: "color-palette-generator",
    category: "generators",
    description: "Generate beautiful, harmonious color palettes from any seed color.",
    longDescription:
      "Pick a base color and generate complementary, analogous, triadic, or monochromatic palettes. Copy hex values, RGB, or HSL instantly.",
    icon: "🎨",
    keywords: ["color palette generator", "color scheme", "complementary colors", "hex palette"],
    related: ["image-format-converter", "password-generator", "image-compressor"],
    isFeatured: true,
    isNew: true,
  },

  // Calculators
  {
    id: "loan-calculator",
    name: "Loan / EMI Calculator",
    slug: "loan-calculator",
    category: "calculators",
    description: "Calculate monthly EMI, total interest, and full repayment schedule.",
    longDescription:
      "Enter your loan amount, interest rate, and tenure to get a full amortization breakdown — monthly payment, total interest paid, and a visual payment schedule.",
    icon: "🏦",
    keywords: ["emi calculator", "loan calculator", "mortgage calculator", "monthly payment calculator"],
    related: ["percentage-calculator", "currency-converter", "bmi-calculator"],
    isFeatured: true,
  },
  {
    id: "bmi-calculator",
    name: "BMI Calculator",
    slug: "bmi-calculator",
    category: "calculators",
    description: "Calculate your Body Mass Index with metric or imperial units.",
    longDescription:
      "Enter your height and weight (metric or imperial) to calculate your BMI and see where you fall on the standard BMI scale with helpful health context.",
    icon: "⚖️",
    keywords: ["bmi calculator", "body mass index", "healthy weight", "bmi chart"],
    related: ["unit-converter", "percentage-calculator", "loan-calculator"],
  },
  {
    id: "percentage-calculator",
    name: "Percentage Calculator",
    slug: "percentage-calculator",
    category: "calculators",
    description: "Three modes: % of a number, % change, and X is what % of Y.",
    longDescription:
      "Three calculation modes in one tool: find what percentage one number is of another, calculate percentage increase/decrease, and find X% of any number — great for discounts, grades, and analytics.",
    icon: "🔢",
    keywords: ["percentage calculator", "percent change", "percent of a number", "percentage increase"],
    related: ["loan-calculator", "bmi-calculator", "unit-converter"],
  },

  // Developer Tools
  {
    id: "json-formatter",
    name: "JSON Formatter & Validator",
    slug: "json-formatter",
    category: "developer-tools",
    description: "Format, validate, and minify JSON with syntax highlighting and precise error messages.",
    longDescription:
      "Paste any JSON — valid or broken — and get instant feedback. Formats with configurable indentation, sorts keys alphabetically on demand, and pinpoints syntax errors with line/column numbers.",
    icon: "{ }",
    keywords: ["json formatter", "json validator", "json beautifier", "json pretty print"],
    related: ["base64", "regex-tester", "code-diff"],
    apiEndpoint: "/api/dev/json-format",
    isFeatured: true,
  },
  {
    id: "regex-tester",
    name: "Regex Tester",
    slug: "regex-tester",
    category: "developer-tools",
    description: "Test and debug regular expressions with live match highlighting.",
    longDescription:
      "Write a regex pattern and test it against any text in real time. Highlights all matches, shows capture groups, and supports flags (g, i, m, s).",
    icon: "🔍",
    keywords: ["regex tester", "regular expression tester", "regex debugger", "regex matcher"],
    related: ["json-formatter", "code-diff", "text-comparer"],
  },
  {
    id: "base64",
    name: "Base64 Encoder / Decoder",
    slug: "base64",
    category: "developer-tools",
    description: "Encode or decode Base64 strings — text and file support.",
    longDescription:
      "Instantly encode text or files to Base64, or decode Base64 strings back to readable content. Handles UTF-8 text and binary files.",
    icon: "🔒",
    keywords: ["base64 encoder", "base64 decoder", "base64 converter", "encode decode base64"],
    related: ["json-formatter", "regex-tester", "password-generator"],
  },
  {
    id: "code-diff",
    name: "Code Diff Checker",
    slug: "code-diff",
    category: "developer-tools",
    description: "Compare two code blocks side-by-side with highlighted differences.",
    longDescription:
      "Paste two versions of any code or text and see a clear, color-coded diff — added lines in green, removed lines in red — in a side-by-side or unified view.",
    icon: "↔️",
    keywords: ["code diff", "text diff", "diff checker", "compare code"],
    related: ["json-formatter", "regex-tester", "text-comparer"],
    apiEndpoint: "/api/text/compare",
    isNew: true,
  },

  // Text Tools
  {
    id: "word-counter",
    name: "Word Counter",
    slug: "word-counter",
    category: "text-tools",
    description: "Count words, characters, sentences, paragraphs, and reading time.",
    longDescription:
      "Paste or type any text to get an instant breakdown: word count, character count (with/without spaces), sentence count, paragraph count, and estimated reading time.",
    icon: "📊",
    keywords: ["word counter", "character counter", "word count tool", "reading time calculator"],
    related: ["case-converter", "lorem-ipsum-generator", "text-comparer"],
    isFeatured: true,
  },
  {
    id: "case-converter",
    name: "Case Converter",
    slug: "case-converter",
    category: "text-tools",
    description: "Convert text between UPPER, lower, Title, camelCase, snake_case, and more.",
    longDescription:
      "Paste any text and convert it to 8 different cases: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, and kebab-case.",
    icon: "Aa",
    keywords: ["case converter", "text case converter", "camelcase converter", "uppercase converter"],
    related: ["word-counter", "lorem-ipsum-generator", "text-comparer"],
  },
  {
    id: "text-comparer",
    name: "Text Comparer",
    slug: "text-comparer",
    category: "text-tools",
    description: "Compare two blocks of text and highlight every difference.",
    longDescription:
      "Paste two pieces of text and get a word-by-word and line-by-line diff. Great for spotting edits, comparing versions, and proofreading.",
    icon: "🔀",
    keywords: ["text comparer", "text diff", "compare text", "find differences in text"],
    related: ["word-counter", "code-diff", "lorem-ipsum-generator"],
    apiEndpoint: "/api/text/compare",
  },

  // Image Tools
  {
    id: "image-compressor",
    name: "Image Compressor",
    slug: "image-compressor",
    category: "image-tools",
    description: "Compress JPEG, PNG, and WEBP images — save up to 80% file size.",
    longDescription:
      "Upload an image and compress it with custom quality settings. Supports JPEG, PNG, and WEBP output. Shows exact file size savings before you download.",
    icon: "📦",
    keywords: ["image compressor", "compress image online", "reduce image size", "jpg compressor"],
    related: ["image-resizer", "image-format-converter", "color-palette-generator"],
    apiEndpoint: "/api/image/compress",
    isFeatured: true,
  },
  {
    id: "image-resizer",
    name: "Image Resizer",
    slug: "image-resizer",
    category: "image-tools",
    description: "Resize images to exact dimensions with optional aspect ratio lock.",
    longDescription:
      "Upload an image and resize it to any width and height. Lock the aspect ratio to prevent distortion, or set exact pixel dimensions for platform-specific requirements.",
    icon: "📐",
    keywords: ["image resizer", "resize image online", "crop image", "resize photo"],
    related: ["image-compressor", "image-format-converter", "color-palette-generator"],
    apiEndpoint: "/api/image/resize",
    isNew: true,
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

export function getToolBySlug(slug: string): ToolMeta | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getToolsByCategory(categoryId: CategoryId): ToolMeta[] {
  return TOOLS.filter((t) => t.category === categoryId);
}

export function getCategoryById(id: CategoryId): CategoryMeta | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function getRelatedTools(toolId: string, limit = 4): ToolMeta[] {
  const tool = TOOLS.find((t) => t.id === toolId);
  if (!tool) return [];
  return tool.related
    .map((id) => TOOLS.find((t) => t.id === id))
    .filter((t): t is ToolMeta => !!t)
    .slice(0, limit);
}

export function getFeaturedTools(): ToolMeta[] {
  return TOOLS.filter((t) => t.isFeatured);
}

export function getNewTools(limit = 4): ToolMeta[] {
  return TOOLS.filter((t) => t.isNew).slice(0, limit);
}

export function searchTools(query: string): ToolMeta[] {
  const q = query.toLowerCase().trim();
  if (!q) return TOOLS;
  return TOOLS.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.keywords.some((k) => k.includes(q))
  );
}
