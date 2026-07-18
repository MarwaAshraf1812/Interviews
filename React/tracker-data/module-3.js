if (!window.TRACKER_DATA) window.TRACKER_DATA = [];

window.TRACKER_DATA.push(
  {
    batch: "Batch C — Advanced React Patterns",
    topics: [
      {
        id: "composition-patterns",
        title: "C.1 — Composition Patterns (Compound Components, Render Props, HOCs)",
        status: "done",
        analogy: "Imagine a restaurant menu with fixed combos (\"Burger + Fries + Drink\", no substitutions) vs a build-your-own-bowl place where you pick each ingredient yourself, but the system (bowl → base → toppings → sauce) enforces a sensible structure. Composition patterns are React's way of building the build-your-own-bowl kind: giving consumers flexibility within a structural boundary instead of one rigid, over-configured component with dozens of boolean props.",
        core: "Composition patterns solve the problem of 'prop explosion' and rigid APIs. Instead of configuration-driven components, we compose components from smaller, focused elements. 1) Compound Components use implicit state sharing via Context (e.g., Modal, Modal.Header, Modal.Body). 2) Render Props return UI from a function prop to separate logic from layout. 3) Higher-Order Components (HOCs) wrap a component to inject behavior. Custom hooks have largely replaced HOCs and Render Props for state/logic sharing, while Compound Components remain vital for flexible UI design.",
        code: `import { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

// 1. Compound Component Pattern
function Modal({ children, onClose }) {
  return (
    <ModalContext.Provider value={{ onClose }}>
      <div className="modal-overlay">{children}</div>
    </ModalContext.Provider>
  );
}

Modal.Header = function ModalHeader({ children }) {
  const { onClose } = useContext(ModalContext);
  return (
    <div className="modal-header">
      {children}
      <button onClick={onClose}>&times;</button>
    </div>
  );
};

Modal.Body = function ModalBody({ children }) {
  return <div className="modal-body">{children}</div>;
};

Modal.Footer = function ModalFooter({ children }) {
  return <div className="modal-footer">{children}</div>;
};

// Usage:
function App() {
  const [show, setShow] = useState(false);
  return (
    <Modal onClose={() => setShow(false)}>
      <Modal.Header>Delete Product</Modal.Header>
      <Modal.Body>Are you sure you want to delete this product?</Modal.Body>
      <Modal.Footer>
        <button onClick={() => setShow(false)}>Cancel</button>
      </Modal.Footer>
    </Modal>
  );
}`,
        diagram: `Compound Component Implicit Context:
Modal (Provider: onClose)
 ├── Modal.Header (Consumes: onClose)
 ├── Modal.Body (Children)
 └── Modal.Footer (Children)`,
        mistake: "Using Render Props or HOCs for sharing pure state/logic in modern code. Today, custom hooks are the standard and cleaner way to share stateful logic without introducing wrapper hell or unnecessary component hierarchy.",
        traps: [
          "Prop Explosion: Adding dozens of boolean properties (e.g. showFooter, showCloseIcon, centerTitle) to a single monolith component, making it extremely rigid, hard to maintain, and unable to support unforeseen layout changes.",
          "Context dependency in Compound Components: Children like Modal.Header require being nested within a Modal Provider. Using them outside the Provider will cause a runtime error unless a default context value is carefully handled."
        ],
        interview: "\"Composition patterns like Compound Components, Render Props, and Higher-Order Components (HOCs) shift control of layout and markup from the component author to the consumer. Compound Components share implicit state via Context, allowing flexible layouts. While HOCs and Render Props were previously used to share stateful logic, modern React uses custom hooks for logic sharing, leaving composition patterns primarily for UI flexibility.\"",
        interviewQ: "What is prop explosion, and how do compound components solve it compared to single-component prop configuration?"
      }
    ]
  }
);
