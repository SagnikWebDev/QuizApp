import { data } from "./data.js";
import { QuizData } from "./QuizData.js";

const hero_section = document.querySelector(".hero_section");
const categories_section = document.querySelector(".categories_section");
const test_section = document.querySelector(".test_section");
const result_section = document.querySelector(".result_section");
const Modal_section = document.querySelector(".Modal_section");
const Question_text = document.querySelector(".Question_text");
const test_uppersection_header_text_number = document.querySelector(
  ".test_uppersection_header_text_number"
);
const Question_img = document.querySelector(".Question_img");
const time_text = document.querySelector(".time_value_text");
const nextBtn = document.querySelector(".next_btn");
const resume_btn = document.querySelector(".resume_btn");
const quit_btn = document.querySelector(".quit_btn");
const hero_btn = document.querySelector(".hero_btn");
const startQuizBtn = document.querySelector(".Start_btn");
const answer_option = document.querySelectorAll(".answer_option");
const progress_bar = document.querySelector(".progress_bar");
const back_btn = document.querySelector(".home_btn");
const final_score_text = document.querySelector(".final_score_text");
const Accuracy_text = document.querySelector(".Accuracy_text");
const correct_score_text = document.querySelector(".correct_score_text");
const incorrect_score_text = document.querySelector(".incorrect_score_text");

let choosen = undefined;
let time = 60;
let answered = 0;
let numOfQuestions = 10;

function displayElementFunction(action, Element, displayType) {
  if (action == "hide") {
    Element.style.display = "none";
  }
  if (action == "unhide") {
    Element.style.display = displayType;
  }
}

function displayHeroSection(action) {
  displayElementFunction(action, hero_section, "flex");
}
function displayCategoriesSectionaction(action) {
  displayElementFunction(action, categories_section, "flex");
}
function displayTestSection(action) {
  displayElementFunction(action, test_section, "flex");
}
function displayResultSection(action) {
  displayElementFunction(action, result_section, "flex");
}
function displayModalSection(action) {
  displayElementFunction(action, Modal_section, "flex");
}
function updateResultOnUi() {
  final_score_text.innerHTML = `${answered}/${numOfQuestions}`;
  Accuracy_text.innerHTML = `${Math.floor((answered / numOfQuestions) * 100)}%`;
  correct_score_text.innerHTML = `${answered}`;
  incorrect_score_text.innerHTML = `${numOfQuestions - answered}`;
}

function getChoosenCategoryValue() {
  const categorie_options = document.querySelectorAll(".categorie_input");
  let choosen = undefined;
  categorie_options.forEach((Elements) => {
    if (Elements.checked) {
      choosen = Elements.id;
    }
  });
  return choosen;
}
function getChoosenAnswerValue() {
  let choosen = undefined;
  const categorie_options = document.querySelectorAll(".answer_input");
  categorie_options.forEach((Elements) => {
    if (Elements.checked) {
      choosen = Elements.id;
    }
  });
  return choosen;
}

function updateAnswersOnUi(options) {
  Object.values(answer_option).map((Elements, index) => {
    const label = Elements;
    const input = Elements.firstElementChild;
    const text = Elements.lastElementChild;
    label.setAttribute("for", options[index]);
    input.setAttribute("id", options[index]);
    if (!index) input.checked = true;
    text.innerHTML = options[index];
  });
}

let interval = undefined;
function TimerOnUi(action, currentIndex, setTime) {
  let Index = currentIndex;
  if (action == "start") {
    interval = setInterval(() => {
      time--;
      time_text.innerHTML = `${time}`;
      if (!time) {
        time = 60;
        time_text.innerHTML = `${time}`;
        clearInterval(interval);
        if (Index <= 10) {
          Index++;
          nextBtn.click();
        }
      }
    }, 1000);
  }

  if (action == "setTime") {
    time = setTime;
  }
  if (action == "stop") {
    clearInterval(interval);
  }
}

function updateAnswerBgColorClassname(action, Element, color_type) {
  if (action == "add" && color_type == "green") {
    Element.parentElement.classList.add("answer_option-color--green");
  }
  if (action == "add" && color_type == "red") {
    Element.parentElement.classList.add("answer_option-color--red");
  }
  if (action == "remove") {
    if (Element.parentElement.classList[1] == "answer_option-color--green") {
      Element.parentElement.classList.remove("answer_option-color--green");
    }
    if (Element.parentElement.classList[1] == "answer_option-color--red") {
      Element.parentElement.classList.remove("answer_option-color--red");
    }
  }
}

function updateProgressBar(currentIndex) {
  progress_bar.style.width = `${(currentIndex / 10) * 100}%`;
}

function startQuiz(categoryId, questionId) {
  if (questionId) {
    if (categoryId) {
      choosen = categoryId;
    }
    displayCategoriesSectionaction("hide");
    displayTestSection("unhide");
    const { question, options, img } = quizData.getAllQuestionInfoById(
      choosen,
      questionId
    );
    test_uppersection_header_text_number.innerHTML = questionId;
    Question_text.innerHTML = question;
    Question_img.setAttribute("src", img);
    Question_img.setAttribute("alt", `question${questionId}_img`);
    updateAnswersOnUi(options);
    TimerOnUi("start", questionId);
  }
}

const quizData = new QuizData();

quizData.registerData(data);

quizData.updateCategoriesOnUi();

const Progression = quizData.getSavedProgressionDataFromLocal();

if (Progression !== null) {
  displayModalSection("unhide");
}

hero_btn.addEventListener("click", (event) => {
  displayHeroSection("hide");
  displayCategoriesSectionaction("unhide");
});

startQuizBtn.addEventListener("click", (event) => {
  event.preventDefault();
  choosen = getChoosenCategoryValue();
  startQuiz(choosen, 1);
});

nextBtn.addEventListener("click", (event) => {
  event.preventDefault();
  const curQuestionId = test_uppersection_header_text_number.innerHTML;
  const answer = quizData.getAnswerById(choosen, curQuestionId);
  const choosenAnswer = getChoosenAnswerValue();

  if (choosenAnswer == answer) {
    answered++;
    updateAnswerBgColorClassname(
      "add",
      document.getElementById(choosenAnswer),
      "green"
    );
  } else {
    updateAnswerBgColorClassname(
      "add",
      document.getElementById(choosenAnswer),
      "red"
    );
    updateAnswerBgColorClassname(
      "add",
      document.getElementById(answer),
      "green"
    );
  }

  const nextQuestionId = Number(curQuestionId) + 1;
  nextQuestionId != 11
    ? quizData.savedProgressionInLocal(choosen, nextQuestionId, answered)
    : localStorage.removeItem("Progression");
  if (curQuestionId <= 9) {
    const { question, options, img } = quizData.getAllQuestionInfoById(
      choosen,
      nextQuestionId
    );
    TimerOnUi("setTime", nextQuestionId, 61);
    setTimeout(() => {
      updateAnswerBgColorClassname(
        "remove",
        document.getElementById(choosenAnswer)
      );
      updateAnswerBgColorClassname("remove", document.getElementById(answer));
      test_uppersection_header_text_number.innerHTML = nextQuestionId;
      Question_text.innerHTML = question;
      Question_img.setAttribute("src", img);
      Question_img.setAttribute("alt", "question1_img");
      updateAnswersOnUi(options);
      updateProgressBar(nextQuestionId);
    }, 500);
  } else {
    setTimeout(() => {
      answered = 0;
      updateAnswerBgColorClassname(
        "remove",
        document.getElementById(choosenAnswer)
      );
      updateAnswerBgColorClassname("remove", document.getElementById(answer));
      TimerOnUi("stop");
      displayTestSection("hide");
      displayResultSection("unhide");
      test_uppersection_header_text_number.innerHTML = 1;
      updateProgressBar(1);
    }, 500);
  }
  updateResultOnUi();
});

back_btn.addEventListener("click", (event) => {
  displayHeroSection("unhide");
  displayResultSection("hide");
});

resume_btn.addEventListener("click", (event) => {
  event.preventDefault();
  displayHeroSection("hide");
  displayModalSection("hide");
  const { categoryId, questionId, userAnswered } = Progression;
  choosen = categoryId;
  answered = userAnswered;
  startQuiz(choosen, questionId);
  updateAnswersOnUi();
});

quit_btn.addEventListener("click", (event) => {
  event.preventDefault();
  answered = 0;
  localStorage.removeItem("Progression");
  displayModalSection("hide");
});
