// Open the popup

const btnLogin = document.querySelector(".btn-login");
const overlay = document.getElementById("popup-overlay");
const btnClose = document.querySelector(".btn-close");

btnLogin.addEventListener("click", () => {
  overlay.style.display = "flex";
});

btnClose.addEventListener("click", () => {
  overlay.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === overlay) {
    overlay.style.display = "none";
  }
});
