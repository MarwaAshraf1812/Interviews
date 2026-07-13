if (!window.TRACKER_DATA) window.TRACKER_DATA = [];

window.TRACKER_DATA.push(
  {
    batch: "Batch E — Memory & Performance",
    topics: [
      {
        id: "garbage-collection",
        title: "Garbage Collection (mark-and-sweep)",
        status: "done",
        analogy: "Think of memory like a warehouse full of boxes (objects). Periodically, a cleanup crew walks through starting from a few known 'important' shelves (global variables, active stack frames) and tags every box they can physically reach by following connections. Any box that's untagged after the sweep — nothing points to it, nothing can reach it — gets thrown out to free up space.",
        core: "JavaScript handles memory allocation and reclamation automatically via a garbage collector using the Mark-and-Sweep algorithm. It identifies roots (global objects, local variable scopes, Call Stack frames) and recursively marks all reachable objects as 'alive.' In the sweep phase, any object not marked alive is considered unreachable garbage and is deallocated from the heap. This resolves the circular reference leak issue inherent in naive reference counting systems.",
        code: `// Reachable object
let user = { name: "Marwa" };
user = null; // { name: "Marwa" } is now unreachable

// Circular reference example handled correctly by Mark-and-Sweep
function createCircular() {
  const objA = {};
  const objB = {};
  objA.ref = objB;
  objB.ref = objA;
  return "done"; // objA and objB are not returned or stored anywhere
}
createCircular();
// objA and objB are isolated from any root; GC correctly reclaims both.`,
        mistake: "Assuming that setting a variable to null immediately frees the underlying memory. In reality, it only breaks the reference, making the object eligible for collection during the next GC cycle (which runs asynchronously based on engine heuristics).",
        interview: "Mark-and-Sweep determines eligibility for garbage collection via reachability from root nodes, rather than reference counting. This resolves the classic circular reference problem where two unused objects reference each other but are disconnected from the application root. In reference counting, their counts never drop to zero, causing a permanent leak. In Mark-and-Sweep, the GC traverses the root graph, finds no paths to them, and safely sweeps both.",
        diagram: `Roots (Globals/Stack) ──> Reachable ObjA ──> Reachable ObjB (Marked & Kept)

Unreachable: [ ObjC ⇄ ObjD (Circular Reference) ] ──> Not reachable from roots ──> Swept & Freed`,
        traps: [
          "Setting a variable to null does not trigger immediate deallocation; it only marks the object as unreachable and eligible for subsequent GC cycles.",
          "Naive reference counting fails on circular references; Mark-and-Sweep resolves this by checking reachability from root nodes rather than counting inbound pointers.",
          "Memory leaks can still happen in JS if unused objects remain attached to root nodes (e.g. global arrays, active event listeners, or unclosed closures)."
        ],
        interviewQ: "In the circular reference example, why does mark-and-sweep correctly garbage collect objA and objB, even though they still reference each other?"
      },
      {
        id: "memory-leaks",
        title: "Memory Leaks",
        status: "done",
        analogy: "Think of a memory leak like leaving the water running in a room nobody uses anymore. The room is unreachable to normal traffic, but if a pipe from the main system still connects to it, the water (memory) never gets shut off — it just keeps accumulating, invisible, until eventually it floods the whole house (the app crashes or slows to a crawl).",
        core: "A memory leak in JavaScript occurs when memory that is no longer needed by the application remains allocated in the heap because it is unintentionally still reachable from the garbage collection roots. Classic root causes include forgotten timers/intervals holding variables via closures, detached DOM nodes retained in JS references, event listeners never removed from DOM elements, accidental global variables, and unclosed closures capturing large outer scopes.",
        code: `// 1. Forgotten interval leak
function startPolling(largeData) {
  setInterval(() => {
    console.log(largeData.length); // closure captures largeData forever
  }, 1000);
}

// Fix: return cleanup function
function startPollingFixed(largeData) {
  const intervalId = setInterval(() => {
    console.log(largeData.length);
  }, 1000);
  return () => clearInterval(intervalId);
}

// 2. Detached DOM Node leak
let cachedButton = document.getElementById("submit");
document.body.removeChild(cachedButton); // visually removed, but cachedButton still holds reference`,
        mistake: "Believing that setting a variable to null automatically solves all memory leaks. Nulling a reference is useless if the object is still retained by a closure in an active interval, registered as an event listener, or stored in a global array cache.",
        interview: "To detect and debug memory leaks, use the Chrome DevTools Memory panel to record Heap Snapshots before and after performing user actions. In Node.js, heap dumps can be analyzed similarly. Memory leaks are typically identified by looking for objects that continuously increase in quantity and size across repeated actions (like repeatedly opening/closing a modal) and are never reclaimed. The resolution requires identifying the path to the GC root keeping the object reachable (such as an active interval or unremoved listener) and tearing it down.",
        diagram: `Root (window / stack) ──> Active Interval/Listener ──> Captured Closure Scopes ──> Large Objects (Retained in Heap)`,
        traps: [
          "Closures capture variables from outer scopes by reference, not by value; if a closure in an interval retains a variable, the entire outer lexical scope stays alive.",
          "Removing a DOM element visually via removeChild() does not free its memory if a JS variable still references the node, resulting in a 'detached DOM node' leak.",
          "Unremoved event listeners on elements that are removed can retain entire scope hierarchies in memory depending on closure capture rules."
        ],
        interviewQ: "In the startPolling(largeData) example, why exactly does largeData stay in memory forever if the interval is never cleared — connect this back to both reachability (GC) and closures (Batch B)?"
      },
      {
        id: "debounce-throttle",
        title: "Debounce vs Throttle",
        status: "done",
        analogy: "Imagine an elevator door. Debounce is like a door that resets its 'close' timer every time someone new walks up — it only actually closes once nobody has approached for a few seconds straight. Throttle is like a door that closes and reopens on a strict schedule no matter how many people are approaching — say, once every 2 seconds, guaranteed, regardless of how much foot traffic there is.",
        core: "Debouncing and throttling are rate-limiting techniques used to control how often a function executes in response to a rapid stream of event triggers. Debounce groups multiple sequential calls into a single execution that runs only after a specified period of inactivity has elapsed. Throttle guarantees a maximum execution rate, ensuring the function runs at most once in every specified time window regardless of how continuously the events are fired.",
        code: `// Debounce implementation
function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Throttle implementation
function throttle(fn, limit) {
  let inThrottle = false;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => { inThrottle = false; }, limit);
    }
  };
}`,
        mistake: "Using debounce on continuous scrolling handlers where you want periodic UI updates (e.g. infinite scroll loading), causing execution to delay until the user fully stops scrolling. Or using throttle on search-as-you-type inputs, causing intermediate, incomplete API calls to fire every X milliseconds instead of waiting for typing to end.",
        interview: "Debounce postpones execution by clearing and rescheduling a setTimeout with each event trigger, utilizing closures to preserve the timer ID. Throttle blocks execution by using a flag variable inside its closure scope that rejects incoming invocations until a timeout clears the flag. Debounce is ideal for search boxes, resizing events, or input verification where only the final state matters. Throttle is optimal for scroll position tracking, viewport resize layout updates, or tracking drag coordinates where periodic, real-time feedback is required.",
        diagram: `Events:    e--e--e--------e--e------
Debounced: ------------D-----------D  (runs after delay of inactivity)
Throttled: T-----T-----T-----------  (runs at most once per period)`,
        traps: [
          "Under debounce, if events continue to fire continuously at an interval shorter than the delay, the target function will never execute.",
          "A naive throttle implementation may drop the final event execution if it fires inside the limit window; a trailing throttle handles this by scheduling a final execution.",
          "Using these wrappers directly in React components without ref preservation (like useMemo or useCallback) will cause a new wrapper instance to be created on every render, rendering the rate-limit useless."
        ],
        interviewQ: "If a user is dragging a slider continuously for 5 seconds straight, and you throttle the update handler at 200ms, roughly how many times does the handler actually fire, and why wouldn't debounce be the right choice here instead?"
      }
    ]
  }
);

window.TRACKER_DATA.push(
  {
    batch: "Bonus tangent — for...of vs .forEach()",
    topics: [
      {
        id: "for-of-vs-foreach",
        title: "for...of vs .forEach() Execution",
        status: "done",
        analogy: "Think of a for...of loop like driving a manual transmission car where you control every stop, start, and pause (using break, continue, or await). A .forEach() call is like riding a roller coaster — once it starts, it calls its callback for every single seat on the train sequentially, and you cannot jump off or pause the ride until it reaches the very end.",
        core: "for...of is a language-level loop statement that operates on iterables (objects with Symbol.iterator). It supports loop-control statements like break and continue, and properly pauses execution when await is used within async functions. In contrast, .forEach() is a prototype method on arrays that executes a callback function for each element; it cannot be broken out of or paused, and it completely ignores promise resolutions returned from its callback, executing all steps concurrently/synchronously.",
        code: `// 1. for...of supports break / await
for (const item of [1, 2, 3]) {
  if (item === 2) break;
  console.log(item); // Logs: 1
}

// 2. .forEach return behavior (does NOT stop the loop)
[1, 2, 3].forEach(item => {
  if (item === 2) return; // Only exits this callback instance
  console.log(item); // Logs: 1, 3
});`,
        mistake: "Attempting to use break or continue inside a .forEach() callback (which throws a SyntaxError), or using await inside a .forEach() callback expecting it to execute sequentially (it will run concurrently and won't await the completions before moving on).",
        diagram: `for...of loop:   [Item 1] ──await/break?──> [Item 2] ──await/break?──> [Item 3] (Sequential / Control)

.forEach() call: [Callback(1)] & [Callback(2)] & [Callback(3)] (Fires all synchronously, ignores returns/promises)`,
        traps: [
          "for...of is a language-level loop construct working on iterables, supporting break and continue, while forEach is just a method calling a function per element.",
          "break/continue inside forEach is a SyntaxError. return inside forEach callback only exits that single call, it does not stop iteration.",
          "for...of properly pauses on await inside async functions for sequential execution. forEach fires all async callbacks synchronously, ignoring returned promises."
        ],
        interview: "forEach is an array method that invokes a callback for every element; it cannot be halted with break or continue, and returning from the callback only exits the current function invocation, not the loop. Furthermore, forEach is completely async-unaware—if the callback returns a promise, forEach does not await it. for...of, on the other hand, is a control-flow statement that consumes iterables, allowing full control over iteration with break, continue, and sequential await pausing.",
        interviewQ: "Why does return inside a forEach callback not stop the loop the way break does in for...of?"
      }
    ]
  }
);

window.TRACKER_DATA.push(
  {
    batch: "Bonus tangent — Event Loop",
    topics: [
      {
        id: "event-loop-internals",
        title: "Call Stack, Web APIs, Microtasks vs Macrotasks",
        status: "done",
        analogy: "Think of the JS engine like a busy restaurant kitchen. The Call Stack is the head chef preparing orders immediately. Web APIs are the ovens and delivery drivers doing things in the background. The Microtask Queue is the 'emergency corrections' tray (high priority tasks like wiping spills) that the chef must empty completely before touching the Macrotask Queue (the regular line of incoming new orders, like setTimeout).",
        core: "JavaScript is single-threaded and uses an event loop to orchestrate async execution. Synchronous code runs immediately on the Call Stack. Async operations are handed off to Web APIs/Node APIs, which place their callbacks onto queues when complete. The Event Loop waits for the Call Stack to be empty. It then drains the entire Microtask Queue (Promise callbacks, queueMicrotask) before processing a single Macrotask (setTimeout, setInterval, I/O).",
        code: `console.log('Sync Start');

setTimeout(() => console.log('Timeout (Macrotask)'), 0);

Promise.resolve().then(() => console.log('Promise 1 (Microtask)'));
Promise.resolve().then(() => console.log('Promise 2 (Microtask)'));

console.log('Sync End');

// Logs:
// Sync Start
// Sync End
// Promise 1 (Microtask)
// Promise 2 (Microtask)
// Timeout (Macrotask)`,
        mistake: "Believing that setTimeout(fn, 0) executes the callback immediately. In reality, it only registers the callback with a 0ms minimum delay, placing it in the macrotask queue. It must wait for all currently executing synchronous code and all pending microtasks to finish first.",
        diagram: `Call Stack (Sync Code)
       │  (hands off async work)
       ▼
   Web APIs (Timers, Promises)
       │  (returns callbacks)
       ▼
┌────────────────────────────────────────────────────────┐
│ Event Loop Checks:                                     │
│ 1. Microtask Queue (Promises) ──> Drains completely    │
│ 2. Macrotask Queue (setTimeout) ──> Runs one task      │
└────────────────────────────────────────────────────────┘`,
        traps: [
          "The event loop only runs task queues when the call stack is completely empty.",
          "It always drains the entire Microtask queue before running a single Macrotask.",
          "setTimeout(fn, 0) does not run immediately; it is a macrotask and always yields to the microtask queue."
        ],
        interview: "The JS runtime executes code synchronously on the Call Stack. Async tasks are delegated to Web APIs, and their callbacks land in either the Microtask or Macrotask queue. Once the Call Stack is empty, the Event Loop prioritizes the Microtask queue, executing every microtask in it until it is empty. Only then does it run a single macrotask from the Macrotask queue, repeating the cycle. This is why Promise resolutions always run before setTimeout callbacks, even if the timeout was registered first with 0ms.",
        interviewQ: "Given setTimeout(()=>log('A'),0), then Promise.resolve().then(()=>log('B')), then another Promise.resolve().then(()=>log('C')) — what's the output order, and why does C print before A even though A was scheduled first?"
      }
    ]
  }
);
