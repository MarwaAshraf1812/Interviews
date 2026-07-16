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
      }
    ]
  }
);
