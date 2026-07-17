if (!window.TRACKER_DATA) window.TRACKER_DATA = [];

window.TRACKER_DATA.push(
  {
    batch: "Module 2 — React Hooks Deep Dive",
    topics: [
      {
        id: "useeffect-basics",
        title: "useEffect & Side Effects",
        status: "done",
        analogy: "Think of a React component as a recipe that only describes a dish (the JSX). But sometimes you need to do things that aren't 'part of the dish' — like calling the supplier to order ingredients (fetching data), setting a kitchen timer (subscriptions/intervals), or writing to a logbook (updating localStorage/document.title). useEffect is the kitchen assistant that performs these actions after the dish has been prepared.",
        core: "useEffect isolates side effects (fetching, subscriptions, manual DOM manipulation, timers) from the render body. It runs asynchronously after browser paint. 1) No array: runs on every render. 2) Empty array []: runs once on mount. 3) Dependency array [deps]: runs when listed values change. Cleanups are functions returned by the callback, running before the effect re-runs and on unmount to prevent memory leaks.",
        code: `import { useState, useEffect } from 'react';

function ExpiryCountdown({ productId }) {
  const [timeRemaining, setTimeRemaining] = useState(null);

  useEffect(() => {
    let isMounted = true;
    let intervalId;

    // 1. Fetch expiry date from database once on mount/id change
    fetch(\`/api/products/\${productId}\`)
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return;
        const expiryDate = new Date(data.expiryDate);

        const updateCountdown = () => {
          const now = new Date();
          const difference = expiryDate - now;

          if (difference <= 0) {
            setTimeRemaining("Expired");
            clearInterval(intervalId);
            return;
          }

          const seconds = Math.floor((difference / 1000) % 60);
          const minutes = Math.floor((difference / 1000 / 60) % 60);
          const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));

          setTimeRemaining(\`\${days}d \${hours}h \${minutes}m \${seconds}s\`);
        };

        updateCountdown();
        intervalId = setInterval(updateCountdown, 1000);
      });

    // 2. Cleanup: prevent memory leaks and race conditions
    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [productId]);

  return <div>Time remaining: {timeRemaining ?? 'Loading...'}</div>;
}`,
        diagram: `useEffect Execution Flow:
Render 1 (Mount) ──► Paint JSX ──► Run Effect (Setup Cleanup)
                                          │
[Props/State change] ◄────────────────────┘
        │
Render 2 ──► Paint JSX ──► Run Cleanup 1 ──► Run Effect 2 ──► [Wait for Unmount]
                                                                     │
                                                           Run Cleanup 2 on Unmount`,
        mistake: "Forgetting the dependency array entirely (creating an infinite loop if the effect updates state) or forgetting to return cleanups for timers, event listeners, and socket subscriptions, leading to leaks.",
        traps: [
          "Thinking useEffect runs before paint. It runs *after* paint. If you need to synchronously manipulate DOM layout before the browser paints to prevent visual flickering, use useLayoutEffect instead.",
          "Stale closures in effects: if an effect uses a variable/state but omits it from the dependency array, the effect body will always refer to the value from the render when the effect was last run."
        ],
        interview: "\"useEffect isolates side-effects from the render phase. It runs asynchronously after the paint cycle. It accepts an optional dependency array (no array = runs every render, empty array = mount only, filled array = runs when dependencies change). Cleanups returned by the callback clear out subscriptions and timers to prevent memory leaks.\"",
        interviewQ: "What are the three dependency modes of useEffect, and why is returning a cleanup function critical for active subscriptions or intervals?"
      },
      {
        id: "useref-basics",
        title: "useRef & DOM Access",
        status: "done",
        analogy: "useState is like a whiteboard visible to the audience — every time you write on it, the audience (the UI) needs to see the update, so React re-renders. useRef is like a sticky note in your pocket — you can read and write to it freely, but nobody else sees it, and writing on it doesn't trigger anyone to look up. React doesn't re-render when a ref changes.",
        core: "useRef(initialValue) returns a mutable ref object with a persistent .current property that remains stable across renders. It has two primary use cases: 1. Direct access to real DOM nodes (e.g. focusing inputs, measuring size, triggering click handlers on hidden elements). 2. Storing a mutable value that persists across renders without triggering a re-render (e.g. holding interval IDs, scroll positions, or cache states). Mutating a ref is a side-effect and must not be done during the render phase.",
        code: `import { useRef, useState, useEffect } from 'react';

// Use Case 1: Direct DOM Access (Hidden Input trigger)
function BulkUpload() {
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    // Imperatively trigger the click event on the hidden input node
    fileInputRef.current.click();
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={(e) => console.log(e.target.files[0])}
      />
      <button className="upload-btn" onClick={handleUploadClick}>
        Upload CSV
      </button>
    </div>
  );
}

// Use Case 2: Mutable Store without Re-renders (Timer control)
function StopWatch() {
  const intervalRef = useRef(null);
  const [seconds, setSeconds] = useState(0);

  const start = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
  };

  const stop = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current); // safe cleanup
  }, []);

  return (
    <div>
      <p>Elapsed: {seconds}s</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}`,
        diagram: `useRef Internal Object Structure:
┌──────────────────────────────────────────────┐
│ useRef(initialValue)                         │
│ Returns stable object: { current: Value }    │
└──────────────────────┬───────────────────────┘
                       │
             Does mutating ref.current 
              trigger a re-render?
                       │
              ┌────────┴────────┐
             Yes               No
              │                 │
          [useState]        [useRef]
         (Affects UI)     (Persisted value /
                           DOM Reference)`,
        mistake: "Using a ref when you actually need state. Changing a ref's value (.current = newVal) does not trigger a re-render, so the UI will remain unchanged. If a value needs to be displayed in the JSX or affect what is rendered, it must be stored in useState.",
        traps: [
          "Reading or writing ref.current during the render phase. Render functions must remain pure. Writing to ref.current during rendering makes it impure, potentially breaking React's Concurrent Features and yielding bugs during Strict Mode's double execution.",
          "Renaming or expecting standard prop behavior when passing refs to child components. React strips the 'ref' prop unless the child component is wrapped in React.forwardRef() (or in React 19, passed directly)."
        ],
        interview: "\"useRef returns a mutable object with a .current property that persists across the component lifecycle. Unlike useState, updating a ref does not trigger a re-render. It is used to hold direct references to DOM elements and store mutable state that doesn't affect what is rendered in the JSX.\"",
        interviewQ: "How does useRef differ from useState, and what are its two primary use cases in React applications?"
      },
      {
        id: "usememo-usecallback",
        title: "useMemo & useCallback",
        status: "done",
        analogy: "Imagine an expensive calculator in your kitchen. Every time anyone opens the kitchen door (component re-renders), you re-run the entire calculation from scratch — even if the inputs to the calculation haven't changed. useMemo is like writing the answer on a sticky note and only recalculating it if the actual inputs change. useCallback is the same sticky-note system, but specifically for caching function references instead of computed values.",
        core: "useMemo memoizes the computed value returned by a calculation function between renders. useCallback memoizes the actual function reference itself to prevent its recreation on every render. Both receive a dependency array. They provide referential stability and optimize performance for expensive operations, but have memory and comparison overhead that makes using them on simple calculations counter-productive.",
        code: `import { useMemo, useCallback, useState } from 'react';

// useMemo: Memoizing expensive value calculations
function OrderSummary({ items }) {
  const total = useMemo(() => {
    console.log('Recalculating total...');
    return items.reduce((sum, item) => sum + item.price, 0);
  }, [items]);

  return <p>Total: {total} EGP</p>;
}

// useCallback: Memoizing function reference for referential stability
function ProductList({ products }) {
  const [cart, setCart] = useState([]);

  const handleAddToCart = useCallback((productId) => {
    setCart(prev => [...prev, productId]);
  }, []); // Empty deps = callback function reference remains identical across renders

  return products.map(p => (
    &lt;ProductCard key={p.id} product={p} onAdd={handleAddToCart} /&gt;
  ));
}`,
        diagram: `Memoization Mechanism Flow:
Parent re-renders
       │
Does props/state change?
       ├─────────────────────────┐
      Yes                       No
       │                         │
Recalculate useMemo callback     Return cached value/ref
Create new useCallback ref       from React memory`,
        mistake: "Overusing them. Caching a simple, cheap calculation (like double = count * 2) introduces more CPU/memory overhead (storing the cache and performing shallow comparison checks on dependencies) than simply running the operation on every render.",
        traps: [
          "Stale Closures: Omitting dependencies from the dependency array, causing the memoized value or callback to reference old state or props from the render in which it was created.",
          "Broken React.memo: Forgetting that passing a newly created inline function or object to a React.memo child bypasses the optimization. You must wrap the function in useCallback to ensure referential stability."
        ],
        interview: "\"useMemo memoizes the result of a function calculation, whereas useCallback memoizes the function reference itself. They prevent unnecessary recalculations and re-renders of memoized child components by providing referential stability. They should only be used when calculations are heavy or when passed to memoized children to maintain reference equality.\"",
        interviewQ: "How do useMemo and useCallback differ, and what are the visual and performance implications of failing to memoize an inline function passed to a React.memo child?"
      },
      {
        id: "usecontext-basics",
        title: "useContext & Prop Drilling",
        status: "done",
        analogy: "Imagine a company memo that needs to reach the CEO's direct reports, their reports, and so on. Without a shared bulletin board, someone has to manually pass the memo down the chain, even through managers who don't care about it, just to relay it. That is prop drilling. useContext is a shared bulletin board. You pin the memo once, and anyone at any level who needs it walks up and reads it directly.",
        core: "Context provides a way to pass data through the component tree without having to pass props down manually at every level (solving prop drilling). The createContext function initializes a Context object. The Context.Provider component makes a value available to all descendants in the tree. The useContext(Context) hook consumes the value from the nearest matching Provider above it. Context is best suited for low-frequency global settings like authentication state, language, or themes.",
        code: `import { createContext, useContext, useState, useMemo } from 'react';

// 1. Create the context
const ThemeContext = createContext('dark');

// 2. Provide context value at the top
function App() {
  const [theme, setTheme] = useState('dark');
  
  // Memoize the value object to avoid reference changes and unnecessary consumer renders
  const contextValue = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <PageLayout />
    </ThemeContext.Provider>
  );
}

// 3. Consume context value anywhere inside the tree
function ThemeToggleButton() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Current Theme: {theme}
    </button>
  );
}`,
        diagram: `Context Tree Walk:
App (ThemeContext.Provider)
 │
PageLayout (does not read Context)
 │
ThemeToggleButton (useContext(ThemeContext) walks up tree to App Provider)`,
        mistake: "Using Context for state that updates frequently (e.g. tracking keypresses or real-time ticker prices). Any value change on the Provider triggers a re-render of all components consuming that context, causing critical performance regressions on high-frequency updates.",
        traps: [
          "Passing raw, inline object literals as the provider's value (e.g., value={{ user, theme }}). This recreates the object reference on every render, causing all consumer components to re-render even if the underlying data is identical. Wrap the value in useMemo.",
          "Confusing Context with state management. Context is a transport mechanism (a way to pass values down), not a state engine. You must pair it with useState/useReducer to store/manage data."
        ],
        interview: "\"useContext provides a way to transport data down the component tree without manual prop drilling. A component consuming context via the hook subscribes to updates of the nearest matching Provider above it. Because updates to the Provider value trigger re-renders in all consumer components, Context is best utilized for low-frequency global state like user authentication, themes, or locales.\"",
        interviewQ: "What is prop drilling, how does useContext solve it, and what are the performance implications of updating a Context Provider's value?"
      }
    ]
  }
);
