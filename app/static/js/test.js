let currentQuestionIndex = 0;
let questions = [];
let answeredQuestions = [];
let selectedAnswers = [];
let correctAnswers = 0;

async function startQuiz() {
    const subject = document.getElementById('subject').value;
    const grade = document.getElementById('grade').value;
    const numQuestions = document.getElementById('numQuestions').value;

    if (subject !== 'BEL' || grade !== '12') {
        alert('Грешка: Наличен е само предметът БЕЛ за 12 клас.');
        return;
    }

    try {
        const response = await fetch(`/api/test/${grade}/${subject}/${numQuestions}`);
        if (!response.ok) throw new Error('Неуспешно зареждане на въпросите.');
        questions = await response.json();
        if (questions.length === 0) throw new Error('Няма налични въпроси.');

        document.getElementById('quiz-setup').style.display = 'none';
        document.getElementById('quiz-container').style.display = 'block';
        renderQuestion();
        renderProgressBar();
    } catch (error) {
        alert(error.message);
    }
}

function renderQuestion() {
    if (currentQuestionIndex >= questions.length) {
        showResults();
        return;
    }

    const question = questions[currentQuestionIndex];
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = `
        <h2>Въпрос ${currentQuestionIndex + 1}</h2>
        <p>${question.question}</p>
        <div class="options">
            ${Object.entries(question.options).map(([key, value]) => `
                <button class="option-btn ${selectedAnswers[currentQuestionIndex] === key ? 'selected' : ''}" 
                        onclick="selectAnswer('${key}')">${value}</button>
            `).join('')}
        </div>
    `;
}

function renderProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    progressBar.innerHTML = '';
    for (let i = 0; i < questions.length; i++) {
        const box = document.createElement('div');
        box.className = 'progress-box';
        if (answeredQuestions.includes(i)) {
            box.classList.add('answered');
        }
        box.textContent = i + 1;
        box.onclick = () => goToQuestion(i);
        progressBar.appendChild(box);
    }
}

function goToQuestion(index) {
    currentQuestionIndex = index;
    renderQuestion();
    renderProgressBar();
}

function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
        renderProgressBar();
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
        renderProgressBar();
    }
}

function selectAnswer(answerKey) {
    selectedAnswers[currentQuestionIndex] = answerKey;

    // Highlight the selected answer
    const options = document.querySelectorAll('.option-btn');
    options.forEach(option => option.classList.remove('selected'));
    const selectedOption = Array.from(options).find(option => option.textContent === questions[currentQuestionIndex].options[answerKey]);
    if (selectedOption) {
        selectedOption.classList.add('selected');
    }

    if (!answeredQuestions.includes(currentQuestionIndex)) {
        answeredQuestions.push(currentQuestionIndex);
    }
    renderQuestion();
    renderProgressBar();
}

function showResults() {
    correctAnswers = selectedAnswers.reduce((count, answer, index) => {
        return count + (answer === questions[index].answer ? 1 : 0);
    }, 0);

    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = `
        <div class="results-summary">
            <i class="fas fa-award"></i>
            <h2>Резултати</h2>
            <p>Правилни отговори: ${correctAnswers} от ${questions.length}</p>
            <p>Процент успеваемост: ${((correctAnswers / questions.length) * 100).toFixed(1)}%</p>
        </div>
        <div class="results-questions">
            <div id="review-progress-bar" class="progress-bar"></div>
            <div id="review-question-container" class="question-review"></div>
            <div class="navigation-buttons">
                <button class="nav-btn" onclick="reviewPreviousQuestion()" id="review-prev">Предишен въпрос</button>
                <button class="nav-btn" onclick="reviewNextQuestion()" id="review-next">Следващ въпрос</button>
            </div>
        </div>
    `;

    currentQuestionIndex = 0;
    renderReviewQuestion();
    renderReviewProgressBar();
    document.getElementById('quiz-container').style.display = 'none';
    resultsContainer.style.display = 'block';
}

function renderReviewQuestion() {
    const question = questions[currentQuestionIndex];
    const container = document.getElementById('review-question-container');
    const userAnswer = selectedAnswers[currentQuestionIndex];
    const isCorrect = userAnswer === question.answer;

    container.innerHTML = `
        <h3>Въпрос ${currentQuestionIndex + 1}</h3>
        <p>${question.question}</p>
        <div class="answer-comparison">
            <div class="your-answer">
                <h4>Твоят отговор:</h4>
                <p>${question.options[userAnswer]}</p>
            </div>
            <div class="correct-answer">
                <h4>Правилен отговор:</h4>
                <p>${question.options[question.answer]}</p>
            </div>
        </div>
    `;
}

function renderReviewProgressBar() {
    const progressBar = document.getElementById('review-progress-bar');
    progressBar.innerHTML = '';
    for (let i = 0; i < questions.length; i++) {
        const box = document.createElement('div');
        box.className = 'progress-box';
        box.classList.add(selectedAnswers[i] === questions[i].answer ? 'answered' : 'wrong');
        box.textContent = i + 1;
        box.onclick = () => reviewGoToQuestion(i);
        progressBar.appendChild(box);
    }
}

function reviewNextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        renderReviewQuestion();
        renderReviewProgressBar();
    }
}

function reviewPreviousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderReviewQuestion();
        renderReviewProgressBar();
    }
}

function reviewGoToQuestion(index) {
    currentQuestionIndex = index;
    renderReviewQuestion();
    renderReviewProgressBar();
}

function finishTest() {
    if (answeredQuestions.length < questions.length) {
        const confirmFinish = confirm("Не сте отговорили на всички въпроси. Сигурни ли сте, че искате да завършите теста?");
        if (!confirmFinish) return;
    }
    showResults();
}

function confirmLeaveTest() {
    return confirm("Сигурни ли сте, че искате да напуснете теста? Напредъкът ви ще бъде загубен.");
}