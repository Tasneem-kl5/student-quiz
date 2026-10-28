const express = require("express");
const app = express();
app.use(express.json());
const path = require("path");
const questions = require("../data/questions.json");

app.use(express.static(path.join(__dirname, "../public")));
app.get("/api/questions", function (req, res) {
    const publicQuestions = questions.map(function (question) {
        return {
            id: question.id,
            text: question.text,
            options: question.options
        };
    });

    res.json(publicQuestions);
});
app.post("/api/submit", function (req, res) {

    const name = req.body.name;
    const answers = req.body.answers;

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

        if (answer.selectedIndex === question.correctIndex) {
            score++;
        }
    }

    res.json({
        score: score,
        total: questions.length,
        passed: score >= 3
    });


});
const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log("Server running on port " + PORT);
});