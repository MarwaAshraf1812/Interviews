if (!window.TRACKER_DATA) window.TRACKER_DATA = [];

window.TRACKER_DATA.push(
  {
    batch: "Batch H — Engine Internals (Advanced)",
    topics: [
      {
        id: "v8-basics",
        title: "V8 Basics",
        status: "done",
        analogy: "Think of V8 (the JS engine inside Chrome and Node) like a translator who doesn't just translate word-by-word on the fly forever — they start translating quickly to keep the conversation moving, but if they notice the same phrase being repeated constantly, they memorize a faster, polished translation for it so future repeats are instant.",
        core: "JavaScript code (like console.log) isn't executed directly by the browser itself. V8 compiles JS source code into machine code that the CPU executes. To avoid startup delays, V8 uses a multi-tier system: first, a Parser builds an Abstract Syntax Tree (AST); next, the Ignition interpreter converts the AST into bytecode (a simpler form of the code that the engine understands) and runs it immediately. Only when code becomes 'hot' (called repeatedly, e.g. in loops) does the TurboFan optimizing compiler step in to recompile it into optimized machine code. If type assumptions are violated later, V8 deoptimizes and bails back to bytecode.",
        code: `// 1. Ignition interpreter runs bytecode immediately (quick startup)
function add(a, b) {
  return a + b;
}

// 2. add() becomes "hot" - TurboFan compiles to native machine code
for (let i = 0; i < 100000; i++) {
  add(i, i + 1); // V8 assumes: "this function always takes two numbers"
}

// 3. Type violation triggers Deoptimization (bails back to Ignition bytecode)
add("hello", "world");`,
        mistake: "Believing that JavaScript is purely an interpreted language, or that V8 compiles all code to optimized machine code from the start. Upfront optimization would cause massive startup lag, which is why V8 compiles most code to bytecode first and only optimizes hot paths.",
        diagram: `JS Code ──> V8 Engine [ Parser ──> AST ──> Ignition (Bytecode) ] ──> CPU executes
                                              ▲                     │
                                        Deopt │ (Type changed)      ▼
                                              └─────────────── TurboFan (Machine Code)`,
        traps: [
          "The browser does not execute JS directly; it delegates to V8, which outputs machine code for the CPU.",
          "Ignition outputs bytecode instead of machine code because most code runs once and does not justify the compilation cost.",
          "Why is JS fast despite being dynamic? JIT (Just-In-Time) compiler compiles hot code at runtime.",
          "Changing parameter types (e.g., number to string) on an optimized function forces deoptimization back to bytecode."
        ],
        interview: "V8 balances fast startup and execution speeds using JIT (Just-In-Time) compilation. Synchronous source code is parsed into an AST and interpreted by Ignition into bytecode, bypassing immediate machine code generation to avoid compilation overhead for cold paths. When telemetry identifies 'hot' functions (e.g. repeated loop invocations), TurboFan compiles them into optimized machine code, assuming type consistency. If those assumptions fail (such as passing strings to a function optimized for numbers), V8 triggers a deoptimization, discarding the native code and returning to interpreter bytecode execution.",
        interviewQ: "How does V8 balance fast startup time and fast execution speed using a multi-tiered compiler architecture, and what triggers a deoptimization?"
      },
      { id: "jit", title: "JIT Compilation", status: "pending" },
      { id: "hidden-classes", title: "Hidden Classes / Inline Caching", status: "pending" },
    ]
  }
);
