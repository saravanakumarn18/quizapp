const questions = [
  {
    questionText: "Who has the most ipl hundreds?",
    options: ["1. MS DHONI", "2.  VIRAT KOHLI", "3. ROHIT SHARMA", "4. SHIVAM DUBE"],
    answer: "2.  VIRAT KOHLI",
  },
  {
    questionText: "Which team has won the most purple cap awards?",
    options: [
      "1. CSK/MI",
      "2. SRH/DC",
      "3. RCB",
      "4. KKR",
    ],
    answer: "2. SRH/DC",
  },
  {
    questionText:
      "Who has won the most player of the series awards?",
    options: ["1. Shane Watson", "2. Suresh Raina", "3. Virat Kohli", "4. MS dhoni"],
    answer: "1. Shane Watson",
  },
  {
    questionText:
      "Who has won the greatest amount of most sixes in a season award?",
    options: [
      "1. AB devillers",
      "2. Chris Gayle",
      "3. Ravindra Jadeja",
      "4. Ms Dhoni",
    ],
    answer: "2. Chris Gayle",
  },
  {
    questionText:
      "Who has Won The most IPl and CL20 combined?",
    options: ["1. MI", "2. CSK", "3. KKR", "4. SRH"],
    answer: "1. MI",
  },
  {
    questionText:
      "Who took The most wickets in IPL 1?",
    options: ["1. Lasith Malinga", "2. DJ bravo", "3. Sunil Narine", "4. Piyush Chawla"],
    answer: "1. MI",
  },
];

const startCard = document.querySelector("#start-card");
const questionCard = document.querySelector("#question-card");
const scoreCard = document.querySelector("#score-card");
const leaderboardCard = document.querySelector("#leaderboard-card");

function hideCards() {
  startCard.setAttribute("hidden", true);
  questionCard.setAttribute("hidden", true);
  scoreCard.setAttribute("hidden", true);
  leaderboardCard.setAttribute("hidden", true);
}

const resultDiv = document.querySelector("#result-div");
const resultText = document.querySelector("#result-text");

function hideResultText() {
  resultDiv.style.display = "none";
}

var intervalID;
var time;
var currentQuestion;

document.querySelector("#start-button").addEventListener("click", startQuiz);

function startQuiz() {
  hideCards();
  questionCard.removeAttribute("hidden");

  currentQuestion = 0;
  displayQuestion();

  time = questions.length * 10;

  intervalID = setInterval(countdown, 1000);

  displayTime();
}

function countdown() {
  time--;
  displayTime();
  if (time < 1) {
    endQuiz();
  }
}
const timeDisplay = document.querySelector("#time");
function displayTime() {
  timeDisplay.textContent = time;
}

function displayQuestion() {
  let question = questions[currentQuestion];
  let options = question.options;

  let h2QuestionElement = document.querySelector("#question-text");
  h2QuestionElement.textContent = question.questionText;

  for (let i = 0; i < options.length; i++) {
    let option = options[i];
    let optionButton = document.querySelector("#option" + i);
    optionButton.textContent = option;
  }
}
document.querySelector("#quiz-options").addEventListener("click", checkAnswer);

function optionIsCorrect(optionButton) {
  return optionButton.textContent === questions[currentQuestion].answer;
}
function checkAnswer(eventObject) {
  let optionButton = eventObject.target;
  resultDiv.style.display = "block";
  if (optionIsCorrect(optionButton)) {
    resultText.textContent = "Correct!";
    setTimeout(hideResultText, 1000);
  } else {
    resultText.textContent = "Incorrect!";
    setTimeout(hideResultText, 1000);
    if (time >= 10) {
      time = time - 10;
      displayTime();
    } else {
      displayTime();
      endQuiz();
    }
  }

  currentQuestion++;
  if (currentQuestion < questions.length) {
    displayQuestion();
  } else {
    endQuiz();
  }
}

const score = document.querySelector("#score");

function endQuiz() {
  clearInterval(intervalID);
  hideCards();
  scoreCard.removeAttribute("hidden");
  score.textContent = time;
}

const submitButton = document.querySelector("#submit-button");
const inputElement = document.querySelector("#initials");

submitButton.addEventListener("click", storeScore);

function storeScore(event) {
  event.preventDefault();

  if (!inputElement.value) {
    alert("Please enter your initials before pressing submit!");
    return;
  }
  let leaderboardItem = {
    initials: inputElement.value,
    score: time,
  };

  updateStoredLeaderboard(leaderboardItem);

  hideCards();
  leaderboardCard.removeAttribute("hidden");

  renderLeaderboard();
}


function updateStoredLeaderboard(leaderboardItem) {
  let leaderboardArray = getLeaderboard();
  leaderboardArray.push(leaderboardItem);
  localStorage.setItem("leaderboardArray", JSON.stringify(leaderboardArray));
}
function getLeaderboard() {
  let storedLeaderboard = localStorage.getItem("leaderboardArray");
  if (storedLeaderboard !== null) {
    let leaderboardArray = JSON.parse(storedLeaderboard);
    return leaderboardArray;
  } else {
    leaderboardArray = [];
  }
  return leaderboardArray;
}
function renderLeaderboard() {
  let sortedLeaderboardArray = sortLeaderboard();
  const highscoreList = document.querySelector("#highscore-list");
  highscoreList.innerHTML = "";
  for (let i = 0; i < sortedLeaderboardArray.length; i++) {
    let leaderboardEntry = sortedLeaderboardArray[i];
    let newListItem = document.createElement("li");
    newListItem.textContent =
      leaderboardEntry.initials + " - " + leaderboardEntry.score;
    highscoreList.append(newListItem);
  }
}

function sortLeaderboard() {
  let leaderboardArray = getLeaderboard();
  if (!leaderboardArray) {
    return;
  }

  leaderboardArray.sort(function (a, b) {
    return b.score - a.score;
  });
  return leaderboardArray;
}

const clearButton = document.querySelector("#clear-button");
clearButton.addEventListener("click", clearHighscores);

function clearHighscores() {
  localStorage.clear();
  renderLeaderboard();
}

const backButton = document.querySelector("#back-button");
backButton.addEventListener("click", returnToStart);

function returnToStart() {
  hideCards();
  startCard.removeAttribute("hidden");
}
const leaderboardLink = document.querySelector("#leaderboard-link");
leaderboardLink.addEventListener("click", showLeaderboard);

function showLeaderboard() {
  hideCards();
  leaderboardCard.removeAttribute("hidden");
  clearInterval(intervalID);
  time = undefined;
  displayTime();

  renderLeaderboard();
}
