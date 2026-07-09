if (!window.TRACKER_DATA) window.TRACKER_DATA = [];

window.TRACKER_DATA.push(
  {
    batch: "Module 4 — Accessibility (A11y)",
    topics: [
      {
        id: "accessibility-tree",
        title: "The Accessibility Tree & ARIA Roles",
        status: "done",
        analogy: "A translator translating a written play into an audio description for a blind audience. The DOM is the script, and the Accessibility Tree is the translated description focusing on what actors do.",
        core: "Browsers parse DOM trees and map semantic nodes to native accessibility APIs. Assistive tech reads this tree. A <div> has a generic role (no description), whereas a <button> exposes Role='button', focusable=true, and its text content as Name.",
        code: `<!-- Bad: invisible role and states -->
<div class="custom-chk" onclick="toggle()"></div>

<!-- Good: semantic role and states -->
<input type="checkbox" id="agree" name="agree">
<label for="agree">I agree</label>

<!-- ARIA fallback for custom widget (only when absolutely necessary) -->
<div role="checkbox" aria-checked="false" tabindex="0" onclick="toggle()"></div>`,
        mistake: "Assuming ARIA attributes add functionality. ARIA only updates the description in the accessibility tree — you still have to manually implement keyboard handlers, focus, and state updates in JavaScript.",
        interview: "\"The Accessibility Tree is a subset of the DOM tree containing objects exposed to screen readers. Semantic elements automatically populate roles, names, and states in the tree, whereas generic elements require manual ARIA wiring.\"",
        diagram: `DOM Tree                  Accessibility Tree
┌──────────────┐          ┌───────────────────────┐
│ <button>Buy  │ ───────▶ │ Role: button,         │
└──────────────┘          │ Name: "Buy"           │
                          │ Focusable: true       │
                          └───────────────────────┘`,
        traps: [
          "ARIA rule #1: 'No ARIA is better than Bad ARIA'. Always use native elements (like <code>&lt;button&gt;</code> or <code>&lt;input&gt;</code>) first before trying to build custom widgets with ARIA roles.",
          "Adding <code>role=\"button\"</code> to a div without adding keyboard support. The role tells screen readers it is a button, but it won't react to the Enter or Space keys automatically."
        ],
        interviewQ: "What is the Accessibility Tree, and how does using semantic HTML help screen readers construct it?"
      },
      {
        id: "keyboard-focus",
        title: "Keyboard Accessibility & tabindex",
        status: "done",
        analogy: "A catalog with clear tabs vs one that requires searching page-by-page. Tabindex sets the custom index pointers so users can tab through interactive elements in order.",
        core: "Interactive tags are focusable by default. Custom components use tabindex. tabindex='0' adds an element to the normal tab order. tabindex='-1' removes it from tab sequence but allows JS focus(). tabindex > 0 is an anti-pattern.",
        code: `<!-- Focusable by default -->
<button>Click</button>

<!-- Custom component focusable in natural order -->
<div tabindex="0" class="custom-select">Select</div>

<!-- Removed from tab flow, but script-focusable -->
<dialog id="modal" tabindex="-1">Modal Dialog</dialog>`,
        mistake: "Using positive tabindex values (tabindex='1'). This overrides natural DOM sequence tab flow and leads to jumping focus order, confusing users.",
        interview: "\"tabindex='0' makes an element focusable in the natural DOM order. tabindex='-1' makes it focusable programmatically but hides it from Tab navigation. Positive values should be avoided to prevent broken tab sequences.\"",
        diagram: `Tab Navigation Flow:
Tab Press ──▶ [tabindex="0"] ──▶ [tabindex="0"] ──▶ [tabindex="-1"] (Skipped!)
                    │                                 ▲
                    └─────── (focus() via JS) ────────┘`,
        traps: [
          "Using positive <code>tabindex</code>. This forces the browser to prioritize those items first, regardless of layout, which breaks usability.",
          "Forgetting to capture focus inside modals. If a modal is open, pressing Tab should cycle focus inside the modal only, not escape to background controls."
        ],
        interviewQ: "What is the difference between tabindex='0' and tabindex='-1', and when would you use each?"
      },
      { id: "image-alt", title: "Image alt attributes (alt='' vs missing alt)", status: "pending" },
      { id: "screen-readers", title: "Screen Reader compatibility & Tab Order", status: "pending" }
    ]
  }
);
