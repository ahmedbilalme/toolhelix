// ToolHelix — Central Tool Registry
// Single source of truth for all tools, categories, metadata, and routing.

export type CategoryId =
  | "converters"
  | "generators"
  | "calculators"
  | "developer-tools"
  | "text-tools"
  | "image-tools";

export interface FAQItem {
  question: string;
  answer: string;
}

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
  faq: FAQItem[];
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
    faq: [
      { question: "Which image formats can I convert between?", answer: "JPEG, PNG, WEBP, GIF, BMP, and TIFF — in any direction. Upload one format and pick any of the others as your target." },
      { question: "Is my image uploaded to a server?", answer: "When our backend is reachable, the file is converted server-side and immediately discarded — never stored or logged. If the backend is unavailable, conversion runs entirely in your browser via Canvas, so your image never leaves your device." },
      { question: "Will converting to JPEG lose transparency?", answer: "Yes. JPEG has no alpha channel, so transparent areas are flattened to a solid background. Use PNG or WEBP if you need to keep transparency." },
    ],
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
    faq: [
      { question: "What unit categories are supported?", answer: "Length, weight/mass, temperature, area, volume, speed, time, and data storage — 8 categories in total, each with the units people actually use day to day." },
      { question: "How accurate are the conversions?", answer: "Conversions use standard, internationally recognized conversion factors and full floating-point precision, so results are accurate to several decimal places." },
      { question: "Does it work offline?", answer: "Yes — unit conversion runs entirely in your browser with no server round-trip, so it keeps working even with a flaky connection." },
    ],
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
    faq: [
      { question: "Are the exchange rates live?", answer: "Yes — rates are fetched from a free public exchange-rate API on page load. If that request fails for any reason, we fall back to a recent set of indicative rates and label them clearly as such." },
      { question: "How often are rates updated?", answer: "The live source updates its rates roughly once a day, which is accurate enough for travel budgeting and general reference — not for time-sensitive trading." },
      { question: "Do I need an API key or account?", answer: "No. The converter works instantly with no sign-up, no key, and no rate limits for normal use." },
    ],
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
    faq: [
      { question: "Are the generated passwords actually secure?", answer: "Yes. Passwords are generated with the Web Crypto API's cryptographically secure random number generator — the same class of randomness used in real cryptographic applications — not Math.random()." },
      { question: "Are passwords sent to a server or stored anywhere?", answer: "No. Generation happens entirely in your browser. Nothing is transmitted, logged, or saved — closing the tab wipes it from memory." },
      { question: "How long should my password be?", answer: "Aim for 16+ characters with a mix of character sets. Length contributes more to strength than complexity alone — the live strength meter shows you exactly where you land." },
    ],
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
    faq: [
      { question: "What can I put into a QR code?", answer: "Any text up to 2,000 characters — URLs, plain text, Wi-Fi credentials, contact details, or anything else you'd encode. Longer content needs a higher error-correction level or a bigger code to stay scannable." },
      { question: "Can I customize the colors and size?", answer: "Yes — set the foreground and background colors, the box size in pixels, and the quiet-zone border width before generating." },
      { question: "Can I download the QR code?", answer: "Yes, as a PNG file, ready to drop into a document, print, or share." },
    ],
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
    faq: [
      { question: "What is Lorem Ipsum, exactly?", answer: "It's scrambled, nonsensical Latin-derived filler text that's been the design and publishing industry's standard placeholder since the 1500s — it reads like real text at a glance without distracting from layout." },
      { question: "Can I generate something other than classic Lorem Ipsum?", answer: "Yes — choose paragraphs, sentences, or individual words, and set exactly how many you need." },
      { question: "Can I copy the output straight into my design tool?", answer: "Yes, one click copies the generated text to your clipboard, ready to paste anywhere." },
    ],
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
    faq: [
      { question: "What harmony modes are available?", answer: "Complementary, analogous, triadic, and monochromatic — each generates a different relationship between colors based on your seed color's position on the color wheel." },
      { question: "Can I get the exact hex, RGB, or HSL values?", answer: "Yes — every swatch shows all three formats, and clicking a swatch copies its value to your clipboard instantly." },
      { question: "How do I pick a good seed color?", answer: "Start with your brand's primary color or any color central to your design — the generator builds the rest of the palette around it, so the seed color anchors the whole scheme." },
    ],
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
    faq: [
      { question: "How is the monthly EMI calculated?", answer: "Using the standard amortizing-loan formula: EMI = P × r × (1+r)ⁿ / ((1+r)ⁿ − 1), where P is principal, r is the monthly interest rate, and n is the number of monthly installments." },
      { question: "Does it show the full repayment schedule?", answer: "Yes — alongside the monthly payment and total interest, you get a breakdown of how much of each payment goes to principal versus interest over the loan term." },
      { question: "Is this financial advice?", answer: "No. It's a calculation tool for estimating payments — always confirm exact figures with your lender before making financial decisions." },
    ],
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
    faq: [
      { question: "How is BMI calculated?", answer: "BMI = weight (kg) ÷ height (m)². For imperial units, the equivalent formula is 703 × weight (lb) ÷ height (in)². Enter either unit system and the calculation is handled for you." },
      { question: "Is BMI accurate for everyone?", answer: "BMI is a useful population-level screening measure, but it doesn't distinguish muscle from fat — athletes and very muscular people often show a higher BMI without excess body fat. Treat it as a general reference, not a diagnosis." },
      { question: "Can I use metric or imperial units?", answer: "Both — switch between kilograms/centimeters and pounds/feet-inches at any time." },
    ],
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
    faq: [
      { question: "What calculation modes does it support?", answer: "Three: finding X% of a number, calculating the percentage change (increase or decrease) between two numbers, and finding what percentage one number is of another." },
      { question: "How do I calculate a percentage increase?", answer: "Enter the original value and the new value in the % change mode — it computes ((new − original) / original) × 100 and tells you whether it's an increase or decrease." },
      { question: "Does it handle negative numbers?", answer: "Yes — all three modes accept negative inputs and calculate correctly, which is useful for tracking losses or decreases." },
    ],
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
    faq: [
      { question: "Does it validate JSON, not just format it?", answer: "Yes — invalid JSON is caught and reported with the exact line and column of the syntax error, so you can jump straight to the problem instead of scanning the whole payload." },
      { question: "Can I minify JSON back down?", answer: "Yes — set indentation to 0 to collapse formatted JSON back to a single compact line, handy for pasting into a curl command or API request." },
      { question: "Can I sort object keys alphabetically?", answer: "Yes, there's a toggle for it — useful when diffing two JSON responses that should be equivalent but were serialized in a different key order." },
    ],
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
    faq: [
      { question: "What regex flavor does it use?", answer: "JavaScript's native RegExp engine — the same one your browser and Node.js use — so patterns behave exactly as they would in real JS code." },
      { question: "Which flags are supported?", answer: "g (global), i (case-insensitive), m (multiline), and s (dotall) — toggle them independently to see how matches change in real time." },
      { question: "Does it show capture groups?", answer: "Yes — each match's capture groups are listed separately below the highlighted text, so you can verify your pattern extracts exactly what you expect." },
    ],
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
    faq: [
      { question: "Can I encode files, or just text?", answer: "Both — paste text directly, or upload a file to get its Base64-encoded representation, useful for data URIs and embedding small assets inline." },
      { question: "Is Base64 the same as encryption?", answer: "No. Base64 is an encoding, not encryption — it's trivially reversible by anyone and provides no security. Never use it to protect sensitive data." },
      { question: "Does it handle Unicode text correctly?", answer: "Yes — UTF-8 text (emoji, accented characters, non-Latin scripts) encodes and decodes correctly, not just plain ASCII." },
    ],
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
    faq: [
      { question: "How is this different from the Text Comparer tool?", answer: "Code Diff is tuned for code and config files — it shows a unified, line-numbered diff suited to reviewing structured changes. Text Comparer focuses on word-level highlighting inside prose." },
      { question: "Can I view the diff side-by-side?", answer: "Yes — toggle between a unified view and a side-by-side view depending on what's easier to scan for your comparison." },
      { question: "What counts as 'added' or 'removed'?", answer: "Lines only in the modified version are marked added (green); lines only in the original are marked removed (red); unchanged lines are shown for context." },
    ],
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
    faq: [
      { question: "What exactly does it count?", answer: "Words, characters (with and without spaces), sentences, and paragraphs — all updating live as you type or paste." },
      { question: "How is reading time estimated?", answer: "Based on an average adult silent-reading speed of about 200–250 words per minute, applied to your total word count." },
      { question: "Does it work on very large blocks of text?", answer: "Yes — paste in an entire article or document and the counts update instantly without any noticeable lag." },
    ],
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
    faq: [
      { question: "Which cases can I convert to?", answer: "UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, and kebab-case — 8 formats total, covering both everyday writing and code identifiers." },
      { question: "Does it handle punctuation and multiple spaces correctly?", answer: "Yes — word boundaries are detected on spaces, punctuation, and case changes, so conversions to camelCase or snake_case stay clean even on messy input." },
      { question: "Can I convert code identifiers, not just sentences?", answer: "Yes — camelCase, PascalCase, snake_case, and kebab-case conversions are built specifically for variable and file names, not just prose." },
    ],
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
    faq: [
      { question: "What granularity does the comparison use?", answer: "Both word-by-word and line-by-line — word-level highlighting shows exactly which words changed within a line, while line-level view is better for spotting whole insertions or deletions." },
      { question: "Is this good for proofreading edits between drafts?", answer: "Yes — paste an earlier draft and a revised one to instantly see every change, which is faster than re-reading both versions side by side." },
      { question: "Does it ignore whitespace differences?", answer: "Line breaks and spacing are treated as meaningful by default, since even whitespace-only changes can matter in code or formatted text." },
    ],
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
    faq: [
      { question: "How much can I shrink a file?", answer: "It depends on the source image and quality setting, but savings of 50–80% are common for photos, especially when converting a large PNG to compressed WEBP or JPEG." },
      { question: "Will compression visibly hurt quality?", answer: "At the default quality (80), degradation is minimal to the naked eye. The quality slider lets you trade off file size against visual fidelity to taste, and the exact savings are shown before you download." },
      { question: "What output formats are supported?", answer: "JPEG, WEBP, and PNG. WEBP generally gives the best size-to-quality ratio for web use." },
    ],
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
    faq: [
      { question: "Can I lock the aspect ratio?", answer: "Yes — with aspect ratio locked, entering a width automatically calculates a proportional height (and vice versa), so your image never looks stretched or squashed." },
      { question: "What's the maximum size I can resize to?", answer: "Up to 8000 pixels on each dimension, which comfortably covers everything from thumbnails to large print-ready graphics." },
      { question: "Does resizing reduce file size too?", answer: "Usually yes, since fewer pixels generally means a smaller file — but for maximum compression on top of resizing, run the result through the Image Compressor as well." },
    ],
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
