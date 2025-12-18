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
          console.log("Résultats affichés avec succès !");
        }, 4000);
      }
    }
  });
});

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
