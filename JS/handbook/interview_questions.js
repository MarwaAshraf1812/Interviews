// Interview Questions Database
const QUESTIONS_DB = [
  {
    "id": 1,
    "category": "HTML Fundamentals",
    "question": "What is HTML?",
    "expected_answer": "HTML (HyperText Markup Language) is the standard markup language used to define the structure and meaning of web page content. It tells browsers how to construct the DOM.",
    "details": "HTML describes the structure (e.g. headings, paragraphs) and semantics, while CSS controls presentation and JavaScript manages behavior.",
    "code": "<!-- Example of structure -->\n<h1>My Title</h1>\n<p>My paragraph text.</p>"
  },
  {
    "id": 2,
    "category": "HTML Fundamentals",
    "question": "Why isn't HTML considered a programming language?",
    "expected_answer": "Because it doesn't support logic, control flow (loops, conditionals), variables, or memory operations. It is a declarative markup language that annotates text to describe its structure.",
    "details": "Programming languages (like JavaScript or Python) calculate values and manage state. HTML only describes to the browser what elements are.",
    "code": "/* HTML only declares elements: */\n<button>Submit</button>"
  },
  {
    "id": 3,
    "category": "HTML Fundamentals",
    "question": "What is a markup language?",
    "expected_answer": "A markup language is a system for annotating a document in a way that is syntactically distinguishable from the text, telling the parser how to structure, format, or define the meaning of the content.",
    "details": "Annotations are wrapped in tags like <code>&lt;p&gt;</code> or <code>&lt;h1&gt;</code>. The browser parses these annotations to render the page correctly.",
    "code": "<p>This is paragraph content.</p>"
  },
  {
    "id": 4,
    "category": "HTML Fundamentals",
    "question": "Why is HTML called HyperText Markup Language?",
    "expected_answer": "HyperText refers to text containing links (hyperlinks) to other texts, allowing non-linear navigation. Markup refers to the tags used to annotate text, and Language refers to the standardized syntax.",
    "details": "Clicking on an anchor tag (link) moves the user to another resource or document on the web.",
    "code": "<a href=\"https://example.com\">Visit Example Site</a>"
  },
  {
    "id": 5,
    "category": "HTML Fundamentals",
    "question": "What is the difference between HTML, CSS, and JavaScript?",
    "expected_answer": "HTML defines the structure and content semantics, CSS defines the styling and layout presentation, and JavaScript controls behavior and interactivity.",
    "details": "Separating these three concerns makes web applications more maintainable, testable, and accessible.",
    "code": "<!-- HTML -->\n<button id=\"btn\">Click Me</button>\n\n<!-- CSS -->\n#btn { background-color: blue; color: white; }\n\n<!-- JavaScript -->\ndocument.getElementById('btn').addEventListener('click', () => alert('Clicked!'));"
  },
  {
    "id": 6,
    "category": "HTML Fundamentals",
    "question": "If HTML only describes structure, who decides that <h1> should appear larger than <p>?",
    "expected_answer": "The browser's default stylesheet (User Agent Stylesheet) defines default visual styling for HTML elements.",
    "details": "Each browser has its own default CSS (like Chrome's User Agent Stylesheet) that applies default margins, sizes, and display properties to semantic tags.",
    "code": "/* Browser default stylesheet representation */\nh1 {\n  display: block;\n  font-size: 2em;\n  margin-block-start: 0.67em;\n  margin-block-end: 0.67em;\n  font-weight: bold;\n}"
  },
  {
    "id": 7,
    "category": "HTML Fundamentals",
    "question": "Why doesn't HTML need variables or loops?",
    "expected_answer": "Because HTML is a static representation of a document. Dynamism, data binding, and iterations are the responsibility of scripting languages (like JavaScript) or templating engines.",
    "details": "HTML is purely declarative. It defines the endpoint structure, not the mechanism for generating it.",
    "code": "<!-- Loops are handled in JS or templating, outputting raw HTML: -->\n<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n  <li>Item 3</li>\n</ul>"
  },
  {
    "id": 8,
    "category": "Semantic HTML",
    "question": "Why is semantic HTML better than using only <div> elements?",
    "expected_answer": "It provides accessibility (landmarks for screen readers), improves search engine optimization (SEO indexing weights), and provides self-documenting code that is easier to maintain.",
    "details": "A page of divs tells assistive technology nothing about where navigation or headers are. Semantic elements like header, nav, main, and footer build an accessible outline.",
    "code": "<!-- Anti-Pattern: Div Soup -->\n<div class=\"nav\">...</div>\n\n<!-- Semantic Structure -->\n<nav>...</nav>"
  },
  {
    "id": 9,
    "category": "Semantic HTML",
    "question": "You are building a product listing page. Each product is a card with an image, title, price, and Add to Cart button. Would you wrap each card in <div>, <article>, or <section>? Why?",
    "expected_answer": "Wrap each card in an <article> because each product is a self-contained composition that makes sense on its own and can be reused in other contexts.",
    "details": "If you extracted a single product card and placed it on a wishlist or a search results page, it would still represent the same product. Use div for layout wrappers, and section for grouped blocks with a heading.",
    "code": "<article class=\"product-card\">\n  <img src=\"iphone.jpg\" alt=\"iPhone 15\">\n  <h2>iPhone 15</h2>\n  <p>$999</p>\n  <button>Add to Cart</button>\n</article>"
  },
  {
    "id": 10,
    "category": "Semantic HTML",
    "question": "What is the difference between <div>, <section>, and <article>?",
    "expected_answer": "<div> has no semantic meaning and is a layout container; <section> groups related content under a thematic heading; <article> is an independent, self-contained piece of content.",
    "details": "Rule of thumb: if the content can stand alone (like a post or product), use article. If it is a group with a heading, use section. If it is only for CSS/styling, use div.",
    "code": "<section>\n  <h2>Featured Products</h2>\n  <div class=\"grid-layout\">\n    <article>Product A</article>\n    <article>Product B</article>\n  </div>\n</section>"
  },
  {
    "id": 11,
    "category": "Semantic HTML",
    "question": "In an e-commerce homepage with Featured Products, Latest Products, and Customer Reviews, how would you structure the main section?",
    "expected_answer": "Wrap the main content in a <main> element, and use three separate <section> elements, each with its own <h2> heading.",
    "details": "This establishes clear landmarks for screen readers, allowing users to jump directly to sections, and assists search engines in indexing page segments.",
    "code": "<main>\n  <section>\n    <h2>Featured Products</h2>\n    <!-- Articles -->\n  </section>\n  <section>\n    <h2>Customer Reviews</h2>\n    <!-- Articles -->\n  </section>\n</main>"
  },
  {
    "id": 12,
    "category": "Semantic HTML",
    "question": "Why use <div> around product cards, but <article> for each product? Why not make every product a <section>?",
    "expected_answer": "Because the wrapper is purely for CSS layout (like flex or grid) and holds no semantic grouping logic on its own. Products are articles because they are self-contained; section requires a heading.",
    "details": "A section should usually have a heading element. Making each product card a section is incorrect because you wouldn't give every card a section landmark in the accessibility tree.",
    "code": "<section>\n  <h2>Store Catalog</h2>\n  <!-- Div wrapper for grid layout styling -->\n  <div class=\"products-grid\">\n    <article>Product 1</article>\n    <article>Product 2</article>\n  </div>\n</section>"
  },
  {
    "id": 13,
    "category": "Buttons vs Links",
    "question": "Why is <button> better than <div onclick=\"buy()\">?",
    "expected_answer": "Because <button> has native accessibility, keyboard focus, and keyboard activation behavior. A div with a click handler is invisible to screen readers and cannot be focused with the Tab key.",
    "details": "To make a div work like a button, you would need to add tabindex=\"0\", role=\"button\", and a keydown handler for Enter/Space. A button handles all this automatically.",
    "code": "<!-- Bad Practice -->\n<div onclick=\"buy()\">Buy Now</div>\n\n<!-- Semantic Best Practice -->\n<button onclick=\"buy()\">Buy Now</button>"
  },
  {
    "id": 14,
    "category": "Buttons vs Links",
    "question": "When should you use <a> and when should you use <button>?",
    "expected_answer": "Use <a> (anchor) for navigation (changing the URL and moving to another page or section). Use <button> for triggering javascript actions or form submissions.",
    "details": "Never use anchors with href=\"#\" or href=\"javascript:void(0)\" to trigger JS functions. That is a button.",
    "code": "<!-- Navigation -->\n<a href=\"/dashboard\">Go to Dashboard</a>\n\n<!-- Action -->\n<button type=\"button\" onclick=\"openModal()\">Open Details</button>"
  },
  {
    "id": 15,
    "category": "Buttons vs Links",
    "question": "You have a Checkout page link. Should you use <a href=\"/checkout\"> or a <button>?",
    "expected_answer": "Use <a href=\"/checkout\"> because the user is navigating to a checkout page (a new URL).",
    "details": "Even if styled like a button, the semantic action is navigation. Always use anchors for navigation.",
    "code": "<a href=\"/checkout\" class=\"btn-style\">Proceed to Checkout</a>"
  },
  {
    "id": 16,
    "category": "Buttons vs Links",
    "question": "Why is 'Add to Cart' still a <button> even though it sends POST /cart/items to the server?",
    "expected_answer": "Because it triggers an operation (adding an item) without navigating the user away to a new document immediately. It performs an action on the current page.",
    "details": "It represents an interactive behavior. It's a button because it doesn't change the browser location in a standard navigation way.",
    "code": "<button onclick=\"addToCart(123)\">Add to Cart</button>"
  },
  {
    "id": 17,
    "category": "Buttons vs Links",
    "question": "A designer says: 'Make the Home link look like a button.' Would you replace <a> with <button>?",
    "expected_answer": "No. Maintain the <a> tag for navigation, but use CSS to style it to look like a button.",
    "details": "Design should not dictate HTML semantics. The underlying behavior remains navigation, so <a> is correct.",
    "code": "<!-- Semantics stay correct, styled via class -->\n<a href=\"/home\" class=\"button-styled-link\">Home</a>"
  },
  {
    "id": 18,
    "category": "Buttons vs Links",
    "question": "A Products navigation item opens a dropdown. Should 'Products' be <a> or <button>?",
    "expected_answer": "It should be a <button> because it triggers a UI change (opening a dropdown modal) on the page rather than navigating.",
    "details": "You should also use ARIA attributes like <code>aria-expanded=\"false\"</code> and <code>aria-haspopup=\"true\"</code> to declare dropdown support to screen readers.",
    "code": "<button type=\"button\" aria-expanded=\"false\" aria-haspopup=\"true\" onclick=\"toggleDropdown()\">\n  Products\n</button>"
  },
  {
    "id": 19,
    "category": "Product Card Semantics",
    "question": "For a product card where clicking the title opens the product details page, which is better: <button> or <a href=\"/products/iphone\">?",
    "expected_answer": "Use Option B: <a href=\"/products/iphone\"> because clicking the title is a navigation action to a new page.",
    "details": "Navigating to a product page is a navigation. Anchor is the correct element.",
    "code": "<a href=\"/products/iphone\">iPhone 15 Pro</a>"
  },
  {
    "id": 20,
    "category": "Product Card Semantics",
    "question": "To make the whole product card clickable, is it better to wrap it in an anchor <a> or use article onclick=\"goToProduct()\"?",
    "expected_answer": "It is better to wrap the <article> in an anchor <a> (or have a fully-stretched anchor inside it) because it preserves native browser features (right-click to open in new tab, status bar URL preview).",
    "details": "In HTML5, wrapping block-level elements inside an anchor is valid. Using JS click handlers on div/article disables default link behavior and keyboard navigation unless fully custom-coded.",
    "code": "<!-- Best accessible pattern -->\n<article class=\"card\">\n  <a href=\"/products/iphone\" class=\"main-link\">iPhone 15 Pro</a>\n  <button class=\"action-btn\">Add to Cart</button>\n</article>\n\n<!-- CSS stretches main-link over the card using positioning, while button stays clickable on top. -->"
  },
  {
    "id": 21,
    "category": "Product Card Semantics",
    "question": "Why is this problematic: <a href=\"/products/iphone\"><article><button>Add to Cart</button></article></a>?",
    "expected_answer": "Because it nests an interactive element (<button>) inside another interactive element (<a>), which creates a conflict in browser click handling and accessibility tree parsing.",
    "details": "Nesting interactive elements is illegal in HTML. Screen readers get confused, keyboard tab focus fails, and clicks inside the button can trigger link navigation.",
    "code": "<!-- Correct way: Stretch the link using CSS absolute positioning, sibling to button -->\n<div class=\"card-container\">\n  <a href=\"/product/123\" class=\"overlay-link\"></a>\n  <button class=\"cart-btn\">Add to Cart</button>\n</div>"
  },
  {
    "id": 22,
    "category": "Document Structure",
    "question": "What is the purpose of <!DOCTYPE html>?",
    "expected_answer": "It is a required document preamble that tells the browser to use Standards Mode instead of Quirks Mode, ensuring the page renders using modern CSS and HTML specifications.",
    "details": "Historically, doctypes were used to reference Document Type Definitions (DTDs) for HTML validation. In HTML5, it is simply a toggle for rendering behavior.",
    "code": "<!DOCTYPE html>\n<html>\n  <head>...</head>\n</html>"
  },
  {
    "id": 23,
    "category": "Document Structure",
    "question": "What happens if we remove <!DOCTYPE html> from the page?",
    "expected_answer": "The browser will enter Quirks Mode.",
    "details": "In Quirks Mode, the browser mimics the bugs and non-standard layout behaviors of old browsers (like Internet Explorer 5) to avoid breaking very old sites, causing layout bugs in modern designs.",
    "code": "<!-- Missing <!DOCTYPE html> triggers quirks mode automatically -->\n<html>\n  ..."
  },
  {
    "id": 24,
    "category": "Document Structure",
    "question": "What rendering mode might the browser use without DOCTYPE?",
    "expected_answer": "Quirks Mode.",
    "details": "Depending on the browser, it can use Quirks Mode or Limited Quirks Mode, which behaves differently from modern Standards Mode.",
    "code": "<!-- Quirks mode causes box-sizing, table styling, and inheritance bugs -->"
  },
  {
    "id": 25,
    "category": "Document Structure",
    "question": "What is the difference between Standards Mode and Quirks Mode?",
    "expected_answer": "Standards Mode renders pages according to modern W3C specifications. Quirks Mode emulates rendering bugs and behaviors of legacy layout engines.",
    "details": "For example, in Quirks Mode, the box model might include padding and borders in the width calculation (similar to box-sizing: border-box) by default, and margin auto centering might fail.",
    "code": "/* Standards Mode respects modern styling standards */"
  },
  {
    "id": 26,
    "category": "Document Structure",
    "question": "What is the root element of an HTML document?",
    "expected_answer": "The <html> element.",
    "details": "It contains all other elements, excluding the DOCTYPE preamble.",
    "code": "<html lang=\"en\">\n  ...\n</html>"
  },
  {
    "id": 27,
    "category": "Document Structure",
    "question": "Why do we use <html lang=\"en\"> instead of <html>?",
    "expected_answer": "The lang attribute defines the language of the page, which is critical for screen readers (to load the correct pronunciation profile) and search engines (for indexing and translation).",
    "details": "Without a lang attribute, screen readers might use the system's default language to pronounce text, leading to unreadable accents.",
    "code": "<html lang=\"ar\">\n  <!-- Tells the browser this page contains Arabic content -->\n</html>"
  },
  {
    "id": 28,
    "category": "Document Structure",
    "question": "What happens if <html lang=\"en\"> contains Arabic content? Is this correct?",
    "expected_answer": "It is incorrect. The screen reader will attempt to read the Arabic words using English voice synthesis, producing garbled speech.",
    "details": "If the primary page content language changes, you should update the lang attribute on the root or on the specific container.",
    "code": "<p lang=\"ar\">مرحبا بك</p>"
  },
  {
    "id": 29,
    "category": "Document Structure",
    "question": "How would you handle multilingual websites?",
    "expected_answer": "Set the appropriate lang attribute on the root html tag on a per-language basis, and use the dir attribute (dir=\"rtl\" or dir=\"ltr\") to control text layout direction.",
    "details": "For mixed content pages, wrap foreign text sections in span/div tags containing their own lang and dir attributes.",
    "code": "<p lang=\"ar\" dir=\"rtl\">مرحبا! This is English text.</p>"
  },
  {
    "id": 30,
    "category": "DOM and Browser",
    "question": "Is DOM the same as HTML?",
    "expected_answer": "No. HTML is the source text code. The DOM (Document Object Model) is the dynamic, living object tree representation of that HTML in the browser memory.",
    "details": "HTML is parsed to create the DOM. JavaScript works with the DOM, not the HTML file itself. The DOM can also contain elements created dynamically by scripts that never existed in the source HTML.",
    "code": "<!-- HTML source: -->\n<p>Hello</p>\n\n<!-- DOM representation is an active JavaScript object in memory -->"
  },
  {
    "id": 31,
    "category": "DOM and Browser",
    "question": "What happens after the browser receives an HTML file?",
    "expected_answer": "The parser tokenizes the HTML, builds the DOM tree, requests linked resources (CSS, JS), builds the CSSOM, combines them into a Render Tree, calculates layouts, and paints the pixels.",
    "details": "This process is known as the Critical Rendering Path. It runs continuously as DOM nodes are updated.",
    "code": "HTML -> Tokens -> DOM\nCSS -> CSSOM\nDOM + CSSOM -> Render Tree -> Layout -> Paint -> Composite"
  },
  {
    "id": 32,
    "category": "DOM and Browser",
    "question": "How does the browser convert HTML into something JavaScript can work with?",
    "expected_answer": "The browser engine parses the HTML tokens and constructs DOM nodes, which are JS object interfaces (implementing Node and Element interfaces).",
    "details": "The DOM APIs (like document.createElement) expose these node objects so scripts can modify them.",
    "code": "// Browser exposes DOM nodes as JS objects:\nconst el = document.getElementById('my-el');\nconsole.log(el.__proto__); // HTMLDivElement"
  },
  {
    "id": 33,
    "category": "DOM and Browser",
    "question": "If JavaScript runs document.querySelector('h1').remove();, does it remove the HTML file or the DOM node?",
    "expected_answer": "It removes the DOM node from browser memory.",
    "details": "The original HTML file on the web server remains untouched. If the user refreshes, the page will reload from the server and display the h1 again.",
    "code": "// Modifies the active DOM tree in memory only:\ndocument.querySelector('h1').remove();"
  },
  {
    "id": 34,
    "category": "DOM and Browser",
    "question": "Where does the DOM exist?",
    "expected_answer": "Inside the browser tab's heap memory (RAM).",
    "details": "It represents the current state of the page layout during the runtime session.",
    "code": "/* Exists only as long as the page session is active in the browser tab */"
  },
  {
    "id": 35,
    "category": "DOM and Browser",
    "question": "If JavaScript modifies the DOM, does it modify the original HTML file?",
    "expected_answer": "No. The server-side HTML file is completely unaffected by client-side DOM manipulations.",
    "details": "Client-side scripting only modifies the local execution state inside the user's browser.",
    "code": "/* Local DOM updates do not persist on the server */"
  },
  {
    "id": 36,
    "category": "Head vs Body",
    "question": "What is the difference between <head> and <body>?",
    "expected_answer": "<head> contains metadata, scripts, stylesheets, and document titles that are not visible to the user. <body> contains the actual visible content rendered on the page.",
    "details": "Metadata inside the head dictates character sets, SEO keywords, browser tab titles, and references dependencies.",
    "code": "<head>\n  <meta charset=\"UTF-8\">\n  <title>Visible Tab Name</title>\n</head>\n<body>\n  <h1>Visible Content Heading</h1>\n</body>"
  },
  {
    "id": 37,
    "category": "Head vs Body",
    "question": "Can JavaScript be placed inside <head>? If yes, what is the problem?",
    "expected_answer": "Yes, but standard script tags in the head block HTML parsing, delaying page render (render-blocking script).",
    "details": "To fix this, use the async or defer attributes, or place scripts at the bottom of the body tag.",
    "code": "<!-- Render-blocking -->\n<head>\n  \u003cscript src=\"script.js\"\u003e\u003c/script\u003e\n</head>\n\n<!-- Non-blocking (Best) -->\n<head>\n  \u003cscript src=\"script.js\" defer\u003e\u003c/script\u003e\n</head>"
  },
  {
    "id": 38,
    "category": "Title vs Headings",
    "question": "What is the difference between <title> and <h1>?",
    "expected_answer": "<title> defines the title of the document shown in the browser tab and search engine results. <h1> defines the main heading of the visible page content.",
    "details": "A title tag resides in the head; h1 resides in the body.",
    "code": "<head>\n  <title>Store | Cart Page</title>\n</head>\n<body>\n  <h1>Your Shopping Cart</h1>\n</body>"
  },
  {
    "id": 39,
    "category": "Title vs Headings",
    "question": "Should <title> and <h1> always have the same text?",
    "expected_answer": "No. The <title> should include site context (e.g. 'Product Name | Company Name') for search tab indexing, while the <h1> can be shorter (e.g. 'Product Name').",
    "details": "They have different contexts. Title is global catalog SEO metadata, H1 is page content context.",
    "code": "<!-- Title shows site scope -->\n<title>Awesome Shirts - Blue Polo | BrandName</title>\n\n<!-- H1 is direct page heading -->\n<h1>Blue Polo Shirt</h1>"
  },
  {
    "id": 40,
    "category": "Headings Hierarchy",
    "question": "Why should we avoid using <h3> just because we want smaller text?",
    "expected_answer": "Because heading tags represent structural levels and semantic outline hierarchy, not visual styles. Use CSS to adjust font sizes.",
    "details": "Screen readers use heading structures to build document outline outlines. Skipping levels (e.g. h1 to h3) breaks this accessibility outline.",
    "code": "<!-- Anti-pattern: Using H3 for small styling only -->\n<h1>Title</h1>\n<h3>This is styled small but breaks outline</h3>\n\n<!-- Correct: Style via CSS -->\n<h1>Title</h1>\n<h2 class=\"small-text\">This is structurally correct</h2>"
  },
  {
    "id": 41,
    "category": "Headings Hierarchy",
    "question": "Is this heading structure correct: h1 -> h2 -> h2 -> h3? Why?",
    "expected_answer": "Yes, it is correct because it follows a logical nested hierarchy without skipping levels.",
    "details": "The h3 nests under the second h2, which is perfectly valid.",
    "code": "<h1>Book Catalog</h1>\n  <h2>Fiction Section</h2>\n  <h2>Non-Fiction Section</h2>\n    <h3>Science History</h3>"
  },
  {
    "id": 42,
    "category": "Headings Hierarchy",
    "question": "Should every page have exactly one <h1>?",
    "expected_answer": "Yes, as a best practice, every page should have exactly one <h1> representing the main topic of that page.",
    "details": "Having multiple h1 elements makes it harder for search engines and screen reader users to identify the single primary topic of the document.",
    "code": "<!-- Best Practice outline has exactly one H1 -->\n<h1>Checkout Page</h1>"
  },
  {
    "id": 43,
    "category": "Headings Hierarchy",
    "question": "Is having multiple <h1> elements always invalid?",
    "expected_answer": "It is not invalid HTML syntax, but it is a poor SEO and accessibility practice.",
    "details": "Under HTML5 sectioning specifications, multiple h1s were allowed inside nested section/article elements, but browsers and screen readers never fully supported it cleanly, so the rule remains: one h1 per page.",
    "code": "<!-- Syntactically valid, but semantically discouraged -->"
  },
  {
    "id": 44,
    "category": "Forms & HTTP",
    "question": "What is the purpose of the <form> element?",
    "expected_answer": "To group related user inputs and handle document data submission to a server, specifying the endpoint (action) and method (GET or POST).",
    "details": "It defines a form container, which provides native features like validation triggers and keyboard submit actions (pressing Enter).",
    "code": "<form action=\"/submit-data\" method=\"POST\">\n  <input type=\"text\" name=\"username\">\n  <button type=\"submit\">Submit</button>\n</form>"
  },
  {
    "id": 45,
    "category": "Forms & HTTP",
    "question": "Why is the name attribute important in form inputs?",
    "expected_answer": "Because the browser uses the name attribute as the key when building the query string or POST body payload (key=value). Without a name, the input value is omitted from the submission.",
    "details": "The value of the input goes to the server, and the server reads the value using the name attribute key.",
    "code": "<input name=\"first_name\" value=\"Marwa\"> <!-- Submits as: first_name=Marwa -->"
  },
  {
    "id": 46,
    "category": "Forms & HTTP",
    "question": "If we submit a form with an input that has type='email' but no name attribute, will the email be sent to the server?",
    "expected_answer": "No. The browser ignores inputs that do not possess a name attribute during form submission.",
    "details": "The placeholder, type, and id attributes are never used as submission keys.",
    "code": "<!-- Will NOT submit to the server: -->\n<input type=\"email\" id=\"user-email\" placeholder=\"Enter email\">"
  },
  {
    "id": 47,
    "category": "Forms & HTTP",
    "question": "What is the difference between id and name attributes?",
    "expected_answer": "id is a unique document identifier used for CSS, JS, and linking label tags. name is the submission key used in HTTP request payloads.",
    "details": "An id must be unique page-wide. Multiple elements can share the same name attribute, such as radio inputs.",
    "code": "<!-- Radio buttons sharing a name but having unique IDs -->\n<input type=\"radio\" id=\"pay-paypal\" name=\"payment\" value=\"paypal\">\n<input type=\"radio\" id=\"pay-stripe\" name=\"payment\" value=\"stripe\">"
  },
  {
    "id": 48,
    "category": "Forms & HTTP",
    "question": "Why is placeholder not a replacement for <label>?",
    "expected_answer": "Because placeholders disappear once the user starts typing, hiding visual hints, and are not parsed correctly as field names by screen readers.",
    "details": "Using placeholders as labels creates severe cognitive load and accessibility issues. Always use a label tag linked via the for attribute.",
    "code": "<!-- Bad Practice -->\n<input placeholder=\"Username\">\n\n<!-- Accessible Practice -->\n<label for=\"usr\">Username</label>\n<input id=\"usr\" name=\"username\">"
  },
  {
    "id": 49,
    "category": "Forms & HTTP",
    "question": "What is the difference between disabled and readonly attributes?",
    "expected_answer": "disabled prevents focus, editing, and form submission of that input. readonly prevents editing, but allows focus and includes the value in form submissions.",
    "details": "Disabled inputs are grayed out. Readonly inputs are readable and are submitted, making them useful for backend keys that are fixed in UI.",
    "code": "<!-- Submitted to server -->\n<input readonly name=\"user_id\" value=\"123\">\n\n<!-- NOT submitted to server -->\n<input disabled name=\"temp_code\" value=\"XYZ\">"
  },
  {
    "id": 50,
    "category": "Forms & HTTP",
    "question": "Why use correct input types (e.g. type='email', type='tel') instead of using type='text' for everything?",
    "expected_answer": "It provides automatic browser validation, enables mobile keyboards specific to the context (like number keys for telephone), and improves screen reader announcements.",
    "details": "For example, type=\"tel\" triggers a numeric keyboard on mobile devices, preventing typing errors.",
    "code": "<input type=\"email\"> <!-- Built-in syntax validation -->\n<input type=\"tel\">   <!-- Number keyboard on mobile -->"
  },
  {
    "id": 51,
    "category": "Forms & HTTP",
    "question": "For a checkout flow, when do we use GET vs POST?",
    "expected_answer": "Use GET to render the checkout page (safe read operation). Use POST to submit payment details and place the order (state-modifying operation).",
    "details": "A GET request should be safe and idempotent. Placing an order changes server inventory and processes payments, so it must use POST.",
    "code": "<!-- View Checkout (Read) -->\nGET /checkout\n\n<!-- Submit Order (Create/Write) -->\nPOST /checkout"
  },
  {
    "id": 52,
    "category": "Forms & HTTP",
    "question": "Why do we store search/filters in URL query parameters instead of POST body?",
    "expected_answer": "Because search/filter is a read-only request. URL parameters make the filtered view shareable, bookmarkable, cached, and history-compatible.",
    "details": "A POST request cannot be bookmarked or shared directly by URL, and refreshing triggers a browser resubmission alert.",
    "code": "GET /products?category=laptops&sort=price_asc"
  },
  {
    "id": 53,
    "category": "Forms & HTTP",
    "question": "Why do we use POST instead of GET for login?",
    "expected_answer": "Because login creates authentication state (creating a session or token) and sends sensitive credentials that should not be exposed in the URL, browser logs, or browser history.",
    "details": "GET parameters appear in the URL query string, exposing sensitive passwords.",
    "code": "POST /login\nBody: email=user@test.com&password=123"
  },
  {
    "id": 54,
    "category": "Forms & HTTP",
    "question": "What is the difference between <input type='submit'> and <button type='submit'>?",
    "expected_answer": "<input type='submit'> is a self-closing element with limited visual styling (labeled via value attribute). <button type='submit'> is a container element that can wrap HTML content (text, icons, divs) for rich styling.",
    "details": "Button allows styling pseudo-elements and embedding icons directly, which input cannot do.",
    "code": "<!-- Limited -->\n<input type=\"submit\" value=\"Submit\">\n\n<!-- Flexible -->\n<button type=\"submit\">\n  <img src=\"send.png\" alt=\"\">\n  <span>Submit</span>\n</button>"
  },
  {
    "id": 55,
    "category": "Garbage Collection",
    "question": "In a circular reference example, why does mark-and-sweep correctly garbage collect objA and objB, even though they still reference each other?",
    "expected_answer": "Because eligibility for garbage collection is determined by reachability from roots, not reference counting. Since objA and objB are isolated from any root, the mark phase fails to reach them, and the sweep phase reclaims them.",
    "details": "Even though their reference count is 1, they are completely cut off from the main execution tree. Mark-and-sweep traces from the roots (like global scope, stack frames) and sweeps any unmarked objects.",
    "code": "function createCircular() {\n  const objA = {};\n  const objB = {};\n  objA.ref = objB;\n  objB.ref = objA;\n}\ncreateCircular();"
  },
  {
    "id": 56,
    "category": "Memory Leaks",
    "question": "In the startPolling(largeData) example, why exactly does largeData stay in memory forever if the interval is never cleared?",
    "expected_answer": "Because the callback registered in setInterval is stored in the browser's active timers table (a GC root). Since the interval is never cleared, the timer remains active, and its closure captures largeData, keeping it reachable from the root.",
    "details": "A closure retains access to its lexical scope backpack. If a callback remains alive (referenced by active timers or DOM listeners), all variables in its closure scope remain reachable and cannot be garbage collected.",
    "code": "function startPolling(largeData) {\n  setInterval(() => {\n    console.log(largeData.length);\n  }, 1000);\n}"
  },
  {
    "id": 57,
    "category": "Memory Leaks",
    "question": "Does setting a variable reference to null immediately free its memory in JavaScript?",
    "expected_answer": "No. Setting a reference to null simply breaks the pointer link. It makes the object eligible for garbage collection on the next cycle if no other references exist, which is handled asynchronously by V8.",
    "details": "The engine's garbage collector runs based on memory pressure heuristics, not synchronously or on-demand when references are set to null.",
    "code": "let data = { payload: 'heavy' };\ndata = null; // Eligible, but memory reclamation happens later asynchronously"
  },
  {
    "id": 58,
    "category": "Debounce vs Throttle",
    "question": "What is the difference between debouncing and throttling, and when should you use each?",
    "expected_answer": "Debouncing groups multiple sequential calls into a single execution that runs only after a specified period of inactivity has elapsed. Throttling guarantees a maximum execution rate, ensuring the function runs at most once in every specified time window.",
    "details": "Use debounce for events where you only care about the final state (e.g. search input, auto-save). Use throttle for events where you want regular periodic updates during continuous action (e.g. scrolling, resizing, dragging).",
    "code": "// Debounce: run once after pause\n// Throttle: run at most once per window"
  },
  {
    "id": 59,
    "category": "Debounce vs Throttle",
    "question": "If a user drags a slider continuously for 5 seconds straight, and the update handler is throttled at 200ms, how many times does the handler fire? Why wouldn't debounce be correct here?",
    "expected_answer": "The throttled handler will fire approximately 25 times (5000ms / 200ms). Debounce would not be correct because it resets its timer with every movement; a continuous drag would result in 0 executions until the user stops.",
    "details": "For continuous user actions like dragging, throttling provides smooth, real-time periodic updates, whereas debouncing pauses all updates until the action has fully completed.",
    "code": "const updateThrottled = throttle(updatePosition, 200);\nslider.addEventListener('input', updateThrottled);"
  }
];

// App state
let masteredIds = [];
let currentCategory = 'all';
let searchQuery = '';
let flashIndex = 0;
let mockIndex = 0;
let mockCheckedCount = 0;
let mockTotalRubricItems = 0;

// Load state from localStorage
function loadState() {
  const saved = localStorage.getItem('mastered_questions_html');
  if (saved) {
    try {
      masteredIds = JSON.parse(saved);
    } catch(e) {
      masteredIds = [];
    }
  }
}

// Save state to localStorage
function saveState() {
  localStorage.setItem('mastered_questions_html', JSON.stringify(masteredIds));
  updateStats();
}

// Update stats dashboard
function updateStats() {
  const total = QUESTIONS_DB.length;
  const mastered = masteredIds.length;
  const percentage = total > 0 ? Math.round((mastered / total) * 100) : 0;
  
  document.getElementById('mastered-stat').innerText = mastered;
  document.getElementById('percentage-stat').innerText = percentage + '%';
  document.getElementById('progress-text-val').innerText = `${mastered} / ${total}`;
  document.getElementById('progress-fill').style.width = percentage + '%';
}

// Filter questions based on category and search query
function getFilteredQuestions() {
  return QUESTIONS_DB.filter(q => {
    const matchesCategory = currentCategory === 'all' || q.category === currentCategory;
    const matchesSearch = searchQuery === '' || 
      q.question.toLowerCase().includes(searchQuery) ||
      q.expected_answer.toLowerCase().includes(searchQuery) ||
      (q.details && q.details.toLowerCase().includes(searchQuery));
    return matchesCategory && matchesSearch;
  });
}

// Populate category filter pills dynamically
function setupCategories() {
  const pillsContainer = document.getElementById('category-pills');
  const categories = new Set(QUESTIONS_DB.map(q => q.category));
  
  categories.forEach(cat => {
    const pill = document.createElement('div');
    pill.className = 'filter-pill';
    pill.innerText = cat;
    pill.setAttribute('data-category', cat);
    pill.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = cat;
      renderList();
      resetFlashcard();
      resetMock();
    });
    pillsContainer.appendChild(pill);
  });

  // Handle click on "All" pill
  document.querySelector('.filter-pill[data-category="all"]').addEventListener('click', function() {
    document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
    this.classList.add('active');
    currentCategory = 'all';
    renderList();
    resetFlashcard();
    resetMock();
  });
}

// Render list view
function renderList() {
  const container = document.getElementById('qa-list-view');
  container.innerHTML = '';
  const filtered = getFilteredQuestions();

  if (filtered.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding: 40px; color: var(--text-muted);">No questions match the current filters.</div>';
    return;
  }

  filtered.forEach((q, idx) => {
    const card = document.createElement('article');
    const isMastered = masteredIds.includes(q.id);
    card.className = `qa-card ${isMastered ? 'mastered' : ''}`;
    card.id = `q-card-${q.id}`;
    
    card.innerHTML = `
      <div class="qa-header" onclick="toggleCard(${q.id})">
        <div class="qa-header-left">
          <span class="qa-badge">Q${q.id}</span>
          <h4 class="qa-title">${escapeHTML(q.question)}</h4>
        </div>
        <div class="qa-header-right">
          <div class="mastery-checkbox-wrapper" onclick="event.stopPropagation(); toggleMastery(${q.id})">
            <div class="mastery-checkbox ${isMastered ? 'checked' : ''}" id="check-${q.id}"></div>
          </div>
          <span class="accordion-arrow">▼</span>
        </div>
      </div>
      
      <div class="qa-body">
        <div class="answer-section">
          <div class="section-label">Expected Answer Summary</div>
          <p class="answer-text">${escapeHTML(q.expected_answer)}</p>
        </div>
        
        ${q.details ? `
        <div class="details-box">
          <div class="section-label">Key Explanation & Concepts</div>
          <p class="answer-text" style="font-size:14px; color:var(--text-muted);">${escapeHTML(q.details)}</p>
        </div>
        ` : ''}
        
        ${q.code ? `
        <div class="code-container-wrapper">
          <button class="copy-btn" onclick="copyCode(this)">Copy Code</button>
          <pre class="code-block"><code>${escapeHTML(q.code)}</code></pre>
        </div>
        ` : ''}
      </div>
    `;
    container.appendChild(card);
  });
}

// Toggle card expansion
window.toggleCard = function(id) {
  const toggle = document.getElementById('questions-only-toggle');
  if (toggle && toggle.checked) {
    return;
  }
  const card = document.getElementById(`q-card-${id}`);
  if (card) {
    card.classList.toggle('open');
  }
};

// Toggle mastery check
window.toggleMastery = function(id) {
  const checkbox = document.getElementById(`check-${id}`);
  const card = document.getElementById(`q-card-${id}`);
  
  const index = masteredIds.indexOf(id);
  if (index === -1) {
    masteredIds.push(id);
    if (checkbox) checkbox.classList.add('checked');
    if (card) card.classList.add('mastered');
  } else {
    masteredIds.splice(index, 1);
    if (checkbox) checkbox.classList.remove('checked');
    if (card) card.classList.remove('mastered');
  }
  
  saveState();
  updateStats();
  
  // Update active flashcard check state if currently viewing it
  const currentFlash = getFilteredQuestions()[flashIndex];
  if (currentFlash && currentFlash.id === id) {
    updateFlashcardMasteryButton(id);
  }
};

function updateFlashcardMasteryButton(id) {
  const btn = document.getElementById('flash-mastery-btn');
  if (masteredIds.includes(id)) {
    btn.innerText = 'Mastered! ✓';
    btn.classList.add('flash-mastery-btn');
  } else {
    btn.innerText = 'Mark as Mastered';
    btn.classList.remove('flash-mastery-btn');
  }
}

// Copy Code Helper
window.copyCode = function(button) {
  const code = button.nextElementSibling.querySelector('code').innerText;
  navigator.clipboard.writeText(code).then(() => {
    button.innerText = 'Copied!';
    button.style.borderColor = 'var(--neon-green)';
    button.style.color = 'var(--neon-green)';
    setTimeout(() => {
      button.innerText = 'Copy Code';
      button.style.borderColor = '';
      button.style.color = '';
    }, 2000);
  });
};

// Escape HTML helper
function escapeHTML(str) {
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
}

// Set up view mode toggling
function setupViewToggles() {
  const listBtn = document.getElementById('list-toggle-btn');
  const flashBtn = document.getElementById('flash-toggle-btn');
  const mockBtn = document.getElementById('mock-toggle-btn');
  
  const listView = document.getElementById('qa-list-view');
  const flashView = document.getElementById('qa-flashcard-view');
  const mockView = document.getElementById('qa-mock-view');
  const qOnlyWrapper = document.getElementById('questions-only-wrapper');

  listBtn.addEventListener('click', () => {
    listBtn.classList.add('active');
    flashBtn.classList.remove('active');
    mockBtn.classList.remove('active');
    
    listView.style.display = 'flex';
    flashView.style.display = 'none';
    mockView.style.display = 'none';
    if (qOnlyWrapper) qOnlyWrapper.style.display = 'flex';
    renderList();
  });

  flashBtn.addEventListener('click', () => {
    listBtn.classList.remove('active');
    flashBtn.classList.add('active');
    mockBtn.classList.remove('active');
    
    listView.style.display = 'none';
    flashView.style.display = 'flex';
    mockView.style.display = 'none';
    if (qOnlyWrapper) qOnlyWrapper.style.display = 'none';
    resetFlashcard();
  });

  mockBtn.addEventListener('click', () => {
    listBtn.classList.remove('active');
    flashBtn.classList.remove('active');
    mockBtn.classList.add('active');
    
    listView.style.display = 'none';
    flashView.style.display = 'none';
    mockView.style.display = 'flex';
    if (qOnlyWrapper) qOnlyWrapper.style.display = 'none';
    resetMock();
  });
}

// Flashcards implementation
function resetFlashcard() {
  flashIndex = 0;
  const cardContainer = document.getElementById('flashcard');
  cardContainer.classList.remove('flipped');
  updateFlashcard();
}

function updateFlashcard() {
  const filtered = getFilteredQuestions();
  const cardIndicator = document.getElementById('flash-index-indicator');
  
  if (filtered.length === 0) {
    document.getElementById('flash-cat').innerText = 'No Questions';
    document.getElementById('flash-q').innerText = 'Choose another filter or query.';
    document.getElementById('flash-a').innerText = '';
    document.getElementById('flash-details').innerText = '';
    cardIndicator.innerText = '0 / 0';
    return;
  }

  const q = filtered[flashIndex];
  document.getElementById('flash-cat').innerText = q.category;
  document.getElementById('flash-q').innerText = q.question;
  document.getElementById('flash-a').innerText = q.expected_answer;
  document.getElementById('flash-details').innerText = q.details || '';
  
  cardIndicator.innerText = `${flashIndex + 1} / ${filtered.length}`;
  updateFlashcardMasteryButton(q.id);
}

// Mock Simulator implementation
function resetMock() {
  mockIndex = 0;
  updateMock();
}

function updateMock() {
  const filtered = getFilteredQuestions();
  const revealBtn = document.getElementById('mock-reveal-btn');
  const rubricSection = document.getElementById('mock-rubric-section');
  
  rubricSection.style.display = 'none';
  revealBtn.innerText = 'Reveal Grading Rubric';
  
  if (filtered.length === 0) {
    document.getElementById('mock-cat').innerText = 'No Questions';
    document.getElementById('mock-q').innerText = 'Choose another filter or query.';
    return;
  }

  const q = filtered[mockIndex];
  document.getElementById('mock-cat').innerText = q.category;
  document.getElementById('mock-q').innerText = q.question;

  // Extract points to check off from the answer and explanation
  const rubricPoints = [];
  
  // Breakdown the answer into sentences for check off
  const sentences = q.expected_answer.split('.').concat(q.details ? q.details.split('.') : []);
  sentences.forEach(s => {
    const clean = s.trim();
    if (clean.length > 15 && rubricPoints.length < 5) {
      rubricPoints.push(clean);
    }
  });

  // Add default semantic checks if too short
  if (rubricPoints.length < 2) {
    rubricPoints.push("Used correct semantic structure");
    rubricPoints.push("Provided concrete syntax examples");
  }

  mockTotalRubricItems = rubricPoints.length;
  mockCheckedCount = 0;

  const checklistContainer = document.getElementById('mock-checklist-container');
  checklistContainer.innerHTML = '';
  
  rubricPoints.forEach((point, pIdx) => {
    const item = document.createElement('div');
    item.className = 'mock-checklist-item';
    item.innerHTML = `
      <div class="mock-checklist-checkbox"></div>
      <span class="mock-checklist-text">${escapeHTML(point)}.</span>
    `;
    item.addEventListener('click', () => {
      item.classList.toggle('checked');
      const isChecked = item.classList.contains('checked');
      mockCheckedCount += isChecked ? 1 : -1;
      updateMockScore();
    });
    checklistContainer.appendChild(item);
  });

  updateMockScore();
}

function updateMockScore() {
  const scorePanel = document.getElementById('mock-score-panel');
  const scoreVal = document.getElementById('mock-score-val');
  const commentVal = document.getElementById('mock-score-comment');
  
  const score = mockTotalRubricItems > 0 ? Math.round((mockCheckedCount / mockTotalRubricItems) * 100) : 0;
  scoreVal.innerText = score + '%';
  
  if (score === 100) {
    commentVal.innerText = 'Perfect recall! You covered all technical checkpoints.';
    commentVal.style.color = 'var(--neon-green)';
  } else if (score >= 60) {
    commentVal.innerText = 'Great answer! You covered the core interview keywords.';
    commentVal.style.color = 'var(--accent-color)';
  } else {
    commentVal.innerText = 'Keep practicing. Make sure to hit the key semantic structures.';
    commentVal.style.color = 'var(--text-muted)';
  }

  if (mockCheckedCount > 0) {
    scorePanel.style.display = 'block';
  } else {
    scorePanel.style.display = 'none';
  }
}

// Search and Input listeners
function setupSearch() {
  const input = document.getElementById('search-bar');
  const clearBtn = document.getElementById('clear-search-btn');

  input.addEventListener('input', () => {
    searchQuery = input.value.toLowerCase().trim();
    clearBtn.style.display = searchQuery.length > 0 ? 'block' : 'none';
    
    renderList();
    resetFlashcard();
    resetMock();
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    searchQuery = '';
    clearBtn.style.display = 'none';
    renderList();
    resetFlashcard();
    resetMock();
  });
}

// Initialize Event Listeners for Flashcards and Mock simulator
function setupInteractiveModes() {
  const card = document.getElementById('flashcard');
  card.addEventListener('click', () => {
    card.classList.toggle('flipped');
  });

  // Flash prev/next
  document.getElementById('flash-prev-btn').addEventListener('click', () => {
    const filtered = getFilteredQuestions();
    if (filtered.length > 0) {
      card.classList.remove('flipped');
      setTimeout(() => {
        flashIndex = (flashIndex - 1 + filtered.length) % filtered.length;
        updateFlashcard();
      }, 100);
    }
  });

  document.getElementById('flash-next-btn').addEventListener('click', () => {
    const filtered = getFilteredQuestions();
    if (filtered.length > 0) {
      card.classList.remove('flipped');
      setTimeout(() => {
        flashIndex = (flashIndex + 1) % filtered.length;
        updateFlashcard();
      }, 100);
    }
  });

  document.getElementById('flash-mastery-btn').addEventListener('click', () => {
    const filtered = getFilteredQuestions();
    if (filtered.length > 0) {
      const q = filtered[flashIndex];
      toggleMastery(q.id);
    }
  });

  // Mock Reveal / next
  document.getElementById('mock-reveal-btn').addEventListener('click', () => {
    const panel = document.getElementById('mock-rubric-section');
    const revealBtn = document.getElementById('mock-reveal-btn');
    if (panel.style.display === 'none') {
      panel.style.display = 'block';
      revealBtn.innerText = 'Hide Rubric Checklist';
    } else {
      panel.style.display = 'none';
      revealBtn.innerText = 'Reveal Grading Rubric';
    }
  });

  document.getElementById('mock-prev-btn').addEventListener('click', () => {
    const filtered = getFilteredQuestions();
    if (filtered.length > 0) {
      mockIndex = (mockIndex - 1 + filtered.length) % filtered.length;
      updateMock();
    }
  });

  document.getElementById('mock-next-btn').addEventListener('click', () => {
    const filtered = getFilteredQuestions();
    if (filtered.length > 0) {
      mockIndex = (mockIndex + 1) % filtered.length;
      updateMock();
    }
  });
}

// Questions Only toggle functionality
function setupQuestionsOnlyToggle() {
  const toggle = document.getElementById('questions-only-toggle');
  const listView = document.getElementById('qa-list-view');
  
  if (!toggle || !listView) return;
  
  // Load saved state
  const savedState = localStorage.getItem('questions_only_html_prep') === 'true';
  toggle.checked = savedState;
  if (savedState) {
    listView.classList.add('questions-only-active');
  }

  toggle.addEventListener('change', () => {
    const isChecked = toggle.checked;
    localStorage.setItem('questions_only_html_prep', isChecked ? 'true' : 'false');
    
    if (isChecked) {
      listView.classList.add('questions-only-active');
      // Collapse all currently open cards
      document.querySelectorAll('.qa-card.open').forEach(card => card.classList.remove('open'));
    } else {
      listView.classList.remove('questions-only-active');
    }
  });
}

// Bootstrapping the app
window.addEventListener('DOMContentLoaded', () => {
  loadState();
  updateStats();
  setupCategories();
  renderList();
  setupViewToggles();
  setupQuestionsOnlyToggle();
  setupInteractiveModes();
  setupSearch();
});
