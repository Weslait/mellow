// Display the sections
const steps = [
  document.querySelector(".box-content"),
  document.querySelector(".box-content-2"),
  document.querySelector(".box-content-3"),
  document.querySelector(".box-content-4"),
  document.querySelector(".box-content-5"),
  document.querySelector(".box-content-6"),
];

const buttonNext = document.querySelectorAll(".btn-next");

let stepIndex = 0;

buttonNext.forEach((btn) => {
  btn.addEventListener("click", () => {
    steps[stepIndex].style.display = "none";

    stepIndex++;

    if (steps[stepIndex]) {
      steps[stepIndex].style.display = "block";

      if (stepIndex === 4) {
        setTimeout(() => {
          steps[4].style.display = "none";
          steps[5].style.display = "block";
        }, 4000);
      }
    }
  });
});

// Retrieve the user choices
let choiceOne = document.querySelector("#choice-1");
let choiceTwo = document.querySelector("#choice-2");
let choiceThree = document.querySelector("#choice-3");

// object to acquire the user choices
let userChoices = {
  avatar: null,
  mood: null,
  style: null,
  format: null,
};

// avatar
choiceOne.addEventListener("click", () => {
  userChoices.avatar = "happy";
  console.log(userChoices.avatar);
});

choiceTwo.addEventListener("click", () => {
  userChoices.avatar = "neutral";
  console.log(userChoices.avatar);
});

choiceThree.addEventListener("click", () => {
  userChoices.avatar = "sad";
  console.log(userChoices.avatar);
});

// pill
let pillChoiceOne = document.querySelector("#pill-choice-1");
let pillChoiceTwo = document.querySelector("#pill-choice-2");
let pillChoiceThree = document.querySelector("#pill-choice-3");
let pillChoiceFour = document.querySelector("#pill-choice-4");
let pillChoiceFive = document.querySelector("#pill-choice-5");

pillChoiceOne.addEventListener("click", () => {
  userChoices.mood = "comedy";
  console.log(userChoices.mood);
});

pillChoiceTwo.addEventListener("click", () => {
  userChoices.mood = "chill";
  console.log(userChoices.mood);
});

pillChoiceThree.addEventListener("click", () => {
  userChoices.mood = "think";
  console.log(userChoices.mood);
});

pillChoiceFour.addEventListener("click", () => {
  userChoices.mood = "thriller";
  console.log(userChoices.mood);
});

pillChoiceFive.addEventListener("click", () => {
  userChoices.mood = "drama";
  console.log(userChoices.mood);
});

// style
let cardChoiceOne = document.querySelector("#card-choice-1");
let cardChoiceTwo = document.querySelector("#card-choice-2");
let cardChoiceThree = document.querySelector("#card-choice-3");

cardChoiceOne.addEventListener("click", () => {
  userChoices.style = "simple";
  console.log(userChoices.style);
});
cardChoiceTwo.addEventListener("click", () => {
  userChoices.style = "complex";
  console.log(userChoices.style);
});
cardChoiceThree.addEventListener("click", () => {
  userChoices.style = "any";
  console.log(userChoices.style);
});

// format
let formatChoiceOne = document.querySelector("#format-choice-1");
let formatChoiceTwo = document.querySelector("#format-choice-2");
let formatChoiceThree = document.querySelector("#format-choice-3");

formatChoiceOne.addEventListener("click", () => {
  userChoices.format = "movie";
  console.log(userChoices.format);
});
formatChoiceTwo.addEventListener("click", () => {
  userChoices.format = "tv_show";
  console.log(userChoices.format);
});
formatChoiceThree.addEventListener("click", () => {
  userChoices.format = "any";
  console.log(userChoices.format);
  console.log(userChoices);
});

// Animation and selection - section 1
const btnNext1 = document.querySelector(".box-content .btn-next");
const avatarCards = document.querySelectorAll(".avatar-card");

btnNext1.classList.add("disabled");

avatarCards.forEach((card) => {
  card.addEventListener("click", () => {
    avatarCards.forEach((c) => c.classList.remove("selected"));

    card.classList.add("selected");

    btnNext1.classList.remove("disabled");

    if (card.id === "choice-1") userChoices.avatar = "happy";
    if (card.id === "choice-2") userChoices.avatar = "neutral";
    if (card.id === "choice-3") userChoices.avatar = "sad";
  });
});

// Animation and selection - section 2

const btnNext2 = document.querySelector(".box-content-2 .btn-next");
const allPills = document.querySelectorAll(".pill");

btnNext2.classList.add("disabled");

allPills.forEach((pill) => {
  pill.addEventListener("click", () => {
    allPills.forEach((p) => p.classList.remove("is-selected"));
    pill.classList.add("is-selected");

    btnNext2.classList.remove("disabled");

    if (pill.id === "pill-choice-1") userChoices.mood = "comedy";
    else if (pill.id === "pill-choice-2") userChoices.mood = "chill";
    else if (pill.id === "pill-choice-3") userChoices.mood = "think";
    else if (pill.id === "pill-choice-4") userChoices.mood = "thriller";
    else if (pill.id === "pill-choice-5") userChoices.mood = "drama";

    console.log("Mood choisi :", userChoices.mood);
  });
});
