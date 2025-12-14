# Commitly - AI-Powered GitHub Repository Auditor

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-MVP-success)

**Commitly** acts as an automated mentor for developers. By analyzing GitHub repositories, it provides a 0-100 "Employability Score", generates meaningful metrics, and offers a personalized roadmap to help developers improve their code quality and project structure.

---

## 🚀 Problem & Solution

**The Problem:** Junior developers often build great projects but fail to present them professionally (e.g., missing READMEs, inconsistent commits, lack of tests). Recruiters spend seconds on a repo and miss the value.

**The Solution:** Commitly scans a repository and instantly highlights:
*   **Documentation Quality**: Is there a README? Does it have setup steps?
*   **Code Reliability**: Are there automated tests?
*   **Maintainability**: Is the folder structure organized?
*   **Activity**: Are commits consistent?

It then generates a **Personalized Roadmap** to fix these issues, turning a "Junior" project into an "Expert" one.

---

## 🛠 Tech Stack

*   **Frontend**: React (Vite), Lucide React (Icons), CSS Modules (Premium Dark Mode).
*   **Backend**: Node.js, Express.js.
*   **Services**:
    *   **GitHub REST API**: For fetching metadata, trees, and logic.
    *   **Custom Scoring Engine**: Deterministic algorithm for 0-100 grading.
    *   **NLP-Style Generator**: Creates human-like summaries.

---

## 🧠 Scoring Logic (The "Brain")

We evaluate repositories based on 4 pillars:

1.  **Documentation (30%)**: Checks for README existence, length, and key sections (Setup, Usage).
2.  **Reliability (20%)**: scans for testing frameworks (`.test.js`, `__tests__`, `pytest`).
3.  **Consistency (10%)**: Analyzes commit frequency over time.
4.  **Structure (20%)**: Evaluates folder depth and file organization.
5.  **Baseline**: Every project starts with a baseline score.

---

## 📸 Demo Flow

1.  **Paste URL**: Enter a GitHub repository (e.g., `https://github.com/facebook/react`).
2.  **Analyze**: Click the button. The backend fetches data in real-time.
3.  **Review**:
    *   **Score Gauge**: See your 0-100 rating.
    *   **Mentor Summary**: Read a human-like critique.
    *   **Roadmap**: Follow the step-by-step checklist to improve.

---

## 🔧 Installation & Setup

### Backend
```bash
cd server
npm install
# Create .env with GITHUB_TOKEN=your_token (optional for higher rate limits)
npm start
# Runs on http://localhost:5000
```

### Frontend
```bash
cd client
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## 🔮 Future Improvements
*   **AI Integration**: Replace rule-based logic with LLM analysis for code style.
*   **Badges**: Generate "Verified by Commitly" badges for READMEs.
*   **Historic Trends**: Track score improvements over time.
