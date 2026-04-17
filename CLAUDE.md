# AI-901 Study Guide — CLAUDE.md

## Project Overview
Static HTML study site for the Microsoft AI-901 (Azure AI Fundamentals) certification exam.
No build step, no framework — plain HTML/CSS/JS served directly from files.

## File Structure
```
ai-901/
├── index.html          # Landing page: hero, domain weight bars, quick nav cards
├── objectives.html     # Exam objectives accordion (Domain 1 & Domain 2)
├── tracker.html        # Study checklist + Practice Exam launch + last score display
├── quiz.html           # 50-question practice exam (random from 300-question pool)
├── resources.html      # Official Microsoft Learn links
├── .gitignore          # Excludes users/ folder
├── css/
│   └── styles.css      # Shared stylesheet for all pages
└── js/
    ├── questions.js    # 300 exam questions tagged domain:1 or domain:2
    └── user.js         # Username system (localStorage-based, no password)
```

## Key Design Decisions

### Quiz System
- **300 questions** total in `js/questions.js`, each tagged `domain: 1` or `domain: 2`
- **50 random questions** selected per quiz session (Fisher-Yates shuffle of full pool)
- Each question has `type: 'mc'` (4 options) or `type: 'tf'` (True/False)
- Fields: `{ domain, type, q, opts, a }` where `a` is the 0-based index of the correct answer
- Quiz flow: select answer → Check Answer (locks, reveals correct) → Next/Previous → Submit
- Previous button shows past questions read-only (answers cannot be changed)
- Results show overall %, Domain 1 %, Domain 2 % with per-domain verdict messages
- Review screen shows all 50 questions with selected vs correct answers

### User Account System (`js/user.js`)
- Username stored in `localStorage` under key `ai901_username`
- No password — purely for namespacing scores locally
- Quiz scores stored as `ai901_quiz_{username}` in `localStorage`
- Tracker page reads last score and displays Domain 1 / Domain 2 breakdown chips
- `users/` directory is `.gitignore`d — user data never committed to the repo

### Score Thresholds
- **< 70%**: "Keep grinding" message
- **70–89%**: "Solid foundation" message  
- **≥ 90%**: "Elite-level knowledge" message

### Navigation
- Nav links: Objectives | Quiz (→ tracker.html) | Resources
- Logo always links back to index.html
- Active page nav link gets `.active` class (highlighted with accent2 border)

## Adding Questions
Add objects to the `QUESTION_BANK` array in `js/questions.js`:
```js
{ domain: 1, type: 'mc', q: "Question text?",
  opts: ["Option A", "Option B", "Option C", "Option D"], a: 1 },
{ domain: 2, type: 'tf', q: "True or false statement.",
  opts: ["True", "False"], a: 0 },
```

## Exam Context
- **Exam**: AI-901 Azure AI Fundamentals (Beta, replaces AI-900 June 30 2026)
- **Domains**: Domain 1 (40–45%) = AI Concepts & Responsibilities; Domain 2 (55–60%) = Implement via Microsoft Foundry
- **Format**: 40–60 questions, 45 min, passing score 700/1000
