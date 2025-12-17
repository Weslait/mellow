// When all the inputs are filled, turn btn-create active
const inputs = document.querySelectorAll(".box-field");
const btnCreate = document.querySelector(".btn-create");

function checkInput() {
  let inputFilled = true;

  //   Need at least 5 characters in each field to turn btn-create active
  inputs.forEach((input) => {
    if (input.value.trim().length < 5) {
      inputFilled = false;
    }
  });

  if (inputFilled) {
    btnCreate.classList.add("active");
  } else {
    btnCreate.classList.remove("active");
  }
}

inputs.forEach((input) => {
  input.addEventListener("input", checkInput);
});
