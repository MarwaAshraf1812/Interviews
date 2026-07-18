if (!window.TRACKER_DATA) window.TRACKER_DATA = [];

window.TRACKER_DATA.push(
  {
    batch: "Batch D — React Internals (Under the Hood)",
    topics: [
      {
        id: "fiber-architecture",
        title: "D.1 — Fiber Architecture",
        status: "done",
        analogy: "Imagine an old-school assembly line worker who, once they start building a car, cannot stop until the entire car is finished — even if an ambulance needs to rush through the factory floor. That's the Stack Reconciler. Fiber is like giving that worker the ability to pause mid-task, let the urgent thing (like user input) through, then resume exactly where they left off without losing their place.",
        core: "React Fiber is a rewrite of the reconciliation core, representing the component tree as a singly linked list of Fiber nodes. It splits rendering into two phases: 1) Render Phase: asynchronous and interruptible, where React traverses the tree to compute diffs and identify needed DOM changes. 2) Commit Phase: synchronous and uninterruptible, where React writes updates to the actual DOM. Hook state is stored in a linked list in the Fiber's memoizedState field in the call order, which is the structural reason the Rules of Hooks exist.",
        code: `// Simplified structure of a Fiber Node
const fiber = {
  type: 'div',              // Element type
  key: null,
  stateNode: null,          // Pointer to actual DOM node
  
  // Singly Linked List pointers
  child: firstChildFiber,
  sibling: siblingFiber,
  return: parentFiber,      // return = parent node to go back to
  
  pendingProps: {...},
  memoizedProps: {...},
  memoizedState: {...},     // Linked list of hook states!
};`,
        diagram: `Fiber Linked List Tree Traversal:
                    App Fiber
                    /   |
              child/    |return
                  /      |
         Header Fiber ──sibling──► Dashboard Fiber
              |                         |
              |return              child/  |return
              |                        /
         (no children)      Sidebar Fiber ──sibling──► Content Fiber`,
        mistake: "Thinking that hooks state is stored internally within the component function itself. It lives on the corresponding Fiber node. If hooks are called conditionally, the linked list order gets corrupted, leading to incorrect state mapping.",
        traps: [
          "Thinking that Fiber makes DOM writes asynchronous. The Commit phase is strictly synchronous to prevent visual flickering or partial rendering on the screen.",
          "Violating Rules of Hooks in loops or conditionals: React relies purely on the hook call order to match the hook to its state entry in the Fiber's memoizedState linked list."
        ],
        interview: "\"The Stack Reconciler executed updates recursively and synchronously, blocking the main thread on large trees. React Fiber is a linked-list-based scheduling architecture that represents the call stack virtually, splitting rendering into an interruptible Render Phase (computing changes) and an uninterruptible Commit Phase (writing DOM changes atomically to prevent visual tearing).\"",
        interviewQ: "Explain why the render phase can be interrupted/paused, but the commit phase cannot. What would go wrong if commit were interruptible?"
      },
      {
        id: "concurrent-rendering",
        title: "D.2 — Concurrent Rendering, useTransition, useDeferredValue",
        status: "pending"
      }
    ]
  }
);
