if (!window.TRACKER_DATA) window.TRACKER_DATA = [];

window.TRACKER_DATA.push(
  {
    batch: "Module 1 — HTML Fundamentals",
    topics: [
      {
        id: "what-is-html",
        title: "What is HTML?",
        status: "done",
        analogy: "HTML is the architectural blueprint of a house. It defines where the walls, doors, and windows go, but doesn't handle the plumbing (JavaScript logic) or interior paint/decorations (CSS).",
        core: "HTML (HyperText Markup Language) is a markup language, not a programming language. It describes the structure and semantic meaning of document elements. 'Markup' means annotating content with tags to tell the browser what it represents. 'Hypertext' refers to links connecting different documents across the web.",
        code: `<!-- A simple semantic HTML structure -->
<h1>Research Paper: Quantum Computing</h1>
<p>Published in CERN journals. Read the full text <a href="/papers/quantum.html">here</a>.</p>`,
        diagram: `HTML Document Core:
┌──────────────────────────────┐
│  Hypertext Links             │
│  [Document A] ──► [Document B]│
├──────────────────────────────┤
│  Markup Tags                 │
│  <h1> Title </h1>            │
│  <p> Paragraph </p>          │
└──────────────────────────────┘`,
        mistake: "Believing HTML is a programming language. It has no syntax for loops, conditions, math, or variables, and runs no runtime computations.",
        traps: [
          "Thinking HTML parses like a programming language. HTML has custom built-in error recovery to auto-fix syntax errors, preventing rendering crashes."
        ],
        interview: "\"HTML is a markup language, not a programming language. It defines document structures and content semantics. It was designed by Tim Berners-Lee at CERN so physicists could link documents across different platforms without proprietary formats.\"",
        interviewQ: "Is HTML a programming language? Why or why not?"
      },
      {
        id: "browser-rendering",
        title: "How browsers render HTML",
        status: "done",
        analogy: "Rendering is like building a custom house. First you read the blueprints (DOM/CSSOM trees), merge them into a construction layout (Render Tree), compute the exact room measurements (Layout/Reflow), paint the walls (Paint), and stack the finished pre-made furniture parts together (Composite).",
        core: "The browser parsing pipeline reads raw HTML bytes, parses them into tokens, builds the DOM tree, merges it with the CSSOM tree to form the Render tree, computes positions/sizes (Layout/Reflow), fills in pixels (Paint), and composites layers on the GPU.",
        code: `<!-- Triggers DOM & CSSOM creation -->
<link rel="stylesheet" href="styles.css">
<div class="card">
  <h2>Welcome</h2>
</div>`,
        diagram: `The Rendering Pipeline:
HTML Bytes ──► Tokenizer ──► Tokens ──► DOM Tree ┐
                                                 ├─► Render Tree ──► Layout (Reflow) ──► Paint ──► Composite
CSS Bytes  ──► Tokenizer ──► Tokens ──► CSSOM ───┘`,
        mistake: "Believing that the browser waits for all images to download before starting the Layout and Paint phases. Browsers render incrementally.",
        traps: [
          "Thinking all elements in the DOM tree are in the Render tree. Elements styled with 'display: none' are omitted from the Render tree entirely (unlike 'visibility: hidden').",
          "Not understanding that layout changes cause expensive Reflows which trigger Paint, harming performance."
        ],
        interview: "\"The browser translates HTML bytes into tokens, builds the DOM tree, merges it with the CSSOM tree to form the Render Tree (excluding display:none nodes). It then runs Layout to calculate sizes, Paint to rasterize pixels, and Compositing to combine layers on the GPU.\"",
        interviewQ: "Walk me through what happens between typing a URL and seeing the rendered page (at least the HTML/CSS parsing part)."
      },
      {
        id: "dom-vs-html",
        title: "DOM vs HTML",
        status: "done",
        analogy: "HTML is a paper blueprint for a house. The DOM is the actual house built from it. You can paint a wall inside the house (modify the DOM via JS), which changes the house, but the paper blueprint (View Source) remains exactly the same.",
        core: "HTML is the raw, static text format written in a file. The DOM (Document Object Model) is the live, in-memory object tree built by the browser's engine. JavaScript modifies the live DOM, meaning the DOM and original HTML source can diverge.",
        code: `<!-- Original HTML: <div id="app"></div> -->
<script>
  // Mutating the live DOM
  document.getElementById('app').innerHTML = '<p>Active DOM Node</p>';
</script>`,
        diagram: `DOM vs HTML:
┌───────────────────────────┐
│ Raw HTML (View Source)    │ ◄── Static text representation
│ <div id="app"></div>      │
└─────────────┬─────────────┘
              │ Browser Parses
              ▼
┌───────────────────────────┐
│ Active DOM Tree           │
│ div#app                   │
│  └─► p                    │ ◄── Mutated by JS dynamically
└───────────────────────────┘`,
        mistake: "Assuming that 'View Page Source' in Chrome shows the current state of a JavaScript-rendered application. View Source only shows the original server HTML.",
        traps: [
          "Thinking that document.write() is a safe way to inject elements. It forces the parser to halt, re-tokenize, and can wipe out the entire DOM if called after loading."
        ],
        interview: "\"HTML is the static text written in the source code file. The DOM is the live, in-memory tree representation built by the browser. JS changes the DOM, causing it to differ from the source HTML shown in 'View Source'.\"",
        interviewQ: "What's the difference between the DOM and HTML source?"
      },
      {
        id: "html-parser",
        title: "HTML Parser",
        status: "done",
        analogy: "A spelling corrector in a chat app. If you type 'cya' it auto-corrects to 'see you'. The HTML parser does the same with missing tags (like unclosed paragraphs) to keep the web running instead of crashing.",
        core: "The HTML parser converts HTML code into the DOM. Unlike XML/JSON parsers which crash on syntax errors, the HTML spec defines exact error-recovery rules. The parser will auto-close tags and insert missing structure tokens to ensure rendering succeeds.",
        code: `<!-- Malformed HTML -->
<p>First paragraph
<p>Second paragraph
<!-- Parser auto-closes the first paragraph upon meeting the second <p> -->`,
        diagram: `Error Recovery Example:
Input:  <p>First <p>Second
DOM:    Parent: body
         ├── p -> "First" (Auto-closed)
         └── p -> "Second" (Auto-closed)`,
        mistake: "Relying on parser error recovery to write sloppy markup. Correct semantic nesting ensures clean AOM rendering and CSS selector matching.",
        traps: [
          "Assuming that the parser crashes on unclosed tags. The spec defines exact algorithms to handle missing tags so that all browsers render malformed HTML identically."
        ],
        interview: "\"Unlike XML which throws fatal errors on syntax issues, HTML5 uses exact, deterministic error-recovery rules. The parser automatically closes paragraph tags and inserts missing structural containers to preserve compatibility with legacy web content.\"",
        interviewQ: "How does the HTML parser handle malformed markup, and why?"
      },
      {
        id: "doc-structure",
        title: "HTML Document Structure (DOCTYPE, html, head, body)",
        status: "done",
        analogy: "A corporate letter. The DOCTYPE is the company header stating the standard format, the <html> is the envelope containing everything, the <head> contains the routing metadata (sender, stamps, recipient), and the <body> is the actual letter content.",
        core: "DOCTYPE triggers Standards Mode to prevent quirks mode rendering. The <html> root element sets page lang. The <head> contains instructions and metadata for the browser/SEO, while the <body> houses visible, renderable page layout elements.",
        code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>
  <main>Visible content</main>
</body>
</html>`,
        diagram: `Document Structure Outline:
<!DOCTYPE html>  ◄── Triggers Standards Mode
<html lang="en"> ◄── Root Element
 ├── <head>      ◄── Metadata & Styling directives
 └── <body>      ◄── Renderable page nodes`,
        mistake: "Omitting the lang attribute on <html>, which prevents screen readers from pronouncing content with correct accent parameters.",
        traps: [
          "Leaving out <!DOCTYPE html>, causing browsers to fall back to Quirks Mode. This breaks CSS layouts by using the old, non-standard box model math.",
          "Believing that multiple <body> tags are valid. The parser will automatically merge content inside secondary body tags into the first body node."
        ],
        interview: "\"<!DOCTYPE html> forces Standards Mode, preventing browsers from falling back to Quirks Mode. The html tag sets the document root and language, head defines non-rendered metadata/SEO directives, and body contains elements that merge into the Render Tree.\"",
        interviewQ: "Why does <!DOCTYPE html> matter, and what is Quirks Mode?"
      }
    ]
  }
);
