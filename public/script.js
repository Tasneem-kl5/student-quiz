console.log("javaScript is connected");
const nameInput = document.getElementById("studentName");

const startButton = document.getElementById("startButton");
const questionsContainer = document.getElementById("questionsContainer");
let questions = [];
let attemptId = null;


const resultContainer = document.getElementById("resultContainer");
async function startQuiz() {
    const studentName = nameInput.value.trim();

    if (studentName === "") {
        alert("Please enter your name");
        return;
    }

    startButton.disabled = true;
    resultContainer.textContent = "Loading questions...";

    try {
        const response = await fetch("/api/questions");

        if (!response.ok) {
            throw new Error("Could not load questions");
        }

        const quiz = await response.json();
        questions = quiz.questions;
        attemptId = quiz.attemptId;

        questionsContainer.textContent = "";
        resultContainer.textContent = "";

        for (let q = 0; q < questions.length; q++) {
            const question = questions[q];
            const questionContainer = document.createElement("div");

            const heading = document.createElement("h2");
            heading.textContent = (q + 1) + ". " + question.text;
            questionContainer.appendChild(heading);

            for (let i = 0; i < question.options.length; i++) {
                const optionContainer = document.createElement("div");
                optionContainer.className = "answer-option";

                const optionInput = document.createElement("input");
                optionInput.type = "radio";
                optionInput.name = "question" + (q + 1);
                optionInput.value = i;
                optionInput.id = "question" + q + "-option" + i;

                const optionLabel = document.createElement("label");
                optionLabel.textContent = question.options[i];
                optionLabel.htmlFor = optionInput.id;

                optionContainer.appendChild(optionInput);
                optionContainer.appendChild(optionLabel);
                questionContainer.appendChild(optionContainer);
            }

            questionsContainer.appendChild(questionContainer);
        }

        submitButton.style.display = "inline-block";
        updateSubmitButton();
        startButton.style.display = "none";
        nameInput.disabled = true;
    } catch (error) {
        resultContainer.textContent =
            "Could not load questions. Check the server and try again.";
    } finally {
        startButton.disabled = false;
    }
}

async function submitQuiz() {
    const answers = [];

    for (let q = 0; q < questions.length; q++) {
        const selectedAnswer = document.querySelector(
            'input[name="question' + (q + 1) + '"]:checked'
        );

        if (selectedAnswer === null) {
            alert("Please answer question " + (q + 1));
            return;
        }

        answers.push({
            questionId: questions[q].id,
            selectedIndex: Number(selectedAnswer.value)
        });
    }

    submitButton.disabled = true;
    restartButton.disabled = true;
    resultContainer.textContent = "Checking answers...";

    try {
        const response = await fetch("/api/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: nameInput.value.trim(),
                attemptId: attemptId,
                answers: answers
            })
        });

        const result = await response.json();

        if (!response.ok) {
            resultContainer.textContent = result.message;
            return;
        }

        resultContainer.textContent =
            "Your score: " + result.score + "/" + result.total +
            " — " + (result.passed ? "Passed" : "Failed");
        showAnswerFeedback(result.results);
        restartButton.hidden = false;
    } catch (error) {
        resultContainer.textContent =
            "Could not submit answers. Check the server and try again.";
    } finally {
        submitButton.disabled = false;
        restartButton.disabled = false;
    }
}
startButton.addEventListener("click", startQuiz);
nameInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !startButton.disabled) {
        event.preventDefault();
        startQuiz();
    }
});


const submitButton = document.getElementById("submitButton");
submitButton.addEventListener("click", submitQuiz);

const restartButton = document.getElementById("restartButton");

function restartQuiz() {
    questionsContainer.textContent = "";
    resultContainer.textContent = "";
    nameInput.value = "";
    nameInput.disabled = false;
    questions = [];

    submitButton.style.display = "none";
    startButton.style.display = "inline-block";
    restartButton.hidden = true;

    nameInput.focus();
}
function updateSubmitButton() {
    const answeredCount = questionsContainer.querySelectorAll(
        'input[type="radio"]:checked'
    ).length;

    submitButton.disabled = answeredCount !== questions.length;
}
questionsContainer.addEventListener("change", updateSubmitButton);
restartButton.addEventListener("click", restartQuiz);



function showAnswerFeedback(results) {
    questionsContainer.querySelectorAll(".answer-option").forEach(function (row) {
        row.classList.remove("is-wrong", "is-correct");
    });

    results.forEach(function (answerResult) {
        const questionIndex = questions.findIndex(function (question) {
            return question.id === answerResult.questionId;
        });

        const input = document.getElementById(
            "question" + questionIndex +
            "-option" + answerResult.selectedIndex
        );

        if (input) {
            const className = answerResult.isCorrect
                ? "is-correct"
                : "is-wrong";

            input.parentElement.classList.add(className);
        }
    });
}