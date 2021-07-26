//Variable that displays the timer element
let timer = document.getElementById("timer");
//Variable for the high scores div
let scoresDiv = document.getElementById("scores_div");
//Variable for the title element
let title = document.getElementById("title");
//Variable for the paragraph element
let paragraph = document.getElementById("paragraph");
//Variable for the press start paragraph
let press_start = document.getElementById("press_start");
//Variable to handle the button elements
let buttonsDiv = document.getElementById("buttons")
//Variable to handle the View High Scores link
let viewScoresLnk = document.getElementById("view_scores")
//Variable to hold the start button element
let startButton = document.getElementById("start_button");
//Variable for the questions div
var questionDiv = document.getElementById("questions_div");
//Variable for the results div
let results = document.getElementById("results");
//Variable for the div that will hold the possible answers to the questions
var choices = document.getElementById("choices");

//Variable that starts the time at 90 seconds
let secondsLeft = 90;
//Empty array to store the high scores
let emptyArray = [];
//Variable to hold the current question count
var questionCount = 0;
//Variable to hold the score
let score = 0

//Variable the stores the parsed high scores that are in localstorage
let storedArray = JSON.parse(window.localStorage.getItem("high_scores"));


//Event Listener to check for the start button click
startButton.addEventListener("click", setTime);


//Timer starts when the user clicks startButton (see above).
function setTime() {
  displayQuestions();
  let timerInterval = setInterval(function() {
    secondsLeft--;
    timer.textContent = "";
    timer.textContent = "Time: " + secondsLeft;
    if (secondsLeft <= 0 || questionCount === questions.length) {
      clearInterval(timerInterval);
      captureUserScore();
    } 
  }, 1000);
}

//Function that displays the questions on the screen
function displayQuestions() {
  removeEls(startButton, title, paragraph, press_start, startButton);

  if (questionCount < questions.length) {
    questionDiv.innerHTML = questions[questionCount].title;
    choices.textContent = "";

    for (let i = 0; i < questions[questionCount].multiChoice.length; i++) {
      let el = document.createElement("button");
      el.innerText = questions[questionCount].multiChoice[i];
      el.setAttribute("data-id", i);
      el.addEventListener("click", function (event) {
        event.stopPropagation();

        if (el.innerText === questions[questionCount].answer) {
          score += secondsLeft;
        } else {
          score -= 10;
          secondsLeft = secondsLeft - 15;
        }
        
        questionDiv.innerHTML = "";

        if (questionCount === questions.length) {
          return;
        } else {
          questionCount++;
          displayQuestions();
        }
      });
      choices.append(el);
    }
  }
}

//Function that captures the user's score
function captureUserScore() {
  timer.remove();
  choices.textContent = "";

  let initialsInput = document.createElement("input");
  let submitScoreBtn = document.createElement("input");

  results.textContent = `Your completed test score is ${score}! Please enter your initials: `;
  initialsInput.setAttribute("type", "text");
  submitScoreBtn.setAttribute("type", "button");
  submitScoreBtn.setAttribute("value", "Submit Score");
  submitScoreBtn.addEventListener("click", function (event) {
    event.preventDefault();
    let scoresArray = defineScoresArray(storedArray, emptyArray);

    let initials = initialsInput.value;
    let userAndScore = {
      initials: initials,
      score: score,
    };

    scoresArray.push(userAndScore);
    saveScores(scoresArray);
    displayAllScores();
    clearScoresBtn();
    goBackBtn();
    viewScoresLnk.remove();
  });
  results.append(initialsInput);
  results.append(submitScoreBtn);
}

const saveScores = (array) => {
  window.localStorage.setItem("high_scores", JSON.stringify(array));
}

const defineScoresArray = (arr1, arr2) => {
  if(arr1 !== null) {
    return arr1
  } else {
    return arr2
  }
}

const removeEls = (...els) => {
  for (let el of els) el.remove();
}

function displayAllScores() {
  removeEls(timer, startButton, results);
  let scoresArray = defineScoresArray(storedArray, emptyArray);

  scoresArray.forEach(obj => {
    let initials = obj.initials;
    let storedScore = obj.score;
    let resultsP = document.createElement("p");
    resultsP.innerText = `${initials}: ${storedScore}`;
    scoresDiv.append(resultsP);
  });
}

function viewScores() {
  viewScoresLnk.addEventListener("click", function(event) {
    event.preventDefault();
    removeEls(timer, startButton, title, paragraph, press_start);
    displayAllScores();
    removeEls(viewScoresLnk);
    clearScoresBtn();
    goBackBtn();
  });
}

function clearScoresBtn() {    
  let clearBtn = document.createElement("input");
  clearBtn.setAttribute("type", "button");
  clearBtn.setAttribute("value", "Clear Scores");
  clearBtn.addEventListener("click", function(event){
    event.preventDefault();
    removeEls(scoresDiv);
    window.localStorage.removeItem("high_scores");
  })
  scoresDiv.append(clearBtn)
}

function goBackBtn() {
  let backBtn = document.createElement("input");
  backBtn.setAttribute("type", "button");
  backBtn.setAttribute("value", "Go Back");
  backBtn.addEventListener("click", function(event){
    event.preventDefault();
    window.location.reload();
  })
  buttonsDiv.append(backBtn)
}


viewScores();
