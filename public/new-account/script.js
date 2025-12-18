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

const username = document.getElementById("username");
const password = document.getElementById("password");

// --- GESTION DE LA MODALE ---

const btnLogin = document.querySelector(".btn-login"); // Le bouton du header
const overlay = document.getElementById("popup-overlay"); // Le fond sombre
const btnClose = document.querySelector(".btn-close"); // Ta croix

// 1. Ouvrir la modale
btnLogin.addEventListener("click", () => {
  overlay.style.display = "flex"; // "flex" pour que le centrage CSS s'active
});

// 2. Fermer avec ton bouton icône
btnClose.addEventListener("click", () => {
  overlay.style.display = "none";
});

// 3. Fermer en cliquant sur le fond sombre (extérieur de la popup)
window.addEventListener("click", (event) => {
  if (event.target === overlay) {
    overlay.style.display = "none";
  }
});
