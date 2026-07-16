if (!window.TRACKER_DATA) window.TRACKER_DATA = [];

window.TRACKER_DATA.push(
  {
    batch: "Module 1 — React Fundamentals",
    topics: [
      {
        id: "component-element-instance",
        title: "Component vs Element vs Instance",
        status: "done",
        analogy: "A Component is a cookie cutter (the blueprint/factory). An Element is a description of the cookie it makes (size, shape, toppings). An Instance is the actual baked cookie in the box that you can interact with (maintains its own state and lifecycle).",
        core: "A Component is a function or class that returns a description of the UI. A React Element is a plain, lightweight, immutable JavaScript object that describes what you want to see on screen (represented as type and props). An Instance is the runtime representation of the component created by React during the render phase (manifested as a Fiber node in modern React) to manage state, props, and lifecycle.",
        code: `// 1. Component (Function Blueprint)
function Button({ label }) {
  return <button>{label}</button>;
}

// 2. Element (Plain Object)
// Under the hood, this JSX:
const el = <Button label="Click" />;
// Compiles to a plain object:
// { type: Button, props: { label: "Click" } }

// 3. Instance
// Created at runtime by React's reconciler to track the state and DOM node.`,
        diagram: `React Lifecycle Entities:
┌─────────────────┐
│    Component    │  ◄── Blueprint / Function (e.g. function Button())
└────────┬────────┘
         │ Instantiated as description
         ▼
┌─────────────────┐
│     Element     │  ◄── Plain Immutable Object { type: Button, props: {...} }
└────────┬────────┘
         │ Rendered / Mounted
         ▼
┌─────────────────┐
│    Instance     │  ◄── Runtime Fiber Node (Manages state, DOM binding)
└─────────────────┘`,
        mistake: "Attempting to directly mutate a React element's properties after creation. Elements are immutable; to update the UI, you must trigger a render with a new element tree.",
        traps: [
          "Thinking that <Component /> returns an instance. It actually returns an element object. React manages the instantiation and destruction of instances internally."
        ],
        interview: "\"A Component is a function or class that acts as a template. A React Element is a lightweight, immutable JavaScript object that describes a DOM element or component. An Instance is the runtime Fiber node created to manage a component's state and lifecycle.\"",
        interviewQ: "What is the difference between a React Component, a React Element, and a Component Instance?"
      },
      {
        id: "virtual-dom-vs-fiber",
        title: "Virtual DOM vs Fiber",
        status: "done",
        analogy: "The old Stack Reconciler was like a synchronous recursive function call that could not stop until it was completely done, blocking any user input. React Fiber is like a cooperative scheduler that breaks work into small tasks, periodically checking if there are urgent jobs (like user typing) and yielding the main thread to handle them.",
        core: "The Virtual DOM is a conceptual representation of the UI kept in memory. React Fiber is the complete rewrite of React's core reconciliation engine in React 16. It replaces the recursive call stack with a linked-list-based tree of Fiber nodes. This enables cooperative scheduling: rendering can be paused, aborted, or prioritized. Work is split into two phases: the asynchronous, interruptible 'Render' phase, and the synchronous, atomic 'Commit' phase.",
        code: `// Simplified structure of a Fiber Node:
const fiber = {
  type: 'div',
  key: null,
  
  // Linked list pointers
  child: firstChildFiber,
  sibling: siblingFiber,
  return: parentFiber, // Return pointer mimicking the stack frame
  
  // Props and State
  pendingProps: { className: 'active' },
  memoizedState: null,
  
  // Priority scheduling lanes
  lanes: 0b0000000000000000000000000000010
};`,
        diagram: `React Fiber vs Stack Reconciler:
Old Stack Reconciler:
Component Tree Root ──► Node A ──► Node B ──► Node C (Synchronous, Recursive, Blocks main thread)

New Fiber Reconciler:
Root Fiber
  │ (child)
  ▼
Fiber A ──(sibling)──► Fiber B 
  │ (child)
  ▼
Fiber C (Can pause/resume work, uses return pointers to navigate back)`,
        mistake: "Thinking that React Fiber makes DOM manipulation asynchronous. The reconciliation/render phase is asynchronous and interruptible, but the commit phase (the DOM update) is synchronous to prevent visual tearing.",
        traps: [
          "Confusing Virtual DOM with Fiber. Virtual DOM is the high-level pattern of syncing virtual nodes with real DOM. Fiber is the specific linked-list scheduling architecture that implements reconciliation."
        ],
        interview: "\"The Stack Reconciler reconciled updates synchronously, blocking the main thread. React Fiber is a linked-list-based scheduling architecture that splits rendering into an interruptible Render phase (computing diffs) and a synchronous Commit phase (updating the DOM), enabling high-priority interactions like inputs to preempt lower-priority renders.\"",
        interviewQ: "How does React Fiber differ from the old Virtual DOM stack reconciler, and what problems does it solve?"
      },
      {
        id: "reconciliation-diffing",
        title: "Reconciliation & Diffing Heuristics",
        status: "done",
        analogy: "Comparing two snapshots of a class photo. If a student is replaced by a teacher (different type), you throw out the desk and put a teacher desk there. If the students just swapped seats (same type, but reordered), you look at their name tags (keys) to quickly place them in their correct new seats.",
        core: "React implements a heuristic O(n) diffing algorithm rather than a full O(n^3) tree diff. It operates on two assumptions: 1. Two elements of different HTML/component types will produce different trees (React will tear down the old tree and build the new one). 2. Developers can provide a stable 'key' prop to flag children that are stable across renders, allowing React to match nodes correctly during list updates.",
        code: `// 1. Different Types: Tears down old <div> and mounts <section>
// Old: <div><Counter /></div>
// New: <section><Counter /></section> (Counter is destroyed & remounted)

// 2. Same Type, Different Props: Updates DOM attributes only
// Old: <div className="dark" />
// New: <div className="light" /> (DOM node is kept, className mutated)

// 3. Keys in lists
// Old: <li key="a">A</li><li key="b">B</li>
// New: <li key="b">B</li><li key="a">A</li> (React reorders DOM nodes, no remount)`,
        diagram: `Reconciliation Diffing Logic:
            Compare Node types
                 │
        ┌────────┴────────┐
   Same Type?       Different Type?
        │                 │
  Keep DOM node,     Tear down tree,
  update changed     destroy state,
  props/attributes   rebuild new DOM`,
        mistake: "Using index as a key for dynamic lists. If items are reordered, deleted, or inserted, matching indexes map to different data items, causing state rendering bugs and unnecessary performance penalties.",
        traps: [
          "Believing that keys are passed as props to the component. React strips the 'key' (and 'ref') props during compilation; they are used strictly by the reconciler."
        ],
        interview: "\"React uses an O(n) heuristic diffing algorithm. It assumes different element types generate completely separate subtrees, which are destroyed and rebuilt. For sibling elements, it uses keys to match nodes across renders to prevent unnecessary DOM mutations and state loss.\"",
        interviewQ: "How does React's diffing algorithm work, and why is using index as a key dangerous?"
      },
      {
        id: "jsx-compilation",
        title: "JSX Compilation & Babel Transform",
        status: "done",
        analogy: "JSX is like writing code in a dialect. Transpilers like Babel translate it into clean, official JavaScript that the browser's engine can parse and execute.",
        core: "JSX (JavaScript XML) is not valid JavaScript. It is a syntactic sugar transpiled before execution. In React 16 and older, JSX was compiled to `React.createElement()` calls. In React 17+, the new JSX transform automatically imports internal JSX runtime functions (like `_jsx`) from `react/jsx-runtime` and compiles JSX into direct calls, removing the need to import `React` in files containing JSX.",
        code: `// 1. JSX Input
const element = <h1 className="title">Hello</h1>;

// 2. Classic React 16 Compilation (React.createElement)
const elementClassic = React.createElement('h1', { className: 'title' }, 'Hello');

// 3. Modern React 17+ Compilation (_jsx transform)
import { jsx as _jsx } from 'react/jsx-runtime';
const elementModern = _jsx('h1', { className: 'title', children: 'Hello' });`,
        diagram: `JSX Transformation Pipeline:
[ JSX Code ] ──► [ Babel / SWC compiler ] ──► [ _jsx() Calls ] ──► [ Plain JS Object (Element) ]`,
        mistake: "Thinking JSX is part of the ECMAScript spec or runs natively in browsers. It must be compiled into JavaScript first.",
        traps: [
          "Thinking that 'React' must be in scope in modern React files. The React 17+ transform automatically injects the necessary imports, so manual React imports are only required when using hooks or top-level APIs."
        ],
        interview: "\"JSX is a syntax extension that transpiles to standard JS. Traditionally, it compiled to `React.createElement`. Modern setups transpile JSX to direct `_jsx` calls from `react/jsx-runtime`, automatically injected by compilers like Babel, SWC, or Vite.\"",
        interviewQ: "Explain how JSX is compiled, and the difference between classic and modern React JSX compilation."
      },
      {
        id: "state-vs-props",
        title: "State vs Props & Batching Mechanics",
        status: "done",
        analogy: "Props are like genes inherited from parents (read-only inside the child). State is like mood (internal, mutable, can be updated locally). State updates are batched, like a person writing down a list of changes they want to make to their room, then carrying them out all at once.",
        core: "Props are configuration variables passed from a parent component and are read-only. State is internal data managed by the component itself. When state or props change, React schedules a re-render. To optimize rendering performance, React uses batching, combining multiple state updates into a single re-render. Since React 18, automatic batching aggregates updates across promises, timeouts, and native event handlers.",
        code: `// Props vs State Example
function Counter({ step }) { // 'step' is a prop (read-only)
  const [count, setCount] = useState(0); // 'count' is local state

  const handleIncrement = () => {
    // React 18 automatic batching: both updates trigger only ONE re-render
    setCount(prev => prev + step);
    setCount(prev => prev + 1);
  };

  return <button onClick={handleIncrement}>{count}</button>;
}`,
        diagram: `State Updating and Batching:
setCount(1) ──┐
setCount(2) ──┼─► [ React Queue ] ──► [ Single Render Phase ] ──► [ DOM Commit ]
setCount(3) ──┘`,
        mistake: "Directly mutating state (e.g. `state.value = 42`) and expecting the UI to update. React depends on state setter functions to trigger its reconciliation cycle and schedule rendering work.",
        traps: [
          "Not realizing state updates are batch-processed and thus asynchronous relative to the calling scope. Reading state immediately after setting it will yield the old value."
        ],
        interview: "\"Props are immutable data passed down the component tree. State is mutable, local data managed inside a component. Updates to state are queued and batched to optimize performance. In React 18, automatic batching covers all updates, including inside timeouts and promises.\"",
        interviewQ: "What are the core differences between state and props, and how does React's state batching work?"
      },
      {
        id: "synthetic-events",
        title: "SyntheticEvent & Event Delegation",
        status: "done",
        analogy: "Instead of putting a security guard outside every single office room (event listeners on every button), you put one central security desk at the building entrance (root container listener) to route visitors (events) to their destinations.",
        core: "React implements a cross-browser event system by wrapping native events in a `SyntheticEvent` class. Instead of attaching listeners to individual DOM elements, React uses Event Delegation. In React 16 and earlier, events were delegated to the `document` object. In React 17+, events are delegated to the root DOM container (the container element passed to `createRoot`), which avoids bugs when nesting multiple React apps or integrating with non-React libraries.",
        code: `function Form() {
  const handleClick = (e) => {
    e.preventDefault(); // Works across all browsers
    console.log(e.nativeEvent); // Access the underlying browser event
  };

  // Click event bubbles up and is captured at the root container level
  return <button onClick={handleClick}>Submit</button>;
}`,
        diagram: `React Event Delegation:
[ Click Button ] ──► Bubbles up DOM tree ──► [ Root Container (<div id="root">) ] 
                                                   │ (Event Delegator captures)
                                                   ▼
                                         [ Dispatch to onClick ]`,
        mistake: "Thinking event listeners are directly bound to the DOM elements themselves. They are delegated to the mount root, meaning native event propagation might behave differently than expected.",
        traps: [
          "Trying to access properties on a pooled SyntheticEvent asynchronously in React 16. Events were pooled and reused, clearing properties after execution. This event pooling was removed in React 17."
        ],
        interview: "\"React wraps native events in a `SyntheticEvent` object to ensure cross-browser normalization. It uses event delegation, attaching a single listener to the root container rather than the individual DOM elements. This reduces memory usage and simplifies cleanup.\"",
        interviewQ: "What is React's SyntheticEvent, and how does event delegation work in React 17+ vs 16?"
      },
      {
        id: "usestate-basics",
        title: "State Basics & useState",
        status: "done",
        analogy: "Props are like genes inherited from parents (read-only from the child's perspective). State is like mood (internal, mutable, can be updated locally). State updates are batched, like a person making a list of changes they want to make to their room and then carrying them out all at once rather than doing a complete remodel for every single change.",
        core: "useState(initialValue) initializes state. It returns an array with [currentValue, updaterFunction] to allow clean variable naming via array destructuring with zero boilerplate. State updates are queued, batched, and asynchronous. The state variable is a constant snapshot of a specific render. When the next state depends on the previous state, the functional updater form should be used to prevent stale closure bugs.",
        code: `import { useState } from 'react';

function ProductPricing() {
  const priceFloor = 50;
  const [price, setPrice] = useState(200);

  function handleDecreasePrice() {
    // Functional update form prevents stale closures
    setPrice((currentPrice) => {
      const newPrice = currentPrice - 5;
      return Math.max(newPrice, priceFloor);
    });
  }

  return (
    <div>
      <p>Current price: {price} EGP</p>
      <button onClick={handleDecreasePrice}>Decrease price</button>
    </div>
  );
}`,
        diagram: `Calling useState(initial):
  → First render: returns [initial, setter]
  → Next render: returns [latest state, setter]

State updates are queued:
  setPrice(200) → schedules re-render with price = 200`,
        mistake: "Attempting to read state immediately after calling its setter function. The state value inside the handler remains a constant snapshot of the current render and will only change in the next render cycle.",
        traps: [
          "Thinking state updates are synchronous. Calling setCount(count + 1) three times in a single event handler only increments it by 1 because each call uses the same stale count snapshot. Use setCount(prev => prev + 1) instead.",
          "Confusing why useState returns an array instead of an object. An array allows developers to use destructuring to rename variables freely without verbose renaming syntax (e.g. const [count, setCount] = useState(0) vs const { value: count, setValue: setCount } = useState(0))."
        ],
        interview: "\"useState returns an array with the current state and a setter. It uses array destructuring for clean, flexible renaming. State updates are queued and batched asynchronously, meaning they act as constant snapshots during a single render. When updating based on previous state, the functional updater form must be used to avoid stale closure bugs.\"",
        interviewQ: "Why does useState return an array instead of an object, and why must you use a functional update when the next state depends on the previous state?"
      }
    ]
  }
);

