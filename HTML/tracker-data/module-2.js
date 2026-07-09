if (!window.TRACKER_DATA) window.TRACKER_DATA = [];

window.TRACKER_DATA.push(
  {
    batch: "Module 2 — Semantic HTML",
    topics: [
      {
        id: "semantic-outlining",
        title: "Semantic Outlining (<article> vs <section> vs <div>)",
        status: "done",
        analogy: "A labeled file organizer vs a giant cardboard box. A labeled folder tells you exactly what document is inside (Tax Return, Contract), while a generic cardboard box (div) requires you to open and inspect it manually.",
        core: "Semantic HTML uses elements that communicate meaning to both developer and browser/screen readers. <article> represents self-contained content that can be reused independently (e.g. product cards). <section> represents a thematic group, normally requiring an h2-h6 heading. <div> has no meaning and serves only as a layout hooks container.",
        code: `<section class="products">
  <h2>Featured Products</h2>

  <div class="products-grid"> <!-- div handles only CSS Grid Layout -->
    
    <article class="product-card">
      <img src="shirt.jpg" alt="Blue T-shirt">
      <h3>Blue T-shirt</h3>
      <p>$25</p>
      <button type="button">Add to Cart</button>
    </article>

  </div>
</section>`,
        mistake: "Using <div> for everything (div-soup) or using <section> purely for CSS styling without adding an actual heading element inside it.",
        interview: "\"Use <article> for individual product cards because each card is an independent, self-contained chunk of content that remains fully understandable even when extracted. Use a <div> only for structural layout (Flex/Grid) and <section> to group the catalog under a title.\"",
        diagram: `Semantic Layout Outlines:
┌────────────────────────────────────────┐
│ <section class="products">             │
│   <h2>Catalog</h2>                     │
│   ┌────────────────────────────────┐   │
│   │ <div class="grid">             │   │
│   │   ┌──────────────────────────┐ │   │
│   │   │ <article>                │ │   │
│   │   │   <h3>Product</h3>       │ │   │
│   │   │   <button>Buy</button>   │ │   │
│   │   │ </article>               │ │   │
│   │   └──────────────────────────┘ │   │
│   │ </div>                         │   │
│   └────────────────────────────────┘   │
└────────────────────────────────────────┘`,
        traps: [
          "Using <code>&lt;section&gt;</code> without a heading tag (<code>&lt;h2&gt;-&lt;h6&gt;</code>) inside it. The HTML5 spec requires sections to represent thematic regions that can be outlined.",
          "Confusing <code>&lt;article&gt;</code> with blog posts only. In e-commerce, product cards, review cards, and forum comments are all valid articles."
        ],
        interviewQ: "If you're building a product listing page, would you wrap each card in a <div>, <article>, or <section>? Why?"
      },
      { id: "inline-vs-block", title: "Inline vs Block Elements (span, div)", status: "pending" },
      { id: "structural-semantics", title: "Structural Semantics (header, footer, main, aside, nav)", status: "pending" },
      { id: "contextual-semantics", title: "Contextual Semantics (figure, figcaption, address, time)", status: "pending" }
    ]
  }
);
