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

// 1. Fonction de mélange (Shuffle)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Échange des éléments
  }
  return array;
}

// API Movie
// Fonction pour récupérer uniquement les FILMS
async function getMoviesFromAPI() {
  try {
    const response = await fetch("../../../api/movies");
    const data = await response.json();

    if (data.success && data.movies.length > 0) {
      // On mélange et on injecte
      const randomMovies = shuffleArray(data.movies);
      injectMovieData(randomMovies);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des films :", error);
  }
}

// API Series
// Fonction pour récupérer uniquement les SÉRIES
async function getSeriesFromAPI() {
  try {
    const response = await fetch("../../../api/tv");
    const data = await response.json();

    if (data.success && data.series.length > 0) {
      // On mélange et on injecte
      const randomSeries = shuffleArray(data.series);
      injectMovieData(randomSeries);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des séries :", error);
  }
}

// API movie & tv_show
// On crée une fonction asynchrone (async) pour attendre la réponse de l'API
async function getMixedContentFromAPI() {
  try {
    // On lance les deux appels en même temps pour gagner du temps
    const [movieRes, tvRes] = await Promise.all([
      fetch("../../../api/movies"),
      fetch("../../../api/tv"),
    ]);

    const movieData = await movieRes.json();
    const tvData = await tvRes.json();

    // On crée un tableau unique contenant les films ET les séries
    let combinedContent = [];
    if (movieData.success)
      combinedContent = [...combinedContent, ...movieData.movies];
    if (tvData.success)
      combinedContent = [...combinedContent, ...tvData.series];

    if (combinedContent.length > 0) {
      // On mélange le tout pour que l'utilisateur ait un mix aléatoire
      const randomContent = shuffleArray(combinedContent);
      injectMovieData(randomContent);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du contenu mixte :", error);
  }
}

// Fonction pour injecter les données dans les 3 cartes
function injectMovieData(items) {
  for (let i = 0; i < 3; i++) {
    const item = items[i];
    if (!item) break;

    const cardContainer = document.querySelector(`#movie-recommended-${i + 1}`);

    if (cardContainer) {
      // Titre : On prend 'title' (film) ou 'name' (série)
      const titleElement = cardContainer.querySelector(`#movie-title-${i + 1}`);
      titleElement.textContent = item.title || item.name || "Titre inconnu";

      // Image
      const posterElement = cardContainer.querySelector(".movie-poster");
      posterElement.style.backgroundImage = `url('${item.poster_path}')`;

      // Année : On prend 'release_date' (film) ou 'first_air_date' (série)
      const yearElement = cardContainer.querySelector("#year");
      const dateRaw = item.release_date || item.first_air_date;
      if (dateRaw) {
        yearElement.textContent = dateRaw.split("-")[0];
      }
      const formatElement = cardContainer.querySelector("#format");
      if (formatElement) {
        formatElement.textContent =
          item.media_type === "movie" ? "Film" : "Série";
      }
    }
  }
}

buttonNext.forEach((btn) => {
  btn.addEventListener("click", () => {
    steps[stepIndex].style.display = "none";

    stepIndex++;

    if (steps[stepIndex]) {
      steps[stepIndex].style.display = "block";

      if (stepIndex === 4) {
        if (userChoices.format === "movie") {
          getMoviesFromAPI();
        } else if (userChoices.format === "tv_show") {
          getSeriesFromAPI();
        } else if (userChoices.format === "any") {
          getMixedContentFromAPI();
        }
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
// choiceOne.addEventListener("click", () => {
//   userChoices.avatar = "happy";
//   console.log(userChoices.avatar);
// });

// choiceTwo.addEventListener("click", () => {
//   userChoices.avatar = "neutral";
//   console.log(userChoices.avatar);
// });

// choiceThree.addEventListener("click", () => {
//   userChoices.avatar = "sad";
//   console.log(userChoices.avatar);
// });

// // pill
// let pillChoiceOne = document.querySelector("#pill-choice-1");
// let pillChoiceTwo = document.querySelector("#pill-choice-2");
// let pillChoiceThree = document.querySelector("#pill-choice-3");
// let pillChoiceFour = document.querySelector("#pill-choice-4");
// let pillChoiceFive = document.querySelector("#pill-choice-5");

// pillChoiceOne.addEventListener("click", () => {
//   userChoices.mood = "comedy";
//   console.log(userChoices.mood);
// });

// pillChoiceTwo.addEventListener("click", () => {
//   userChoices.mood = "chill";
//   console.log(userChoices.mood);
// });

// pillChoiceThree.addEventListener("click", () => {
//   userChoices.mood = "think";
//   console.log(userChoices.mood);
// });

// pillChoiceFour.addEventListener("click", () => {
//   userChoices.mood = "thriller";
//   console.log(userChoices.mood);
// });

// pillChoiceFive.addEventListener("click", () => {
//   userChoices.mood = "drama";
//   console.log(userChoices.mood);
// });

// // style
// let cardChoiceOne = document.querySelector("#card-choice-1");
// let cardChoiceTwo = document.querySelector("#card-choice-2");
// let cardChoiceThree = document.querySelector("#card-choice-3");

// cardChoiceOne.addEventListener("click", () => {
//   userChoices.style = "simple";
//   console.log(userChoices.style);
// });
// cardChoiceTwo.addEventListener("click", () => {
//   userChoices.style = "complex";
//   console.log(userChoices.style);
// });
// cardChoiceThree.addEventListener("click", () => {
//   userChoices.style = "any";
//   console.log(userChoices.style);
// });

// // format
// let formatChoiceOne = document.querySelector("#format-choice-1");
// let formatChoiceTwo = document.querySelector("#format-choice-2");
// let formatChoiceThree = document.querySelector("#format-choice-3");

// formatChoiceOne.addEventListener("click", () => {
//   userChoices.format = "movie";
//   console.log(userChoices.format);
// });
// formatChoiceTwo.addEventListener("click", () => {
//   userChoices.format = "tv_show";
//   console.log(userChoices.format);
// });
// formatChoiceThree.addEventListener("click", () => {
//   userChoices.format = "any";
//   console.log(userChoices.format);
//   console.log(userChoices);
// });

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

// Animation and selection - section 3
const btnNext3 = document.querySelector(".box-content-3 .btn-next");
const styleCards = document.querySelectorAll(".box-content-3 .style-card");

btnNext3.classList.add("disabled");

styleCards.forEach((card) => {
  card.addEventListener("click", () => {
    styleCards.forEach((c) => c.classList.remove("selected"));

    card.classList.add("selected");

    btnNext3.classList.remove("disabled");

    if (card.id === "card-choice-1") userChoices.style = "simple";
    if (card.id === "card-choice-2") userChoices.style = "complex";
    if (card.id === "card-choice-3") userChoices.style = "any";
  });
});

// Animation and selection - section 4
const btnNext4 = document.querySelector(".box-content-4 .btn-next");
const formatCards = document.querySelectorAll(".box-content-4 .style-card");

btnNext4.classList.add("disabled");

formatCards.forEach((card) => {
  card.addEventListener("click", () => {
    formatCards.forEach((c) => c.classList.remove("selected"));

    card.classList.add("selected");

    btnNext4.classList.remove("disabled");

    if (card.id === "format-choice-1") userChoices.format = "movie";
    if (card.id === "format-choice-2") userChoices.format = "tv_show";
    if (card.id === "format-choice-3") userChoices.format = "any";
  });
});
