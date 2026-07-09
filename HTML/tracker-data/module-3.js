if (!window.TRACKER_DATA) window.TRACKER_DATA = [];

window.TRACKER_DATA.push(
  {
    batch: "Module 3 — Forms & Validations",
    topics: [
      {
        id: "anchor-vs-button",
        title: "Navigation vs. Action (<a> vs <button>)",
        status: "done",
        analogy: "A highway sign vs a light switch. A highway sign (anchor) guides you to a completely different location. A light switch (button) changes the state of the room right where you stand.",
        core: "Choose elements based on intent, not styling. Anchors (<a>) are meant for navigation and trigger GET requests (safe, bookmarkable, crawler-friendly). Buttons (<button>) are for actions that trigger script side-effects, form submissions, or POST/PUT/DELETE requests.",
        code: `<!-- Navigation Link -->
<a href="/checkout">Go to Checkout</a>

<!-- Action Control -->
<button type="button" onclick="addToCart(123)">Add to Cart</button>

<!-- Form Submit Action -->
<form action="/login" method="POST">
  <button type="submit">Submit Login</button>
</form>`,
        mistake: "Using <a href=\"#\" onclick=\"action()\"> or <div onclick=\"action()\"> instead of a native button. This breaks default keyboard access and accessibility rules.",
        interview: "\"Use an anchor tag if the action navigates the user to a new URL, tab, or anchor link. Use a button if the click executes JavaScript, triggers a state mutation, or submits a form. Never choose based on CSS style.\"",
        diagram: `Semantic Choice Matrix:
┌───────────────────────┬──────────────────────┐
│ Intent                │ Recommended Tag      │
├───────────────────────┼──────────────────────┤
│ Redirects URL         │ <a href="...">       │
│ Triggers API Call     │ <button type="button">│
│ Submits Form Data     │ <button type="submit">│
│ Triggers Modal Open   │ <button type="button">│
└───────────────────────┴──────────────────────┘`,
        traps: [
          "Writing <code>&lt;a href=\"javascript:void(0)\"&gt;</code> or <code>href=\"#\"</code>. This is an anti-pattern. If clicking it performs an action rather than navigating, it must be a <code>&lt;button&gt;</code>.",
          "Using anchors for destructive actions like <code>/delete-user</code>. Search engine bots prefetch link targets, which can lead to accidental deletions."
        ],
        interviewQ: "Why is a <button> still correct to send 'POST /cart/items' even if it triggers an HTTP network request?"
      },
      {
        id: "form-behavior",
        title: "Native Form Behavior & Submissions",
        status: "done",
        analogy: "A mail delivery envelope. Putting items in the envelope and sealing it (submitting form) guarantees all inputs go to the destination together, rather than sending loose letters.",
        core: "Inside a <form>, buttons default to type='submit'. Pressing Enter inside inputs automatically triggers the submit button. Form controls support validation constraints (required, pattern) natively.",
        code: `<form action="/submit-signup" method="POST">
  <label for="email">Email:</label>
  <input type="email" id="email" required>
  
  <button type="submit">Sign Up</button>
  <button type="button" onclick="cancel()">Cancel</button>
</form>`,
        mistake: "Leaving a secondary button inside a form as <button> without setting type=\"button\". It will default to submit and reload the page on click.",
        interview: "\"Inside a form, a button defaults to type='submit' and intercepts the Enter key from inputs to trigger submit. Non-submit buttons must explicitly be declared as type='button' to prevent accidental form submission.\"",
        diagram: `Form Enter Key Press:
[ Input Field ] ──(Enter)──▶ [ Form Container ] ──▶ Triggers [ button type="submit" ]`,
        traps: [
          "Not setting <code>type=\"button\"</code> on secondary buttons inside forms. Clicking them will submit the form and refresh the page by default.",
          "Using custom JavaScript validation without fallback <code>required</code> fields, which can easily be bypassed by turning JS off in the browser."
        ],
        interviewQ: "Why does clicking a button inside a form submit the form, and how do you prevent a button from submitting a form?"
      },
      { id: "form-lifecycle", title: "Form Submission Lifecycle & FormData", status: "pending" },
      { id: "input-types", title: "Input Types & Form Elements (textarea, select, option, fieldset, legend, datalist)", status: "pending" },
      { id: "constraint-validation", title: "Constraint Validation API (required, pattern, readonly, disabled)", status: "pending" }
    ]
  }
);
