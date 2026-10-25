# Student Quiz Application — Beginner Full-Stack Plan

## Goal
Build a small quiz website. A student enters a name, answers **5 multiple-choice questions**, submits answers, and sees a score out of 5 and a pass/fail message.

## Tech stack
- Frontend: HTML, CSS, vanilla JavaScript
- Backend: Node.js and Express
- Data: `questions.json` (no database)
- Communication: `fetch()` and JSON

> New concepts beyond JavaScript Fundamentals: DOM, click events, async/await, Fetch API, HTTP, and Express. Learn only what you need at each step.

## How it works
1. The student enters a name and clicks **Start Quiz**.
2. Frontend requests `GET /api/questions`.
3. Backend reads the questions file and sends question text, options, and IDs **without correct answers**.
4. Student selects answers and clicks **Submit**.
5. Frontend sends name and selected answers to `POST /api/submit`.
6. Backend checks answers against its own data and returns score and pass/fail.
7. Frontend displays the result and a **Restart** button.

## Suggested structure
```text
student-quiz/
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── data/
│   └── questions.json
├── server/
│   ├── server.js
│   └── quizLogic.js
└── package.json
```

## Step-by-step checklist

### Phase 1 — Frontend
- [ ] **1. Create folders and files.** Open `student-quiz` in VS Code and make the structure above.
- [ ] **2. Build `index.html`.** Add a name input, Start button, question container, Submit button, and result container.
- [ ] **3. Add `style.css`.** Center the quiz card, style answer choices and buttons, and keep the page usable on a phone.
- [ ] **4. Make five sample questions.** In `data/questions.json`, give each question an ID, text, four choices, and a correct option ID. Example shape: `{ "id": 1, "text": "2 + 2?", "options": ["3", "4", "5", "6"], "correctIndex": 1 }`.
- [ ] **5. Practice quiz logic separately.** Write a function that loops through sample answers and counts correct ones. Use variables, comparisons, `if/else`, and `for`.

### Phase 2 — Backend
- [ ] **6. Initialize Node.** In the project terminal, run `npm init -y` and `npm install express`.
- [ ] **7. Create `server/server.js`.** Set up Express, enable `express.json()`, serve the `public` directory, and listen on port 3000. Use paths that work from the project root.
- [ ] **8. Add `GET /api/questions`.** Read `questions.json` and return only public question fields. Never send `correctIndex` to the browser before submission.
- [ ] **9. Add `POST /api/submit`.** Accept `{ "name": "Sara", "answers": [{ "questionId": 1, "selectedIndex": 1 }] }`. Reject invalid input, compare submitted answers with the stored answer key, and return `{ "score": 4, "total": 5, "passed": true }`. Define passing as at least 3/5.

### Phase 3 — Connect and finish
- [ ] **10. Load questions from frontend JavaScript.** When Start is clicked, validate the name, call `fetch('/api/questions')`, and render the questions.
- [ ] **11. Submit answers.** Gather selected choices, call `fetch('/api/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(...) })`, and show the response.
- [ ] **12. Add Restart.** Clear selected answers and score, then start a new quiz.
- [ ] **13. Test.** Try all-correct, all-wrong, unanswered questions, blank name, duplicate answers, and a stopped server. Show a friendly error if a request fails.
- [ ] **14. Finish.** Remove unused code and add a short README with setup and run instructions.

## Run and verify
From the project root, start with `node server/server.js`, then open `http://localhost:3000` in your browser. The quiz is done when questions load from the backend, grading happens on the backend, and the result appears correctly.

## JavaScript Fundamentals practice
- **Hello world / structure / strict mode:** Start with `console.log('Hello, world!')`; use readable statements and `'use strict'` in classic scripts. ES modules are strict automatically.
- **Variables / data types / conversions:** Name is a string, score a number, passed a boolean; convert submitted indexes to validated integers if necessary.
- **Math / comparisons / conditionals / logical operators:** Count correct answers; use `>=`, `===`, `if/else`, `&&`, `||`, and `!`.
- **`??`:** Use a fallback for an optional display label, not to bypass required-name validation.
- **Loops:** Use `for` to grade five questions; optionally practice `while` in a small separate exercise.
- **`switch`:** Optional small extension: display a message based on score category (low/medium/high).
- **Functions / function expressions / arrow functions:** Write `gradeQuiz()`, assign a callback to a variable, and use an arrow function for a small helper.
- **Modules / import / export:** Export grading logic from `quizLogic.js` and import it into the backend (choose one consistent Node module system; ES modules with `"type": "module"` is a good choice).
- **alert / prompt / confirm / ternary:** Practice a welcome `alert`, optional `prompt` exercise, `confirm` before restart, and a ternary for pass/fail text.

## Keep it small
No login, timer, leaderboard, database, or admin panel. Finish the basic quiz first.
