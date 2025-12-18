// Quand tous les inputs sont remplis, activer le bouton
const inputs = document.querySelectorAll(".box-field");
const btnCreate = document.querySelector(".btn-create");

function checkInput() {
  let inputFilled = true;
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

// --- GESTION DE LA MODALE ---
const btnLogin = document.querySelector(".btn-login");
const overlay = document.getElementById("popup-overlay");
const btnClose = document.querySelector(".btn-close");

// Ouvrir la modale
btnLogin.addEventListener("click", () => {
  overlay.style.display = "flex";
});

// Fermer la modale
btnClose.addEventListener("click", () => {
  overlay.style.display = "none";
});

// Fermer en cliquant sur le fond
window.addEventListener("click", (event) => {
  if (event.target === overlay) {
    overlay.style.display = "none";
  }
});

// --- INSCRIPTION SIMPLE ---
btnCreate.addEventListener("click", async () => {
  if (!btnCreate.classList.contains("active")) return;
  
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const date = document.getElementById("date").value;
  
  // Calculer l'âge
  const birthDate = new Date(date);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  
  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, age })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      alert("Inscription réussie !");
      // Rediriger vers la page d'accueil
      window.location.href = "/";
    } else {
      alert("Erreur : " + data.error);
    }
  } catch (error) {
    alert("Erreur de connexion au serveur");
  }
});

// --- CONNEXION SIMPLE ---
const btnConnect = document.querySelector(".btn-connect");
btnConnect.addEventListener("click", async () => {
  const loginUsername = document.querySelector(".popup-login input[type='text']").value;
  const loginPassword = document.querySelector(".popup-login input[type='password']").value;
  
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: loginUsername, password: loginPassword })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      alert("Connexion réussie !");
      overlay.style.display = "none";
      window.location.href = "/";
    } else {
      alert("Erreur : " + data.error);
    }
  } catch (error) {
    alert("Erreur de connexion au serveur");
  }
});