# Technical Interview Preparation & Skill Tracking Hub 🚀

Welcome to my daily technical interview preparation repository. This project is a structured, interactive playground designed to track study progress, solidify core software engineering concepts, and build active-recall revision sheets for tech interviews.

## 🌟 Live Dashboard
The repository is deployed and hosted live on GitHub Pages.
🔗 **Live Link:** [https://marwaashraf1812.github.io/Interviews/](https://marwaashraf1812.github.io/Interviews/)

---

## 📂 Repository Structure

The project is organized into modular folders, each dedicated to a specific skill or engineering domain:

```bash
.
├── index.html                   # Global Hub Dashboard (HTML/CSS)
├── README.md                    # Repository documentation
└── JS/                          # JavaScript Domain Track
    └── js-mastery-tracker.html  # Unified Study Chain Tracker & Revision Console
```

---

## ⚡ Active Domain Tracks

### 1. JavaScript Deep Dive (Active)
*   **JS Study Chain Tracker & Revision Console (`JS/js-mastery-tracker.html`):** Visualizes core concepts as a linked chain, tracking study progress, under-the-hood V8 engine behaviors, code examples, common traps, and mock questions.

### 2. Planned Tracks (Coming Soon)
*   HTML5 & CSS3 Layouts
*   React & Next.js Frameworks
*   Node.js Backend Internals
*   Databases & SQL Optimization
*   Distributed System Design

---

## 🛠️ Daily Workflow: Adding New Skills

When starting a new skill (e.g. `React`):

1.  **Create a folder** at the root of the repository:
    ```bash
    mkdir React
    ```
2.  **Add tracker files** matching the established layout template (copy from `JS/` templates).
3.  **Update the root `index.html`**:
    *   Change the target card's class from `locked-track` to `active-track`.
    *   Add links to the new tracker files.
4.  **Push to GitHub** to automatically update the live site:
    ```bash
    git add .
    git commit -m "feat: add React study track files"
    git push origin main
    ```

---

## 👤 Author
*   **Marwa Ashraf**
*   GitHub: [@MarwaAshraf1812](https://github.com/MarwaAshraf1812)
*   Email: marashraf090@gmail.com
