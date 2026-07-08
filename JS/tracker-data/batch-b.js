if (!window.TRACKER_DATA) window.TRACKER_DATA = [];

window.TRACKER_DATA.push(
  {
    batch: "Batch B — Functions & Closures",
    topics: [
      {
        id: "closures",
        title: "Closures",
        status: "done",
        analogy: "A virtual backpack. When a function is created inside another, it packs a backpack containing all enclosing scope variables it might need later. It carries this backpack wherever it goes, even after the parent function has finished executing.",
        core: "A closure is the combination of a function bundled together with references to its surrounding lexical environment. Closures hold live references to variables, not copied values. Because of this, variables are kept alive in memory by the Garbage Collector as long as the closure exists.",
        code: "function createFunctions() {\n  const funcs = [];\n  for (let i = 0; i < 3; i++) {\n    funcs.push(() => console.log(i));\n  }\n  return funcs;\n}\nconst fns = createFunctions();\nfns.forEach(fn => fn()); // Logs: 0, 1, 2 (due to block-scoped let bindings)",
        mistake: "Forgetting that closures hold live references rather than copied snapshots. If a closed-over variable is mutated (like a shared loop variable declared with var, or state mutations in React), all closures referencing it will read the mutated value.",
        interview: "\"A closure is formed when an inner function retains access to variables from its outer function's scope, even after the outer function has finished executing. Closures hold live references to these variables, keeping them alive in memory instead of being garbage collected.\"",
        diagram: `Outer Function Scope [ i = block-scoped value ]
┌──────────────────────────────────────────────┐
│                                              │
│  Inner Function (Closure)                    │
│  ┌────────────────────────────────────────┐  │
│  │  [[Scope]] ──▶ Enclosing Scope         │  │
│  │                (keeps live references) │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘`,
        traps: [
          "The classic <code>var</code> + loop bug: <code>for(var i=0;i&lt;3;i++){ setTimeout(()=&gt;console.log(i),100) }</code> logs <b>3,3,3</b> — not 0,1,2 — because <code>var</code> is function-scoped, so there's only ONE shared <code>i</code>, and by the time callbacks fire the loop has finished (<code>i=3</code>).",
          "Fix: use <code>let</code> — block-scoped, creates a <b>new binding per iteration</b> — each closure captures its own snapshot of <code>i</code>. Pre-ES6 fix: wrap in an IIFE to manually create a new scope per iteration.",
          "Closures hold a <b>live reference</b>, not a copied value — if the outer variable changes later, the closure sees the updated value, it never 'snapshots' at creation time.",
          "Stale closures in React (<code>useState</code>/<code>useEffect</code>) are a direct real-world consequence of this mechanism."
        ],
        interviewQ: "Without running it — what does this log, and why? (createFunctions() pushing arrow fns with let i in a loop)"
      },
      {
        id: "iife",
        title: "IIFEs",
        status: "done",
        analogy: "A disposable camera. You click the button, it takes the photo immediately, performs its one task, and cannot be reused or reloaded.",
        core: "An Immediately Invoked Function Expression runs immediately upon creation. Wrapping the function keyword in parentheses changes the parsing context from a statement (which would expect a name for a declaration) to an expression, which is allowed to be anonymous.",
        code: "// IIFE (valid anonymous function expression, invoked immediately)\n(function() {\n  console.log(\"IIFE executed!\");\n})();\n\n// Throws SyntaxError\n// function() {}();",
        mistake: "Thinking IIFEs can be called multiple times. They are invoked immediately and discard their name/reference after running (unless returned values are assigned).",
        interview: "\"Wrapping a function in parentheses forces the parser to treat it as an expression instead of a declaration. Expressions don't need a name, so the trailing parentheses can invoke it immediately. This executes once, immediately, and creates a private scope.\"",
        diagram: `Syntax Parsing Phase:
function() {}();
▲
└── Token "function" at start -> Expects Declaration Name -> SyntaxError!

(function() {})();
▲
└── Token "(" starts expression context -> Anonymous function valid -> Executed!`,
        traps: [
          "<code>function(){...}()</code> alone throws a <b>SyntaxError</b> — the parser sees <code>function</code> at the start of a statement and expects a named <b>declaration</b>. The error happens at the declaration itself, BEFORE the trailing <code>()</code> is even reached.",
          "Wrapping in parentheses <code>(function(){...})()</code> forces the parser to treat it as an <b>expression</b> instead of a declaration — expressions don't need a name, so the trailing <code>()</code> can now validly invoke it.",
          "IIFEs run <b>once, immediately</b> — they are NOT reusable like a normal function. This was the pre-ES6 way to fake private scope (the Module Pattern) before real modules/block-scoping existed."
        ],
        interviewQ: "Why does wrapping a function declaration in parentheses make it valid to invoke immediately, when function(){...}() throws a SyntaxError?"
      },
      {
        id: "currying",
        title: "Currying",
        status: "done",
        analogy: "A vending machine that takes coins one at a time — inserting the first coin returns a slot for the second, and only when all coins are in does it dispense your snack.",
        core: "Currying transforms a function of N arguments into a chain of N unary functions (each taking exactly one argument). It works by using chained closures, accumulating parameters in the enclosing scopes.",
        code: "const curriedAdd = a => b => c => a + b + c;\nconsole.log(curriedAdd(1)(2)(3)); // 6\n\n// Generic curry helper\nfunction curry(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) {\n      return fn.apply(this, args);\n    }\n    return (...moreArgs) => curried(...args, ...moreArgs);\n  };\n}",
        mistake: "Confusing currying with partial application. Currying always creates a chain of single-argument (unary) functions. Partial application pre-fills some arguments but can return a function taking multiple arguments.",
        interview: "\"Currying is the transformation of a multi-argument function into a nested chain of single-argument functions. Under the hood, it's a structured application of closures where each returned function preserves a live reference to the arguments received so far.\"",
        diagram: `curriedAdd(1) ──▶ Returns fn(b) [Closure: a = 1]
  └── (2)     ──▶ Returns fn(c) [Closure: a = 1, b = 2]
       └── (3)──▶ Evaluates: 1 + 2 + 3 = 6`,
        traps: [
          "Currying is really just <b>chained closures</b> — each returned function closes over all arguments captured so far. Always connect currying back to closures explicitly in an interview; that's the concept being tested, not just 'does the math work.'",
          "Currying ≠ partial application. Currying <b>always</b> transforms an n-arg function into a chain of unary (single-arg) functions. Partial application just means 'pre-fill some args' — can happen without full currying.",
          "Redux's <code>connect(mapStateToProps)(MyComponent)</code> is a real-world curried function — good concrete example to cite."
        ],
        interviewQ: "Given const curriedAdd = a => b => c => a+b+c — walk through what curriedAdd(1) returns, and why it still has access to a when called with (2)(3)?"
      },
      {
        id: "hof",
        title: "Higher-Order Functions",
        status: "done",
        analogy: "A general manager who delegates. They don't do the coding or sales themselves — they take specialists (callbacks) and feed them resources to get results.",
        core: "A higher-order function is any function that accepts another function as an argument, returns a function, or both. Array methods like map, filter, and reduce are classic built-in HOFs.",
        code: "const nums = [1, 2, 3];\nconst doubled = nums.map(n => n * 2); // map is HOF, callback is plain function\n\n// Custom HOF returning a function\nconst multiplier = factor => num => num * factor;",
        mistake: "Forgetting that map/filter/reduce do not mutate the original array, but return new arrays instead. Also, mistaking the callback passed to map for the HOF.",
        interview: "\"A Higher-Order Function is a function that either takes a function as an argument, returns a function, or both. For example, map is a HOF because it accepts a callback, but the callback itself is usually a plain function.\"",
        diagram: `[1, 2, 3] ──▶ map (HOF) ──▶ [Applies Callback (n => n*2)] ──▶ New Array [2, 4, 6]`,
        traps: [
          "<b>map is the HOF, not the callback.</b> A HOF is a function that takes a function as an argument, returns a function, or both. <code>map</code> accepts your callback → map is the HOF. The callback (e.g. <code>n=&gt;n*2</code>) just takes/returns numbers — it's a plain function, not a HOF.",
          "Tricky exception: if the callback passed to <code>map</code> itself <b>returns a function</b> (e.g. <code>n =&gt; (x =&gt; x+n)</code>), then that callback IS also a HOF — but this isn't true in general, most callbacks are plain functions.",
          "<code>map</code>/<code>filter</code>/<code>reduce</code> all return <b>new arrays</b> — they never mutate the original. Forgetting to capture the return value is a common bug."
        ],
        interviewQ: "Is array.map() itself a higher-order function, or is the callback passed into it the HOF? Explain the distinction."
      },
      {
        id: "composition",
        title: "Function Composition",
        status: "done",
        analogy: "An assembly line. Raw steel goes in, is molded by machine 1, painted by machine 2, and packed by machine 3. The output of one feeds directly as input to the next.",
        core: "Function composition is the process of combining multiple functions to create a new one. The data flows through the functions sequentially. compose evaluates right-to-left, whereas pipe evaluates left-to-right.",
        code: "const double = x => x * 2;\nconst inc = x => x + 1;\n\nconst compose = (...fns) => val => fns.reduceRight((acc, fn) => fn(acc), val);\nconst pipe = (...fns) => val => fns.reduce((acc, fn) => fn(acc), val);\n\nconsole.log(compose(inc, double)(5)); // inc(double(5)) = 11\nconsole.log(pipe(double, inc)(5));    // inc(double(5)) = 11",
        mistake: "Confusing compose (right-to-left) with pipe (left-to-right). Getting the order wrong will lead to different outputs or errors without throwing syntax issues.",
        interview: "\"Function composition chains functions together, routing the output of one to the input of the next. compose evaluates from right to left using reduceRight, mirroring math notation a(b(c(x))), whereas pipe evaluates from left to right using reduce.\"",
        diagram: `compose(a, b, c)(x)  ──▶ [c] ──▶ [b] ──▶ [a] ──▶ Output
                         (right-to-left)
pipe(a, b, c)(x)     ──▶ [a] ──▶ [b] ──▶ [c] ──▶ Output
                         (left-to-right)`,
        traps: [
          "<code>compose</code> runs <b>right-to-left</b> (built on <code>reduceRight</code>) — <code>compose(a,b,c)(x)</code> runs <b>c first</b>, then b, then a. Mirrors math notation <code>a(b(c(x)))</code>: read left-to-right, evaluate right-to-left, innermost first.",
          "<code>pipe</code> is the same mechanism but <b>left-to-right</b> (built on plain <code>reduce</code>) — easy to mix up which one runs which direction; picking the wrong one silently changes execution order with no error.",
          "Both compose/pipe are themselves built using <code>reduce</code>/<code>reduceRight</code> — a HOF folding an array of functions into one function."
        ],
        interviewQ: "Using compose(a, b, c)(x) — which function runs first, and why?"
      },
      {
        id: "memoization",
        title: "Memoization",
        status: "done",
        analogy: "A chef with a refrigerator. If you order a complex dish, the chef makes it and puts a portion in the fridge. The next time someone orders the same dish, they serve it straight from the fridge in seconds.",
        core: "Memoization is an optimization technique that caches function results based on inputs. It uses closures to maintain a private cache Map. It is only safe for pure functions.",
        code: "function memoize(fn) {\n  const cache = new Map();\n  return function(...args) {\n    const key = JSON.stringify(args);\n    if (cache.has(key)) return cache.get(key);\n    const res = fn.apply(this, args);\n    cache.set(key, res);\n    return res;\n  };\n}",
        mistake: "Memoizing functions that have side effects (impure) or dynamic external state dependencies. Also, neglecting memory leaks from unbounded growing cache maps.",
        interview: "\"Memoization caches pure function outputs based on their arguments using a closure-scoped cache. It trades memory space to reduce time complexity. It fails on impure functions since same inputs could have changing outputs.\"",
        diagram: `f(5) ──▶ [Cache Map] ──▶ Hit? ──▶ Return Cached Value
              │
              └── Miss? ──▶ Compute fn(5) ──▶ Save to Map ──▶ Return Value`,
        traps: [
          "Only works correctly on <b>pure functions</b> — same input must always produce the same output. Memoizing something with side effects or non-deterministic output (<code>Math.random()</code>, live API calls) will silently return stale/wrong cached results.",
          "Unbounded caches can cause <b>memory leaks</b> in long-running apps — production memoization typically needs size limits or expiry (LRU cache), not an infinitely growing Map.",
          "Memoization is just closures again — the returned function closes over the cache object, keeping it alive across calls, exactly like a counter closure.",
          "Classic example to know cold: naive recursive Fibonacci is exponential time (recalculates same values repeatedly); memoized Fibonacci is linear time."
        ],
        interviewQ: "Why does memoization only work correctly on pure functions, and what real bug would you get if you memoized an impure one?"
      }
    ]
  }
);
