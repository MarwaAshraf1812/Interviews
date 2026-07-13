if (!window.TRACKER_DATA) window.TRACKER_DATA = [];

window.TRACKER_DATA.push(
  {
    batch: "Batch G — Error Handling",
    topics: [
      {
        id: "custom-errors",
        title: "Custom Error Classes",
        status: "done",
        analogy: "Custom Error Classes are like specialized medical warning tags. Instead of a generic tag that just says 'Problem' (a base Error class), you have tags like 'CardiacAlert' or 'AllergyAlert' (custom error classes). This lets medical staff immediately know the type of emergency and route the patient to the right specialist (catch block) without having to read a long message, while still retaining the patient's full medical history (call stack).",
        core: "Custom error classes allow developer-defined error types by extending the built-in Error class using ES6 class inheritance (extends and super). This provides clean type identification via the instanceof operator, allowing catch blocks to filter and handle different categories of errors distinctly, while retaining native error behaviors like stack trace capturing.",
        code: `class DatabaseError extends Error {
  constructor(message, query) {
    super(message); // Sets up message and stack
    this.name = 'DatabaseError'; // Overrides generic "Error" name
    this.query = query; // Custom metadata
  }
}

try {
  throw new DatabaseError('Query failed', 'SELECT * FROM users');
} catch (err) {
  if (err instanceof DatabaseError) {
    console.error(\`DB Error: \${err.message} on query: \${err.query}\`);
  } else {
    throw err; // Propagate others
  }
}`,
        mistake: "Throwing plain strings or plain objects (e.g., throw 'Unauthorized' or throw { code: 401 }) instead of instances extending the native Error class, which completely strips away the V8 engine's stack trace recording and breaks standard try-catch type checks.",
        diagram: `Error (Base class, holds message & stack)
   ▲
   └── super(message)
   ▲
DatabaseError (Custom error class, inherits prototype & adds query context)`,
        traps: [
          "Custom error classes let you catch/handle errors BY TYPE (instanceof) instead of fragile string-matching on err.message. This is a direct, practical application of extends/super from Batch C.",
          "Forgetting super(message) breaks err.message and err.stack entirely — the base Error constructor is what actually sets those up.",
          "Forgetting to set this.name does NOT break instanceof (that relies purely on the prototype chain) — but it DOES break err.toString() and any logging code reading err.name, since those default back to the base 'Error' unless explicitly overridden.",
          "Throwing plain strings/objects instead of real Error instances (throw 'broke') loses the stack trace entirely — much harder to debug in production."
        ],
        interview: "Custom error classes are built by extending the native Error constructor. Within the constructor, calling super(message) is mandatory to properly delegate initialization of the message property and capture the V8 stack trace. Overriding this.name with the class name is a separate step necessary for correct string serialization (e.g. err.toString()), although the instanceof check relies strictly on prototype chain links and is unaffected by the name property. Custom error types should always be thrown as instances to guarantee stack trace retention.",
        interviewQ: "Why does forgetting this.name = 'MyError' NOT break err instanceof MyError, but it DOES break err.toString() and any code logging err.name? What's the structural reason these are independent?"
      },
      {
        id: "async-errors",
        title: "Async Error Handling (rejections)",
        status: "done",
        analogy: "Think of a try/catch around synchronous code like a safety net directly under a tightrope walker — if they fall right there, the net catches them. But if the walker later teleports to a different stage entirely (async code, running later, off the original call stack), the original net can't catch anything anymore, because by the time they fall, that net isn't even underneath them.",
        core: "A standard try-catch block only intercepts synchronous errors thrown during its execution window on the call stack. Because asynchronous callbacks (like setTimeout or Promise handlers) run in separate turns of the event loop after the try-catch block has completed, their errors escape. Promises solve this by using the .catch() method to register a rejection path, while async/await allows try-catch blocks to work by pausing function execution (yielding control) and re-throwing promise rejections on the stack once they resume.",
        code: `// 1. Sync try-catch fails on async setTimeout
try {
  setTimeout(() => { throw new Error('Async Boom!'); }, 100);
} catch (err) {
  // Never runs!
}

// 2. Promise catch works correctly
const fetchData = () => Promise.reject(new Error('Network failed'));
fetchData().catch(err => console.log('Caught Promise:', err.message));

// 3. Async/await try-catch works by pausing call stack
async function run() {
  try {
    await fetchData();
  } catch (err) {
    console.log('Caught Async:', err.message);
  }
}
run();`,
        mistake: "Using forEach with an async callback, or failing to handle rejections on async functions in event handlers/callbacks, leading to silent UnhandledPromiseRejection errors. Also, expecting try-catch to intercept errors thrown in raw callbacks (like inside setTimeout or fs.readFile).",
        diagram: `Sync Try/Catch:  [Call Stack: Try Block] ──> finishes and pops off stack
                                                    │
Async Error:     (Later Event Loop Tick) ───────────┴─> [Timeout Callback] throws Error (Uncaught!)`,
        traps: [
          "A standard try/catch block only catches errors thrown synchronously during its active stack lifetime.",
          "Promises use .catch() to register rejection paths because the callbacks run in a future microtask.",
          "async/await allows try/catch to work by pausing execution at the await keyword, re-throwing the rejection when resuming."
        ],
        interview: "Synchronous try/catch operates on the active call stack frame. Asynchronous execution (like setTimeout or Promise callbacks) runs in a separate call stack frame in a future tick of the event loop. Therefore, the original try/catch block has already finished executing and popped off the stack when the async error is thrown, leaving it uncaught. With async/await, the compiler suspends the async function's execution context at the await keyword, saving it to the heap. When the promise rejects, the event loop resumes the execution context and re-throws the error in that scope, allowing the active try/catch block to intercept it.",
        interviewQ: "Why does try/catch fail to catch an error thrown inside a raw setTimeout callback, but it correctly catches a rejection from an awaited promise inside an async function? What's the structural difference in execution timing between the two?"
      },
      {
        id: "error-boundaries",
        title: "Error Boundaries (Node context)",
        status: "done",
        analogy: "Think of it like circuit breakers in a house's electrical panel. Instead of one fault taking down the entire house's power, each breaker isolates failures to a specific circuit — one bad appliance trips its own breaker, while the rest of the house keeps running normally.",
        core: "Unlike browser tabs which are isolated and easy to reload, Node.js runs as a single, long-lived server process. An uncaught exception or unhandled promise rejection can crash the entire process, aborting all active client connections. Implementing 'error boundaries' in Node means using process-level safety nets (uncaughtException/unhandledRejection) as logging and graceful shutdown triggers, while relying on middleware-level boundaries (like Express error handling middleware) to contain request-specific failures and prevent server-wide crashes.",
        code: `// 1. Process-level safety net (graceful shutdown)
process.on('uncaughtException', (err) => {
  console.error('Critical Uncaught Exception:', err);
  // Graceful shutdown (let PM2/Docker restart the app)
  process.exit(1);
});

// 2. Request-level error boundary (Express middleware)
app.get('/risky', async (req, res, next) => {
  try {
    const data = await riskyOperation();
    res.json(data);
  } catch (err) {
    next(err); // passes error to centralized handler
  }
});

// 3. Centralized error boundary middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});`,
        mistake: "Using process.on('uncaughtException') to swallow exceptions and keep the server running. Because the app state is now unpredictable, this can lead to memory leaks, stuck database connections, or corrupted states. The correct path is: log, close server, and exit.",
        diagram: `[Request A] ──> Throws Sync/Async Error ──┐
                                          ├──> Caught by Express Boundary ──> 500 Response (Server remains alive!)
[Request B] ──> Runs normally ────────────┘

[Unhandled Error] ───────────────────────────> Hits process.on('uncaughtException') ──> Log & process.exit(1) (Shutdown & Restart)`,
        traps: [
          "Node.js is single-threaded; an uncaught exception on one request crashes the process for all active clients.",
          "Swallowing errors inside uncaughtException is dangerous because the process state is unknown and potentially corrupted.",
          "Express does not catch rejected promises automatically (pre-Express 5); you must wrap async routes or use express-async-errors."
        ],
        interview: "Node.js runs as a single-threaded runtime. If an exception escapes the call stack and remains uncaught, the runtime will terminate the process. Swallowing this error via process.on('uncaughtException') without exiting is highly discouraged because memory references, sockets, or module states may be corrupted. Instead, you should implement request-level error boundaries (like Express try-catch routing to error-handling middleware) to handle client failures gracefully. For unhandled system errors, the process should log the diagnostic state, close open socket listeners, exit with a non-zero code, and let process managers like PM2 or Kubernetes launch a clean instance.",
        interviewQ: "Why is process.on('uncaughtException', ...) considered a 'safety net,' not a real fix — why shouldn't you just log the error there and let the server keep running normally afterward?"
      }
    ]
  }
);
