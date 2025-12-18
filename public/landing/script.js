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
