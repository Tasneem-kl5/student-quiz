console.log("javaScript is connected");
const nameInput = document.getElementById("studentName");

const startButton = document.getElementById("startButton");
const questionsContainer = document.getElementById("questionsContainer");
let questions = [];


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

        questions = await response.json();

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
        startButton.style.display = "none";
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


const submitButton = document.getElementById("submitButton");
submitButton.addEventListener("click", submitQuiz);

const restartButton = document.getElementById("restartButton");

function restartQuiz() {
    questionsContainer.textContent = "";
    resultContainer.textContent = "";
    nameInput.value = "";
    questions = [];

    submitButton.style.display = "none";
    startButton.style.display = "inline-block";
    restartButton.hidden = true;

    nameInput.focus();
}

restartButton.addEventListener("click", restartQuiz);



