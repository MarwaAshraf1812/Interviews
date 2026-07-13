if (!window.TRACKER_DATA) window.TRACKER_DATA = [];

window.TRACKER_DATA.push(
  {
    batch: "Batch D — Modern Syntax & Data",
    topics: [
      {
        id: "template-literals",
        title: "Template Literals",
        status: "done",
        analogy: "Think of old-school string concatenation like assembling a sentence with duct tape — piece, tape, piece, tape. Template literals are like writing the full sentence naturally, then just dropping blanks (${}) wherever a variable belongs — no tape required.",
        core: "Before ES6, building dynamic strings meant chaining + operators — verbose, error-prone with types, and painful for multi-line strings. Template literals resolve this by using backticks (`) and expression nesting inside ${}. They also support 'Tagged Templates' where a function prefix intercepts and processes the literal segments and expression values.",
        code: `// Basic Usage & Interpolation
const name = "Marwa";
const age = 26;
const greeting = \`Hello, \${name}! You are \${age} years old.\`;

// Multi-line Strings
const multiline = \`Line 1
Line 2
Line 3\`;

// Tagged Template Literal Definition
function highlight(strings, ...values) {
  // strings is an array of literal strings: ["Hello, ", "! Welcome."]
  // values is an array of evaluated expressions: ["Marwa"]
  return strings.reduce((result, str, i) => {
    const val = values[i] !== undefined ? \`**\${values[i]}**\` : '';
    return \`\${result}\${str}\${val}\`;
  }, '');
}

const taggedResult = highlight\`Hello, \${name}! Welcome.\`;
console.log(taggedResult); // "Hello, **Marwa**! Welcome."`,
        mistake: "Forgetting to use backticks (`) and using single or double quotes instead ('Hello, \${name}' will output the literal string '\${name}' because quotes do not support interpolation). Also, placing raw user input directly inside HTML template literals opens the door to Cross-Site Scripting (XSS) security vulnerabilities.",
        interview: "Template literals use backticks to allow clean multi-line strings and expression interpolation via \${} syntax. A more advanced feature is tagged templates, which let you prefix the literal with a function. This function receives an array of static string pieces and a list of evaluated expression values, allowing you to custom-process or sanitize the inputs, which is used by libraries like styled-components or for SQL injection prevention.",
        diagram: `Tagged Template Call: highlight\`Hello, \${name}! Welcome.\`

Parser splits string pieces from expressions:
1. strings array:  ["Hello, ", "! Welcome."]
2. values array:   ["Marwa"]

Function call under the hood:
highlight(["Hello, ", "! Welcome."], "Marwa")`,
        traps: [
          "Using single/double quotes instead of backticks is a classic typo that breaks expression evaluation, rendering <code>\${var}</code> as a literal string.",
          "Implicit type conversion when embedding complex objects inside template literals: <code>\`\${obj}\`</code> will evaluate to <code>\"[object Object]\"</code> unless the object implements a custom <code>toString()</code> method.",
          "Security risk: interpolating unsanitized user-generated data directly into HTML template literals creates a severe Cross-Site Scripting (XSS) vulnerability. Tagged templates are the built-in solution to sanitize strings before they are rendered."
        ],
        interviewQ: "What are tagged template literals under the hood, how do they work, and what is a practical real-world use case for them in modern frameworks?"
      },
      {
        id: "modules",
        title: "Modules (ESM vs CommonJS)",
        status: "done",
        analogy: "Think of CommonJS like ordering food and waiting at the counter until it's ready (synchronous, blocking). ESM is like ordering food with a buzzer — you can keep doing other things, and get notified when it is ready (async, non-blocking).",
        core: "Before any module system, JS had no built-in way to split code across files with proper scoping. CommonJS (Node's original system) handles module loading synchronously at runtime, returning a copied snapshot of exported values. ES Modules (ESM) resolve imports asynchronously at compile-time, creating live references (bindings) to the exported variables. ESM's static structure is what allows modern build tools to perform tree-shaking.",
        code: `// CommonJS (Node.js)
// counter.cjs
let count = 0;
function increment() { count++; }
module.exports = { count, increment }; // copies value at export time

// app.cjs
const { count, increment } = require('./counter.cjs');
increment();
console.log(count); // still 0! (Snapshot copy didn't change)

// ES Modules (Modern)
// counter.mjs
export let count = 0;
export function increment() { count++; }

// app.mjs
import { count, increment } from './counter.mjs';
increment();
console.log(count); // 1 (Live reference link updated!)`,
        mistake: "Mixing require() and import in the same file without a compiler (throws SyntaxError in raw Node.js environment). Also, expecting CommonJS exports to be updated dynamically when the module's internal state changes (it is a static copy, not a live reference).",
        interview: "CommonJS resolves modules synchronously at runtime by executing the required file and exporting a copied snapshot object. ES Modules load modules asynchronously and resolve references at compile-time, setting up live bindings. This compile-time static analysis enables tree-shaking because imports and exports cannot be changed dynamically at runtime, unlike CommonJS where require() can be called conditionally inside functions.",
        diagram: `CommonJS (Runtime): require('./file') -> Executes file -> Returns copied object snapshot
ESM (Compile-time): import {x} -> Parses tree -> Sets up live read-only pointer to exporter's scope`,
        traps: [
          "Top-level 'this' differences: 'this' is module.exports in CommonJS, but undefined in ES Modules.",
          "Attempting to modify an imported ESM binding directly (e.g. count = 5) will throw a TypeError: Assignment to constant variable, since ESM exports are read-only to the importer.",
          "Dynamic imports: ESM's import() returns a Promise, unlike CommonJS's require() which is completely synchronous."
        ],
        interviewQ: "What is the difference between ES Modules and CommonJS regarding how they resolve exports, when they load them, and why does this difference enable tree-shaking?"
      },
      {
        id: "generators",
        title: "Generators & Iterators",
        status: "done",
        analogy: "Think of a normal function like a water slide — once you start, you go all the way to the bottom without stopping. A generator is like a flight of stairs with landings (yields) — you step down to a landing, pause for as long as you want, and only continue to the next step when you explicitly choose to.",
        core: "Generators are functions that can pause and resume execution using the yield keyword. Calling a generator function does not execute its body; instead, it returns an Iterator object. The code inside only runs when .next() is called, which returns an object { value: ..., done: ... } and suspends the function's execution context. This suspension allows generators to model infinite sequences safely and form the foundation of async/await patterns.",
        code: `// Generator function definition
function* numberGenerator() {
  let i = 0;
  while (true) {
    yield i++;
  }
}

const iterator = numberGenerator();
console.log(iterator.next()); // { value: 0, done: false }
console.log(iterator.next()); // { value: 1, done: false }

// Custom iterable object implementing Symbol.iterator
const customIterable = {
  [Symbol.iterator]() {
    let step = 0;
    return {
      next() {
        step++;
        if (step <= 3) {
          return { value: step, done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
};

for (const val of customIterable) {
  console.log(val); // 1, 2, 3
}`,
        mistake: "Calling a generator function and expecting its code to execute immediately without calling .next(). Also, using an infinite while(true) loop inside a generator without a yield statement, which will lock the thread just like a normal function.",
        interview: "A normal function executes synchronously to completion on the call stack. A generator function pauses execution, yielding control back to the caller and saving its current state (stack frame/execution context) in memory. Hitting a yield suspends the generator, and calling .next() resumes it from that exact point. Generators implement the Iterator protocol, returning objects with value and done properties, making them natively compatible with for...of loops.",
        diagram: `Generator Call() ──> Returns Iterator Object (Paused)
  ├── iterator.next() ──> Resumes context ──> Executes to next yield ──> Pauses & returns { value, done: false }
  ├── iterator.next() ──> Resumes context ──> Reaches return/end ──> Returns { value: undefined, done: true }`,
        traps: [
          "Calling a generator function does not execute its body; it only initializes the iterator. Nothing runs until .next() is invoked.",
          "Each .next() call executes until it encounters a yield statement, then suspends the entire execution context (stack, local variables) in memory.",
          "Infinite loops like while(true) are completely safe inside generators only because yield suspends execution step-by-step; omitting yield inside the loop will crash the thread.",
          "Generators implement both the Iterable and Iterator protocols. They have a [Symbol.iterator] method that returns this, allowing them to be consumed by for...of loops directly."
        ],
        interviewQ: "Why can't you write an infinite while(true) loop inside a normal function without crashing, but you can inside a generator? What is fundamentally different about execution?"
      },
      {
        id: "symbol-optional",
        title: "Symbol, Optional Chaining, Nullish Coalescing",
        status: "done",
        analogy: "Symbol is like a one-of-a-kind security badge — even if two badges have the same name, they are physically different and never clash. Optional Chaining (?.) is like checking if a door exists before running through it. Nullish Coalescing (??) is a smart safety net that only catches missing things (null/undefined), letting safe falsy values pass.",
        core: "Symbols provide guaranteed unique property keys, preventing key collision bugs and hiding properties from normal Object.keys() enumeration. Optional chaining (?.) short-circuits evaluation if the left side is null or undefined, returning undefined instead of throwing a TypeError. Nullish coalescing (??) provides a fallback value only when the left expression evaluates specifically to null or undefined, protecting falsy values like 0 or empty strings.",
        code: `// Symbol Unique Keys
const id1 = Symbol("user");
const id2 = Symbol("user");
const user = { name: "Marwa", [id1]: "Metadata 1", [id2]: "Metadata 2" };
console.log(user[id1]); // "Metadata 1"
console.log(Object.keys(user)); // ["name"] (Symbol keys skipped)

// Optional Chaining & Nullish Coalescing
const profile = { name: "Marwa", age: 0 };
console.log(profile?.address?.city); // undefined (No TypeError)
console.log(profile?.age ?? 18); // 0 (age is defined as 0, not overridden)
console.log(profile?.age || 18); // 18 (OR operator treats 0 as falsy and overrides!)`,
        mistake: "Confusing optional chaining (?.) with general error-suppression for non-nullish issues (it only guards against null/undefined, not syntax errors or reference errors of undefined variables). Also, using || instead of ?? which accidentally overrides valid 0 or empty string values in configurations.",
        interview: "Optional chaining (?.) stops evaluation and returns undefined if the value on its immediate left is null or undefined. Nullish coalescing (??) returns its right-hand operand only if the left-hand operand is null or undefined. Symbols create guaranteed unique primitives, primarily used to avoid property collisions on objects or implement well-known protocols like Symbol.iterator.",
        diagram: `Expression: obj?.prop
  ├── If obj is null/undefined ──> returns undefined (short-circuits)
  └── Else ──> returns obj.prop

Expression: val ?? fallback
  ├── If val is null/undefined ──> returns fallback
  └── Else ──> returns val (even if 0, false, or "")`,
        traps: [
          "Chaining over missing indices: items?.[0]?.name where items is [] returns 'Unknown' with ?? fallback because accessing index 0 on an empty array returns undefined, causing the next ?. to short-circuit.",
          "Symbols throw TypeErrors on implicit string coercions (e.g. \`\${Symbol('id')}\`). You must explicitly call String(sym) or sym.toString().",
          "Optional chaining cannot be used on the left-hand side of assignments (e.g. user?.name = 'Marwa' throws a SyntaxError)."
        ],
        interviewQ: "Given the expression 'const val = obj?.data?.items?.[0]?.name ?? \"Unknown\"', trace what happens if obj.data.items is an empty array [], and explain why ?? triggers."
      },
      {
        id: "mutating-methods",
        title: "Mutating vs Non-mutating Array Methods",
        status: "done",
        analogy: "Mutating is like editing a shared Google Doc directly — the original changes for everyone. Non-mutating is like copying the document first and editing the copy — the original remains untouched.",
        core: "Arrays are reference types in JavaScript. Mutating methods modify the original array in-place, which can cause side-effects if references are shared. Non-mutating methods return a new array instance containing the changes, leaving the original array intact. This is critical for frameworks like React where state updates require new object references to detect changes.",
        code: `const list = [10, 2, 33, 4];

// Mutating example (sort mutates original!)
const sortedMutated = list.sort((a, b) => a - b);
console.log(list); // [2, 4, 10, 33] (Original was changed!)

// Non-mutating alternative (slice creates copy first)
const original = [10, 2, 33, 4];
const sortedCopy = [...original].sort((a, b) => a - b);
console.log(original); // [10, 2, 33, 4] (Original is safe!)`,
        mistake: "Forgetting that sort() mutates the array in-place. Additionally, sorting numeric arrays without a comparator (e.g. [10, 2].sort()) which converts them to strings and sorts lexicographically, ordering 10 before 2.",
        interview: "Mutating methods like sort, reverse, splice, push, pop, shift, and unshift modify the original array in memory. Non-mutating methods like map, filter, concat, slice, and reduce return a new array reference. When sorting numerically, always pass a comparator (a, b) => a - b, because the default sort converts values to strings and compares their Unicode code points.",
        diagram: `Original Array ──> [10, 2]
  ├── sort() ──> Mutates same array ──> [2, 10]
  └── [...orig].sort() ──> Creates new array ref ──> [2, 10] (Orig untouched)`,
        traps: [
          "sort() default sorting lexicographically: [10, 2, 33, 4].sort() results in [10, 2, 33, 4] because '1' < '2' as character codes.",
          "Accidentally mutating props or state in React/Redux by calling mutating methods directly (e.g. list.push(item) instead of [...list, item]).",
          "Splice vs Slice: splice() is mutating and removes items; slice() is non-mutating and copies items."
        ],
        interviewQ: "Explain why calling [10, 2, 33, 4].sort() returns an unexpected order, how you correct it, and why mutating methods cause bugs in React state."
      },
      {
        id: "immutability",
        title: "Immutability Patterns",
        status: "done",
        analogy: "Immutability is like placing tracing paper over a photo instead of drawing directly on it. You get a new sheet with your drawings, but the original photo remains untouched.",
        core: "React and Redux rely on reference equality checks (Object.is) to determine if state has changed. Immutability patterns ensure that when state is updated, a new object reference is created. Spreading objects and arrays is the standard pattern, but spread only performs shallow copying. Nested objects require spreading at every level of modification, or deep cloning via structuredClone().",
        code: `// Shallow spread updates
const state = { user: { name: "Marwa", address: { city: "Giza" } } };

// Correct immutable nested update (spreading at every level)
const updatedState = {
  ...state,
  user: {
    ...state.user,
    address: {
      ...state.user.address,
      city: "Cairo"
    }
  }
};

// Deep cloning alternative
const deepClone = structuredClone(state);
deepClone.user.address.city = "Cairo"; // Safe from mutating original`,
        mistake: "Assuming spread operator {...state} creates a deep clone. It only creates a new reference for the top-level keys. If state.user is an object, copy.user still points to the original user reference, leading to accidental state mutations.",
        interview: "Immutability prevents side-effects in shared state and enables fast reference-based change detection (===). Spread operators {...obj} only perform shallow copying, leaving nested objects pointing to the same memory references. To update nested state immutably, we must spread each level of the tree that is being modified, or use structuredClone() for deep copies.",
        diagram: `state ───────> { user: Ref A } ──> { address: Ref B } ──> { city: "Giza" }
updatedState ─> { user: Ref C } ──> { address: Ref D } ──> { city: "Cairo" }
  (Ref A !== Ref C, Ref B !== Ref D)`,
        traps: [
          "Thinking shallow spread is a deep clone: changing copy.user.address.city on a shallow-copied object mutates the original state directly.",
          "React state updates failing to trigger re-renders because state was mutated in-place before calling setState(state).",
          "structuredClone() cannot clone functions, Symbol properties, or DOM nodes, throwing an error if attempted."
        ],
        interviewQ: "Why does a shallow copy {...state} fail to protect nested objects from mutation, and how do you immutably update a nested property in React state?"
      },
      {
        id: "array-like",
        title: "Array-like Objects vs True Arrays",
        status: "done",
        analogy: "A true array is a valid passport — it gives you all the rights and access to travel methods. An array-like object is a paper printout that looks like a passport (has a picture, index, and says 'passport'), but lacks the official rights and methods (like map or filter) to actually do anything.",
        core: "Array-like objects have numeric indices and a .length property, but they do not inherit from Array.prototype. Therefore, they lack methods like forEach, map, filter, and reduce. Examples include arguments, NodeList, and HTMLCollection. They must be converted to true arrays (using Array.from(), spread syntax [...], or Array.prototype.slice.call()) to use these methods.",
        code: `const arrayLike = { 0: "a", 1: "b", length: 2 };

// This throws TypeError: arrayLike.map is not a function
// arrayLike.map(x => x.toUpperCase());

// Conversion Method 1: Array.from (Works on all array-likes and iterables)
const arr1 = Array.from(arrayLike);
console.log(arr1.map(x => x.toUpperCase())); // ["A", "B"]

// Conversion Method 2: Spread (Throws on plain array-likes without [Symbol.iterator])
try {
  const arr2 = [...arrayLike];
} catch (err) {
  console.log(err.message); // "arrayLike is not iterable"
}

// To spread, it must implement Symbol.iterator:
const iterableArrayLike = {
  0: "a",
  1: "b",
  length: 2,
  [Symbol.iterator]: Array.prototype[Symbol.iterator]
};
const arr3 = [...iterableArrayLike]; // Works! ["a", "b"]`,
        mistake: "Assuming that you can use the spread operator [...] on any object with a .length and numeric keys. The spread operator relies strictly on the Iterable Protocol (Symbol.iterator). If that is missing, it throws a TypeError. Array.from() does not have this restriction; it falls back to index-based access using .length.",
        interview: "Array-like objects have numeric keys and a length property but do not inherit from Array.prototype. Spread syntax ([...obj]) requires the object to implement Symbol.iterator, throwing a TypeError on plain array-likes. Array.from() works on both because it has a fallback: if the iterator is missing, it reads the length property and loops through the numeric indices manually to build a real array.",
        diagram: `             Object to Convert
                    │
          Does it implement [[Symbol.iterator]]?
               /        \\
             YES         NO
             /            \\
  [...obj] Works       [...obj] throws TypeError
  Array.from(obj)      Does it have .length?
  Works                  /        \\
                       YES         NO
                       /            \\
           Array.from(obj) works    Array.from(obj)
           via index-lookup         returns empty array`,
        traps: [
          "Thinking you can spread any array-like object. Plain array-likes (like jQuery objects or custom length-based objects) without <code>[Symbol.iterator]</code> will throw <code>TypeError: object is not iterable</code> when spread.",
          "<code>Array.from()</code> uses a fallback checking the <code>.length</code> property. If an array-like has a <code>length</code> of <code>2</code> but only contains index <code>0</code>, index <code>1</code> in the resulting array will be <code>undefined</code>."
        ],
        interviewQ: "Why does the spread operator [...] fail on a plain array-like object (like { 0: 'a', length: 1 }) while Array.from() succeeds, and what protocol controls this difference?"
      }
    ]
  }
);
