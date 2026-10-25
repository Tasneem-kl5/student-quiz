# Student Quiz

A quiz website with five multiple-choice questions.

## Features

- Enter a student name.
- Answer five questions.
- Grade answers on the backend.
- Display the score and pass/fail result.
- Pass with at least 3 correct answers.
- Restart the quiz.
- Show a helpful message if a request fails.

## Technologies

HTML, CSS, JavaScript, Node.js, Express, and JSON.

## Requirements

Node.js and npm.

## Run locally

Open a terminal in the project folder.

Install dependencies:

```bash
npm install
```

Start the server:

```bash
node server/server.js
```

Open http://localhost:3000 in your browser.

Keep the terminal running. Press Ctrl+C to stop the server.
After editing backend code or questions.json, restart the server.

## Project structure

- public/: Frontend files.
- server/server.js: Server routes, validation, and grading.
- data/questions.json: Questions, options, and correct answers.
- package.json: Project information and dependencies.

## API

- GET /api/questions: Returns questions without correct answers.
- POST /api/submit: Validates answers and returns score, total, and passed.