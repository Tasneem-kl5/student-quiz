const express = require("express");
const app = express();
app.use(express.json());
const path = require("path");
const { randomUUID } = require("crypto");
const quizAttempts = new Map();
const questions = require("../data/questions.json");
function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function createQuestion(id) {
    const first = randomInteger(1, 20);
    const second = randomInteger(1, 20);
    const correctAnswer = first + second;

    const choices = [
        correctAnswer,
        correctAnswer + 1,
        correctAnswer + 2,
        correctAnswer + 3
    ];

    for (let i = choices.length - 1; i > 0; i--) {
        const j = randomInteger(0, i);
        [choices[i], choices[j]] = [choices[j], choices[i]];
    }

    return {
        id: id,
        text: "What is " + first + " + " + second + "?",
        options: choices.map(String),
        correctIndex: choices.indexOf(correctAnswer)
    };
}
app.use(express.static(path.join(__dirname, "../public")));
app.get("/api/questions", function (req, res) {
    const questions = [];

    for (let id = 1; id <= 5; id++) {
        questions.push(createQuestion(id));
    }

    const attemptId = randomUUID();

    quizAttempts.set(attemptId, {
        questions: questions,
        createdAt: Date.now()
    });

    const publicQuestions = questions.map(function (question) {
        return {
            id: question.id,
            text: question.text,
            options: question.options
        };
    });

    res.set("Cache-Control", "no-store");

    res.json({
        attemptId: attemptId,
        questions: publicQuestions
    });
});
app.post("/api/submit", function (req, res) {

    const name = req.body.name;
    const answers = req.body.answers;
    const attempt = quizAttempts.get(req.body.attemptId);

    if (!attempt) {
        return res.status(400).json({
            message: "Quiz attempt not found. Please restart the quiz."
        });
    }

    const questions = attempt.questions;

    if (typeof name !== "string" || name.trim() === "") {
        return res.status(400).json({
            message: "Please enter your name"
        });
    }
    if (!Array.isArray(answers) || answers.length !== questions.length) {
        return res.status(400).json({
            message: "Please answer all questions"
        });
    }
    let score = 0;
    const results = [];
    for (let q = 0; q < questions.length; q++) {
        const question = questions[q];
        const matchingAnswers = answers.filter(function (answer) {
            return answer !== null &&
                typeof answer === "object" &&
                answer.questionId === question.id;
        });
        if (matchingAnswers.length !== 1) {
            return res.status(400).json({
                message: "Each question needs exactly one answer"
            });
        }
        const answer = matchingAnswers[0];

        if (
            !Number.isInteger(answer.selectedIndex) ||
            answer.selectedIndex < 0 ||
            answer.selectedIndex >= question.options.length
        ) {
            return res.status(400).json({
                message: "Invalid answer option"
            });
        }
        const isCorrect =
            answer.selectedIndex === question.correctIndex;

        if (isCorrect) {
            score++;
        }

        results.push({
            questionId: question.id,
            selectedIndex: answer.selectedIndex,
            isCorrect: isCorrect
        });
    }

    res.json({
        score: score,
        total: questions.length,
        passed: score >= 3,
        results: results
    });


});
const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log("Server running on port " + PORT);
});