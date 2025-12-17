const steps = [
  document.querySelector(".box-content"),
  document.querySelector(".box-content-2"),
  document.querySelector(".box-content-3"),
  document.querySelector(".box-content-4"),
  document.querySelector(".box-content-5"),
];

const buttonNext = document.querySelectorAll(".btn-next");

let stepIndex = 0;

buttonNext.forEach((btn) => {
  btn.addEventListener("click", () => {
    steps[stepIndex].style.display = "none";

    stepIndex++;

    if (steps[stepIndex]) {
      steps[stepIndex].style.display = "block";
    }
  });
});
