const MATH__URL = 'https://x-math.herokuapp.com/api/random';

const form = document.querySelector('.quiz');
const timerEl = document.querySelector('.quiz__timer');
const startBtn = document.querySelector('.quiz__start');
const questionEl = document.querySelector('.quiz__question');
const answerEl = document.querySelector('.quiz__answer');
const resetBtn = document.querySelector('.quiz__reset');

const blueScreen = document.querySelector('.blue-screen');
const refreshPageBtn = document.querySelector('.blue-screen__refresh');

let expAnswer = '';
let timeout = undefined;

const questionCount = 10;
let currentQuestionCount = 0;
let score = 0;

startBtn.addEventListener('click', () => {
  startBtn.classList.add('dn');
  questionEl.classList.remove('dn');
  answerEl.classList.remove('dn');
  getMathQuiz();
})

async function getMathQuiz() {
  const resp = await fetch(MATH__URL)
  .catch(error => {
    blueScreen.classList.add('active');
  });
  const respJson = await resp.json();
  const respData = respJson;

  showExpression(respData);
}

function showExpression(data) {
  currentQuestionCount += 1;

  if(currentQuestionCount > questionCount) {
    finishQuiz();
    return;
  }

  questionEl.textContent = data.expression;
  expAnswer = data.answer;

  timerEl.style.transition = `transform ${data.second}s linear`;
  timerEl.classList.add('active');

  timeout = createTimeout(data.second);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const userAnswer = Number(answerEl.value);

  if(userAnswer === expAnswer) score += 1;
  nextQuestion();
})

function createTimeout(seconds) {
  return setTimeout( () => {
    nextQuestion();
  }, seconds * 1000)
}

function nextQuestion() {
  if(timeout != null) clearTimeout(timeout);
  timerEl.style.transition = 'none';
  timerEl.classList.remove('active');
  answerEl.value = '';
  getMathQuiz();
}

function finishQuiz() {
  questionEl.textContent = `${score}/${questionCount}`;
  answerEl.classList.add('dn');
  resetBtn.classList.remove('dn');
}

resetBtn.addEventListener('click', function() {
  currentQuestionCount = 0;
  score = 0;

  answerEl.classList.remove('dn');
  resetBtn.classList.add('dn');

  nextQuestion();
})

refreshPageBtn.addEventListener('click', () => {
  document.location.reload();
})