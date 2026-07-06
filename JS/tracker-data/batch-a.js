if (!window.TRACKER_DATA) window.TRACKER_DATA = [];

window.TRACKER_DATA.push(
  {
    batch: "Batch A — Core Mechanics",
    topics: [
      {
        id: "prim-ref",
        title: "Primitive vs Reference Types",
        status: "done",
        analogy: "A sticky note with a number on it (primitive) vs a locker key (reference). Copy the note, you get two independent notes. Copy the key, both keys open the same locker.",
        core: "Primitives (string, number, boolean, null, undefined, symbol, bigint) are stored by value on the stack. Objects/arrays/functions are stored on the heap — the variable on the stack just holds a pointer to that heap location.",
        code: "let a = 10;\nlet b = a;\nb = 20;\nconsole.log(a); // 10 — independent copy\n\nlet obj1 = { value: 10 };\nlet obj2 = obj1;\nobj2.value = 20;\nconsole.log(obj1.value); // 20 — same underlying object",
        mistake: "JS is ALWAYS pass-by-value — even for objects. What gets copied is the reference (pointer), not the object itself. Mutating a param follows the pointer and affects the original. Reassigning the param only redirects your local copy of the pointer — the original is untouched.",
        interview: "\"JS is pass-by-value, but for objects the value passed is a reference. Mutating follows the pointer to the same heap object. Reassigning just points the local variable elsewhere.\"",
        diagram: `Primitives live on the Stack:
┌─────────┐
│ a = 10  │
│ b = 10  │  (independent copies)
└─────────┘

Reference types: variable on Stack holds a POINTER to Heap:
Stack                Heap
┌───────────┐        ┌──────────────┐
│ obj1 ──────────────▶ { value: 10 }│
│ obj2 ──────────────▶      ▲       │
└───────────┘               │
                    both point to SAME object`,
        traps: [
          "JS is <b>always pass-by-value</b> — never pass-by-reference. For objects, the value passed is a reference (a memory address). Mutating a property (<code>user.name = 'x'</code>) follows that pointer and affects the original. Reassigning the parameter (<code>user = {...}</code>) only repoints your local copy — original is untouched.",
          "Say it as two separate ideas in an interview: (1) what gets copied — the reference, not the object, (2) why it matters — mutation follows the pointer, reassignment breaks it."
        ],
        interviewQ: "Why does mutating an object passed into a function affect the original, but reassigning that same parameter doesn't?"
      },
      {
        id: "coercion",
        title: "Type Coercion (implicit/explicit)",
        status: "done",
        analogy: "Like currency conversion at an airport kiosk — sometimes you ask for it (explicit), sometimes it just happens without asking (implicit).",
        core: "Explicit: Number('5'), String(123), Boolean(0). Implicit: '5' + 3, '5' - 3, if(value). The '+' operator triggers ToPrimitive() on both sides first — calls valueOf() then toString().",
        code: "\"5\" + 3;     // \"53\"  (string concat wins)\n\"5\" - 3;     // 2     (- forces numeric)\ntrue + true; // 2     (booleans -> 1/0)\n[] + [];      // \"\"    (both arrays -> \"\" via toString)\n\n// Only 8 falsy values:\n// false, 0, -0, 0n, \"\", null, undefined, NaN\nif ([]) {}    // TRUTHY — empty array is truthy!\nif (\"0\") {}   // TRUTHY — non-empty string",
        mistake: "'0', [], {} are all truthy despite feeling 'empty'. Also: null == undefined is true (spec special case) but null === undefined is false. Form validation and API checks break on this constantly.",
        interview: "\"Coercion is JS converting between types automatically via operators, vs explicitly via Number()/String()/Boolean(). The '+' operator is the trickiest since it can mean concatenation or addition depending on operand types.\"",
        diagram: `ToPrimitive(value):
  1. If already primitive → return as-is
  2. Call value.valueOf() → if primitive, return it
  3. Call value.toString() → return that
  4. If neither works → throw TypeError`,
        traps: [
          "<code>[] + {}</code> and <code>{} + []</code> give DIFFERENT results depending on position — because <code>{}</code> at the start of a statement is parsed as a code block, not an object literal.",
          "Falsy ≠ empty. <code>\"0\"</code>, <code>[]</code>, and <code>{}</code> are all truthy despite \"looking empty\" — a classic interview and real-bug source (form validation, API response checks)."
        ],
        interviewQ: "What's the difference between == and ===, and what happens step-by-step when you write '5' == 5?"
      },
      {
        id: "null-undefined",
        title: "The null == undefined Special Case",
        status: "done",
        analogy: "Two different ways of saying 'nothing here' — undefined is 'never given a value', null is 'deliberately emptied'. The spec lets them recognize each other as equal, but nothing else.",
        core: "This isn't derived from normal coercion rules — it's a hardcoded special case in the Abstract Equality Comparison Algorithm. They equal each other, but nothing else (like 0, false, or empty string).",
        code: "null == undefined;   // true — special rule, hardcoded in spec\nnull == 0;            // false — null is NEVER coerced to a number for ==\nnull == \"\";            // false\nnull == false;         // false\nundefined == 0;        // false\nNaN == null;            // false\n\n// Idiomatic shorthand used deliberately in real code (lodash etc.)\nif (value == null) { }\n// equivalent to:\nif (value === null || value === undefined) { }",
        mistake: "Assuming null behaves like 0 or false during loose comparison (null == 0 is false, even though Number(null) is 0). Also, confusing == and === results.",
        interview: "\"null == undefined returns true because the ECMAScript spec has a hardcoded rule stating that null and undefined are loosely equal to each other, and to nothing else. This makes 'value == null' a highly useful shorthand in production code to check for both null and undefined at once.\"",
        diagram: `Abstract Equality Comparison (x == y), simplified:
1. Same type → use === (strict)
2. x is null, y is undefined → true
3. x is undefined, y is null → true
4. number vs string → convert string to number
5. boolean → convert to number, re-run
6. object vs primitive → ToPrimitive(object), then compare
7. otherwise → false`,
        traps: [
          "<code>null == undefined</code> is <b>true</b>, but <code>null === undefined</code> is <b>false</b> — mixing these up is an instant red flag in interviews.",
          "This is one of the very few places senior devs deliberately use <code>==</code> instead of <code>===</code> — knowing WHY it's safe (it only ever matches null/undefined, nothing else) is what separates mid vs senior answers."
        ],
        interviewQ: "Why does null == undefined return true when null === undefined returns false — what's the real story?"
      },
      {
        id: "typeof-instanceof",
        title: "typeof / instanceof",
        status: "done",
        analogy: "typeof asks 'what category is this?' (quick label). instanceof asks 'does this thing's family tree include that ancestor?' (chain walk).",
        core: "typeof returns a string for primitives but can't distinguish null, arrays, and plain objects (all return 'object' — typeof null is a 44-year-old spec bug, never fixed for backward compatibility). instanceof walks the prototype chain checking for Constructor.prototype.",
        code: "typeof null;        // \"object\" (the famous bug)\ntypeof [];            // \"object\"\nArray.isArray([]);    // true — correct way to check arrays\n\nclass Animal {}\nclass Dog extends Animal {}\nconst d = new Dog();\nd instanceof Dog;     // true\nd instanceof Animal;  // true — walks the chain\n\"x\" instanceof String; // false — primitives aren't instances",
        mistake: "Using instanceof on primitives (always false). Relying on typeof to distinguish arrays from objects — use Array.isArray() instead.",
        interview: "\"typeof null returning 'object' is a bug baked into JS since 1995 — null was represented internally as the null pointer (0x00), which happened to be the same tag as objects. It was never fixed because fixing it would break the web.\"",
        diagram: `obj instanceof Constructor:
  → walk obj.__proto__ → obj.__proto__.__proto__ → ...
  → until Constructor.prototype is found in the chain, or hits null`,
        traps: [
          "<code>typeof null === \"object\"</code> is a 20+ year old bug in JS that was never fixed because fixing it would break the web (backward compatibility). Mentioning this unprompted signals real depth.",
          "Never use <code>instanceof</code> on primitives — it always returns false. Use <code>typeof</code> for primitives, <code>Array.isArray</code>/<code>instanceof</code> for objects."
        ],
        interviewQ: "Why does typeof null return 'object' if null isn't actually an object — what's the real story there?"
      },
      {
        id: "operators-precedence",
        title: "Operators & Precedence",
        status: "done",
        analogy: "Like PEMDAS in math class, but JS has way more operators competing for priority, and some care about direction (left-to-right vs right-to-left).",
        core: "Assignment is right-to-left (a = b = c evaluates b=c first). Most others are left-to-right. && and || short-circuit — the second operand never even runs if the first decides the outcome. ?? cannot be mixed with && / || without parentheses (SyntaxError by design).",
        code: "let a=1,b=2,c=3;\na = b = c;           // right-to-left: a=3, b=3, c=3\n2 - 3 - 1;            // left-to-right: (2-3)-1 = -2\n\nfalse && sideEffect(); // sideEffect() NEVER called\nuser && user.logout(); // classic guard pattern\n\nconst port = process.env.PORT ?? 3000;  // only falls back on null/undefined\nconst port2 = process.env.PORT || 3000; // ALSO falls back on \"0\" or \"\" — bug risk!",
        mistake: "Using || for defaults when 0, '', or false are valid values you want to keep — use ?? instead. Mixing ?? with && / || without parentheses throws a SyntaxError.",
        interview: "\"?? only falls back on null/undefined, while || falls back on any falsy value. For config defaults where 0 or empty string might be intentional, ?? is safer — || would incorrectly override a real value of 0.\"",
        diagram: null,
        traps: [
          "<code>??</code> cannot be mixed with <code>&&</code>/<code>||</code> without parentheses — this is an intentional spec restriction, not an oversight, because <code>||</code> checks falsy while <code>??</code> checks null/undefined only, and the designers didn't want silent ambiguity.",
          "<code>||</code> vs <code>??</code> for default values is a real production bug source: <code>PORT || 3000</code> incorrectly falls back even when <code>PORT</code> is legitimately <code>\"0\"</code> or <code>\"\"</code>. <code>??</code> only falls back on null/undefined."
        ],
        interviewQ: "Why would you choose ?? over || when setting a default config value, and when would using || instead cause a real bug?"
      },
      {
        id: "exec-context",
        title: "Execution Context (global vs function)",
        status: "done",
        analogy: "A workspace that gets set up BEFORE you start working — JS lays out your desk (memory), tools (functions), and decides what 'you' refers to (this) — all before execution even begins.",
        core: "Every execution context has 2 phases: Creation (variable environment set up — var hoisted as undefined, let/const hoisted into TDZ, functions fully hoisted, this determined, scope chain fixed) then Execution (code runs line by line, real values assigned). Global Execution Context (GEC) is created once. A new Function Execution Context (FEC) is created on EVERY function call and pushed onto the call stack (LIFO).",
        code: "console.log(a);   // undefined — hoisted, not yet assigned\nconsole.log(foo);  // [Function: foo] — fully hoisted\nvar a = 10;\nfunction foo(){ console.log(\"hi\"); }\n\nfunction outer(){\n  function inner(){ console.log(\"inner\"); }\n  inner();\n}\nouter();\n// 1. GEC pushed\n// 2. outer() FEC pushed\n// 3. inner() FEC pushed\n// 4. inner FEC popped\n// 5. outer FEC popped",
        mistake: "Thinking var and let/const 'hoist the same way'. var IS initialized to undefined during Creation Phase — accessing it early just gives undefined silently. let/const are hoisted but left UNINITIALIZED (Temporal Dead Zone) — accessing them early throws a ReferenceError BY DESIGN, to catch bugs early instead of letting you silently work with undefined.",
        interview: "\"Both var and let are hoisted — the engine knows they exist before execution. But var is hoisted AND initialized to undefined immediately. let/const are hoisted but left uninitialized — that gap is the TDZ, and accessing them there throws a ReferenceError on purpose, as a safety feature, not a limitation.\"",
        diagram: `Call Stack (LIFO — Last In, First Out):

           ┌─────────────────────┐
   top ──▶ │ foo() FEC            │  ← currently executing
           ├─────────────────────┤
           │ Global Execution     │  ← always at the bottom
           │ Context (GEC)        │
           └─────────────────────┘

When foo() finishes, its FEC is POPPED off the stack,
control returns to whatever called it.`,
        traps: [
          "<code>var</code> and <code>let</code>/<code>const</code> do NOT hoist the same way. <code>var</code> is hoisted AND initialized to <code>undefined</code> immediately — accessing it early silently gives <code>undefined</code>. <code>let</code>/<code>const</code> are hoisted but left <b>uninitialized</b> (the Temporal Dead Zone) — accessing them early throws a <code>ReferenceError</code>, by design, to catch bugs early instead of masking them with a silent <code>undefined</code>.",
          "Say \"uninitialized,\" never \"assigned undefined,\" when describing <code>let</code>/<code>const</code> in the TDZ — that exact wording is what interviewers listen for."
        ],
        interviewQ: "What's the difference between how var and let behave during the Creation Phase, and why does one throw an error when accessed early while the other doesn't?"
      },
      {
        id: "scope-chain",
        title: "Scope Chain (lexical scoping)",
        status: "done",
        analogy: "Nested rooms in a house. Standing in the kitchen and need salt — check the kitchen first, then the room containing it, then outside. JS looks up variables the same way, starting from where the code is WRITTEN, not where it's called from.",
        core: "Lexical (static) scoping means a function's scope chain is fixed at the moment it's DEFINED, based on its physical position in the source code — never based on who calls it. Lookup walks: own scope → immediately enclosing scope → ... → global scope, stopping at the FIRST match found.",
        code: "const value = \"global\";\n\nfunction first(){\n  console.log(value); // looks up lexically — where first() was WRITTEN\n}\nfunction second(){\n  const value = \"local to second\";\n  first(); // called from inside second()\n}\nsecond(); // logs \"global\" — NOT \"local to second\"\n\n// This is also exactly what makes closures possible:\nfunction makeAdder(x){\n  return function(y){ return x + y; }; // scope chain includes makeAdder's scope FOREVER\n}\nconst add5 = makeAdder(5);\nadd5(3); // 8",
        mistake: "Assuming scope depends on WHERE a function is called from (dynamic scoping) — JS doesn't work that way. A function's scope chain is locked in at definition time, permanently, regardless of the call site. This is the #1 trap people fall into with nested callbacks.",
        interview: "\"printX closes over the scope it was DEFINED in, not the scope it was called from. Even though run() has its own local x, printX never sees it — scope is lexical, determined by source-code position, not by the call stack.\"",
        diagram: `inner()'s [[Scope]] chain:
┌─────────────────────┐
│ inner's own scope    │  innerVar
├─────────────────────┤
│ outer's scope         │  outerVar
├─────────────────────┤
│ Global scope           │  globalVar
└─────────────────────┘

Lookup for outerVar inside inner():
  1. Check inner's own scope     → not found
  2. Check outer's scope (parent) → FOUND → stop here
  (never even reaches global — stops at first match)`,
        traps: [
          "Never assume scope depends on WHERE a function is <b>called</b> from (dynamic scoping) — JS doesn't work that way. A function's scope chain is locked in at <b>definition</b> time, permanently. This is the #1 trap with nested callbacks.",
          "Always narrate \"written vs. called from\" out loud in an interview — a bare correct answer with no reasoning reads as a guess even when it's right."
        ],
        interviewQ: "What will this log, and why — walk me through the scope chain lookup step by step? (let x='outer'; function printX(){console.log(x)}; function run(){let x='inner'; printX()}; run();)"
      },
      {
        id: "this-binding",
        title: "`this` Binding (all 5 rules)",
        status: "done",
        analogy: "Like the word 'I' in a sentence — its meaning depends entirely on WHO'S SPEAKING (how the function is called), not where the sentence is written. This is the opposite of lexical scoping, which is exactly why it trips people up.",
        core: "5 rules, priority order (highest wins): 1) new binding — this = newly created object. 2) Explicit binding (call/apply/bind) — this = whatever object you pass. 3) Implicit binding (obj.method()) — this = whatever is left of the dot. 4) Default binding (plain call) — this = global object (non-strict) or undefined (strict). 5) Arrow functions have NO own this at all — they skip this algorithm entirely and inherit this LEXICALLY from the enclosing scope, just like a normal variable lookup.",
        code: "function Person(name){ this.name = name; }\nconst p = new Person(\"Marwa\"); // Rule 1: new binding\n\nfunction greet(){ console.log(this.name); }\nconst user = { name: \"Marwa\" };\ngreet.call(user); // Rule 2: explicit — \"Marwa\"\n\nconst obj = {\n  name: \"Marwa\",\n  greet(){ console.log(this.name); }       // Rule 3: implicit — \"Marwa\"\n};\nobj.greet();\n\ngreet(); // Rule 4: default — this = global/undefined\n\nconst obj2 = {\n  name: \"Marwa\",\n  greet: () => console.log(this.name)      // Rule 5: arrow — inherits lexically\n};\nobj2.greet(); // undefined — NOT \"Marwa\"\n\n// Classic trap — losing 'this' as a callback\nsetTimeout(obj.greet, 100); // undefined! detached from obj\nsetTimeout(() => obj.greet(), 100);      // Fix 1\nsetTimeout(obj.greet.bind(obj), 100);    // Fix 2",
        mistake: "Passing obj.method as a bare reference (e.g. setTimeout(obj.greet, 100)) strips its connection to obj — by call time it's just a plain function call, so default binding kicks in and this is undefined/global. Also: arrow functions as object methods almost never do what people expect, since they capture this from the ENCLOSING scope at definition time, not the object they're attached to.",
        interview: "\"regularGreet logs 'Marwa' because it's called as obj.regularGreet() — implicit binding, this = obj. arrowGreet logs undefined because arrow functions have no own this — they inherit it lexically from the surrounding scope (the global scope here), completely ignoring how they're actually called.\"",
        diagram: `Determining 'this' for a function call, checked in order:
1. Called with new?              → this = new object
2. Called with call/apply/bind?  → this = explicitly passed object
3. Called as obj.method()?       → this = obj (left of the dot)
4. None of the above             → this = global/undefined (default)

Arrow functions SKIP this algorithm entirely —
they have no [[ThisMode]] of their own,
they look up 'this' via the ENCLOSING lexical scope,
exactly like a normal variable in the scope chain.`,
        traps: [
          "Passing <code>obj.method</code> as a bare reference (e.g. <code>setTimeout(obj.greet, 100)</code>) strips its connection to <code>obj</code> — by call time it's just a plain function call, so default binding kicks in and <code>this</code> becomes <code>undefined</code>/global.",
          "Arrow functions as object methods almost never do what people expect — they capture <code>this</code> from the ENCLOSING scope at definition time, not the object they're attached to."
        ],
        interviewQ: "What does this log, and why? (obj with regularGreet: function(){...} vs arrowGreet: () => {...}, both logging this.name)"
      },
      {
        id: "call-apply-bind",
        title: "call / apply / bind",
        status: "done",
        analogy: "A function is an actor who can play different roles depending on which 'character sheet' (this) you hand them. call, apply, and bind are three different ways of handing over that character sheet.",
        core: "call — invokes IMMEDIATELY, args passed individually. apply — invokes IMMEDIATELY, args passed as an array. bind — does NOT invoke immediately, returns a NEW function with this permanently locked in ('hard binding') — even later call/apply on the bound function can't override it. Memory trick: 'Apply = Array of args, Call = Comma-separated args.' bind is the odd one out — it manufactures a new function instead of calling anything.",
        code: "function introduce(greeting, punctuation){\n  console.log(`${greeting}, I'm \${this.name}\${punctuation}`);\n}\nconst user = { name: \"Marwa\" };\n\nintroduce.call(user, \"Hello\", \"!\");  // \"Hello, I'm Marwa!\"\nintroduce.apply(user, [\"Hi\", \".\"]);  // \"Hi, I'm Marwa.\"\n\nconst boundIntroduce = introduce.bind(user, \"Hey\");\nboundIntroduce(\"?\"); // \"Hey, I'm Marwa?\" — this locked in forever\n\n// Method borrowing\nconst arrayLike = { 0: \"a\", 1: \"b\", length: 2 };\nconst realArray = Array.prototype.slice.call(arrayLike);\n// [\"a\", \"b\"]\n\n// Fixing the 'this'-loss bug from last topic\nconst obj = { name: \"Marwa\", greet(){ console.log(this.name); } };\nsetTimeout(obj.greet.bind(obj), 100); // \"Marwa\" — locked in before detachment",
        mistake: "Forgetting that bind performs HARD binding — once a function is bound, nothing (not even a later call/apply on the bound function) can override its this. People also forget bind doesn't invoke the function immediately — it returns a brand new function you still need to call later.",
        interview: "\"call and apply invoke the function immediately — they differ only in how arguments are passed (individually vs as an array). bind doesn't invoke anything — it returns a new function with this permanently locked in, which is exactly what you want when passing a method as a callback that will be called later, detached from its original object.\"",
        diagram: `What bind() actually returns, conceptually:

Function.prototype.bind = function(context, ...boundArgs) {
  const originalFn = this;
  return function(...laterArgs) {
    return originalFn.apply(context, [...boundArgs, ...laterArgs]);
  };
};

Hard binding: once bound, nothing beats it —
not even calling .call()/.apply() on the bound function later.`,
        traps: [
          "bind performs hard binding — once a function is bound, nothing (not even a later call/apply on the bound function) can override its this. This is the one exception to the normal \"highest rule wins\" priority order.",
          "bind does NOT invoke the function immediately — it returns a brand new function you still have to call later. Confusing this with call/apply (which run immediately) is a common mix-up."
        ],
        interviewQ: "What's the key difference between bind and call/apply in terms of WHEN the function executes, and why would you reach for bind specifically over the other two?"
      }
    ]
  }
);
