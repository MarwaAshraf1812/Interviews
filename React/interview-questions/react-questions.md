# React Mastery — Senior Interview Questions & Answers

This document compiles the core technical interview questions, deep explanations, and senior-level answers for **Chapter 1 (React Fundamentals)** and **Chapter 2 (Hooks & Closures)**.

---

## Table of Contents
1. [Component vs Element vs Instance](#1-component-vs-element-vs-instance)
2. [Virtual DOM vs React Fiber](#2-virtual-dom-vs-react-fiber)
3. [Reconciliation Diffing Heuristics & Key Traps](#3-reconciliation-diffing-heuristics--key-traps)
4. [JSX Compilation (Classic vs Modern)](#4-jsx-compilation-classic-vs-modern)
5. [State vs Props & Automatic Batching](#5-state-vs-props--automatic-batching)
6. [SyntheticEvent & Event Delegation (React 16 vs 17+)](#6-syntheticevent--event-delegation-react-16-vs-17)
7. [useState Design: Array vs Object & Functional Updates](#7-usestate-design-array-vs-object--functional-updates)
8. [useEffect: Why It Exists & Pure Component Body Rules](#8-useeffect-why-it-exists--pure-component-body-rules)
9. [useEffect Dependencies: Three Modes & Execution Flow](#9-useeffect-dependencies-three-modes--execution-flow)
10. [useEffect Cleanups: Memory Leaks & Active Subscriptions](#10-useeffect-cleanups-memory-leaks--active-subscriptions)

---

## 1. Component vs Element vs Instance

### Question
What is the difference between a React Component, a React Element, and a Component Instance?

### Explanation
* **Component:** A blueprint, factory, or template. It can be a class or a functional component that accepts `props` as input and returns a React element tree.
* **Element:** A lightweight, plain JavaScript object that describes what should be rendered on the screen. It has a `type` property (referencing a string for DOM nodes or the component function itself), a `props` object, and a special `$$typeof` symbol property to prevent XSS exploits. Elements are immutable and are frozen using `Object.freeze()`.
* **Instance:** The runtime representation of a stateful component. In modern React, instances are represented as **Fiber nodes** on the fiber tree, which hold the component’s local state, refs, lifecycle hooks, and direct bindings to the DOM.

### Interview-Ready Answer
> "A **Component** is the blueprint—a function or class that returns a UI description. A **React Element** is the lightweight, immutable plain JavaScript object returned by that blueprint (e.g. `{ type: 'div', props: { children: 'hello' } }`) which describes what should appear on the screen. A **Component Instance** is the internal in-memory object (represented as a **Fiber node**) created by React at runtime to manage the component's state, lifecycle, and native DOM bindings."

---

## 2. Virtual DOM vs React Fiber

### Question
How does React Fiber differ from the old Virtual DOM stack reconciler, and what problems does it solve?

### Explanation
* **Stack Reconciler (Pre-React 16):** Traversing the Virtual DOM tree was done recursively and synchronously. Once the render cycle began, it could not be paused. This blocked the browser’s single main thread, causing visual stuttering and lag during heavy rendering tasks (e.g., fast user typing or animations).
* **React Fiber (React 16+):** A complete rewrite of the reconciliation engine. It converts the component tree into a singly linked list of **Fiber nodes** (where each node has pointers to its `child`, `sibling`, and `return` parent). This acts as a virtual call stack, enabling **Cooperative Scheduling**. Rendering can be paused, prioritized, aborted, and resumed.
* **The Two Phases:**
  1. **Render Phase:** Asynchronous and interruptible. React walks the linked list to compute diffs and identify side-effects.
  2. **Commit Phase:** Synchronous and atomic. React applies the updates to the DOM in one go to prevent layout flickering.

### Interview-Ready Answer
> "The old **Stack Reconciler** executed updates recursively and synchronously, blocking the main thread during large renders. **React Fiber** is a linked-list-based scheduling architecture that represents the call stack virtually. It splits rendering into an **interruptible Render Phase** (which computes differences asynchronously and yields to high-priority tasks like typing) and a **synchronous Commit Phase** (which writes changes to the DOM atomically to prevent visual tearing)."

---

## 3. Reconciliation Diffing Heuristics & Key Traps

### Question
How does React's diffing algorithm work, and why is using an array index as a `key` prop dangerous?

### Explanation
* **O(n) Heuristic:** Comparing two trees optimally is an O(n³) operation, which is far too slow for real-time UIs. React reduces this to O(n) using two heuristics:
  1. **Different Types:** If two elements have different types (e.g., `<div>` vs `<span>`), React tears down the old tree, destroys its state, and builds the new one from scratch.
  2. **Stable Keys:** Sibling elements are matched across renders using their `key` prop, allowing React to move and reorder elements rather than recreating them.
* **The Index Key Trap:** If a list is reordered, prepended, or filtered, using the array index as the key maps the same index to a different data item. React assumes the element at index `0` is unchanged and merely mutates its properties in place. This leads to severe rendering bugs (e.g., input field text or focus remaining on the wrong item) and degrades performance.

### Interview-Ready Answer
> "React achieves **O(n) diffing complexity** by assuming that different element types produce completely different subtrees (which are destroyed and rebuilt), and by utilizing sibling `keys` to track identity. Using an **array index as a key is dangerous** because if the list is reordered, inserted into, or deleted from, the indexes shift. This causes React to match elements incorrectly, leading to persistent state rendering bugs (like text inputs staying on the wrong row) and rendering performance hits."

---

## 4. JSX Compilation (Classic vs Modern)

### Question
Explain how JSX is compiled, and the difference between classic and modern React JSX compilation.

### Explanation
* **JSX Nature:** Browsers cannot run JSX directly; it is compiled into plain JavaScript functions using tools like Babel, SWC, or ESBuild.
* **Classic Compiler (React 16 and older):** Translates JSX tags into `React.createElement(type, props, ...children)` calls.
  * *Downside:* Every file with JSX must manually `import React from 'react'`.
  * *Downside:* Children are passed as extra arguments, which limits compiler-level performance optimizations.
* **Modern Compiler (React 17+):** Automatically injects imports from the JSX runtime (`react/jsx-runtime`).
  * *Benefit:* No manual `import React` is needed just for JSX.
  * *Benefit:* Children are compiled into the `props` object, which allows the runtime to optimize node rendering.

### Interview-Ready Answer
> "JSX is syntactic sugar that transpiles into native JavaScript functions. In the **classic transform**, JSX is compiled into `React.createElement()` calls, requiring React to be imported in every file. In the **modern transform** introduced in React 17, JSX is compiled into direct calls to the automatic runtime helpers (`_jsx` from `react/jsx-runtime`), removing the need to import React manually and enabling better compiler optimizations."

---

## 5. State vs Props & Automatic Batching

### Question
What are the core differences between state and props, and how does React's state batching work?

### Explanation
* **Props:** Configuration data passed down from a parent component. They are read-only (immutable) from the child's perspective.
* **State:** Local, mutable data managed internally by the component. Setting state triggers a re-render.
* **Batching:** React queues state updates and combines them into a single re-render to avoid layout thrashing and performance degradation.
* **Automatic Batching (React 18):** In React 17 and earlier, batching only occurred inside React event handlers. Updates in promises, `setTimeout`, or native event listeners triggered multiple re-renders. React 18 batches all state updates across all asynchronous boundaries automatically.

### Interview-Ready Answer
> "**Props** are read-only configuration variables passed down from parents, while **State** is internal, mutable data managed locally by the component. When state is updated, React queues a re-render. To optimize this, React implements **Automatic Batching** (standardized in React 18), grouping multiple state updates—even across promises, timeouts, and asynchronous boundaries—into a single re-render cycle to prevent redundant DOM updates."

---

## 6. SyntheticEvent & Event Delegation (React 16 vs 17+)

### Question
What is React's SyntheticEvent, and how does event delegation work in React 17+ vs 16?

### Explanation
* **SyntheticEvent:** A wrapper around the browser's native event object to normalize behaviors, ensuring identical event attributes across Safari, Chrome, and Firefox.
* **Event Delegation:** React does not attach event handlers to individual DOM nodes. Instead, it registers one main listener at the root.
* **Delegation Target Shift:**
  * **React 16:** Events were delegated to the global `document` node. This caused conflicts when nesting multiple React apps (since stopping propagation inside a sub-app couldn't prevent the event from hitting `document`).
  * **React 17+:** Event delegation target was moved from the `document` to the **mount root DOM container** (e.g. `<div id="root">`). This isolates nested apps safely.

### Interview-Ready Answer
> "React wraps native browser events in a normalized **SyntheticEvent** object to guarantee cross-browser consistency. Rather than binding events to individual DOM nodes, React uses **event delegation**. In React 16, events bubbled up and were handled at the `document` level. In React 17+, event delegation is bound to the **React mount root DOM container** instead, preventing event propagation conflicts when nesting multiple React instances or integrating with legacy libraries."

---

## 7. useState Design: Array vs Object & Functional Updates

### Question
Why does useState return an array instead of an object, and why must you use a functional update when the next state depends on the previous state?

### Explanation
* **Array Return Design:** Returning an array (e.g. `[state, setState]`) allows developers to take advantage of **array destructuring**. It lets us rename the variables freely and cleanly in a single line with zero boilerplate. If it returned an object (e.g. `{ value, setValue }`), renaming would require verbose destructuring: `const { value: count, setValue: setCount } = useState(0)`.
* **Functional Updates:** State updates are asynchronous and batched. Calling `setCount(count + 1)` multiple times in a row uses the same stale snapshot of `count` from the current render scope, resulting in only a single increment. Passing a functional updater `setCount(prev => prev + 1)` ensures React passes the freshest, pending value from the queue into the callback.

### Interview-Ready Answer
> "React's `useState` returns an **array** to allow clean, flexible variable renaming via **array destructuring** with zero boilerplate. We must use the **functional update form** (e.g. `setState(prev => prev + 1)`) whenever the next state depends on the previous state. Because state updates are asynchronous and batched, direct setter calls use a stale render scope snapshot of the state variable; the functional updater ensures we read the freshest queued state value."

---

## 8. useEffect: Why It Exists & Pure Component Body Rules

### Question
Why can't you perform side effects directly in the body of a functional component?

### Explanation
* **Pure Render Phase:** The body of a functional component executes during React's Render phase. This phase calculates the virtual UI and must remain a pure function—accepting props/state and returning JSX, without causing side effects.
* **Infinite Loops:** If side-effects (like updating `document.title`, modifying external state, setting timers, or fetching APIs) run in the body, they execute on every render. If the side-effect triggers a state update, it triggers a re-render, running the side-effect again, resulting in an infinite render loop.
* **useEffect Solution:** It defers side-effect execution until after the render phase is complete and the changes have been painted to the screen.

### Interview-Ready Answer
> "The body of a functional component runs during the **Render Phase** and must remain a pure function. Performing side effects—like network fetches or subscriptions—directly in the body triggers them on every render. If these side-effects update state, they force a re-render, immediately causing an **infinite render loop**. `useEffect` solves this by deferring side-effects to run asynchronously *after* the render has completed and painted to the screen."

---

## 9. useEffect Dependencies: Three Modes & Execution Flow

### Question
What is the difference between passing an empty array, no array, or an array with values as dependencies in useEffect?

### Explanation
* **No Array (`useEffect(() => {})`):** The effect runs after **every single render** and paint cycle. This is rarely what you want and poses a high risk of infinite loops if state is set inside.
* **Empty Array (`useEffect(() => {}, [])`):** The effect runs exactly **once** after the initial mount, acting similarly to class component `componentDidMount`.
* **Array with values (`useEffect(() => {}, [depA, depB])`):** The effect runs after the initial mount, and subsequently only if React detects that one or more values in the dependency list have changed (compared via `Object.is`).
* **Execution Flow:**
  1. Component renders and paints to the screen.
  2. The previous effect's **cleanup function** runs (if dependencies changed).
  3. The current effect's **callback** runs.

### Interview-Ready Answer
> "The dependency array dictates when the effect re-runs. **No array** executes the effect on every single render. An **empty array `[]`** executes the effect once upon initial mount. An **array with dependencies `[dep]`** executes the effect on mount, and then only re-runs if any value in the array changes between renders. In terms of flow, when dependencies change, React updates the DOM, paints, executes the **cleanup** from the previous render, and then runs the new effect."

---

## 10. useEffect Cleanups: Memory Leaks & Active Subscriptions

### Question
What are memory leaks in useEffect, and why is the cleanup function critical?

### Explanation
* **Memory Leaks:** If an effect establishes a persistent action—such as starting a `setInterval`, registering an event listener, or connecting to a WebSocket (e.g. order tracking updates in FoodLoop)—these actions live in the browser's global scope. If the component unmounts and the action is not cleared, it will continue running in the background, consuming memory and triggering state updates on destroyed components.
* **Cleanup Mechanism:** The function returned by the `useEffect` callback is the **cleanup function**. React runs it:
  1. Immediately before running the effect again (to tear down the previous cycle’s resources).
  2. When the component unmounts from the DOM.

### Interview-Ready Answer
> "Memory leaks occur in `useEffect` when persistent side-effects—like intervals, DOM event listeners, or WebSocket subscriptions—are left active after a component unmounts. To prevent this, we must return a **cleanup function** from the effect. React executes this cleanup to tear down active resources right before the effect re-runs (if dependencies change) and when the component unmounts, preventing memory leaks and duplicate event handlers."
