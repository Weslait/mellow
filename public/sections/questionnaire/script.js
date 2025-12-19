// display the sections
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

//  function shuffle
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// api/movies
// get movies from the API
async function getMoviesFromAPI() {
  try {
    const response = await fetch("../../../api/movies");
    const data = await response.json();

    if (data.success && data.movies.length > 0) {
      const randomMovies = shuffleArray(data.movies);
      injectMovieData(randomMovies);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des films :", error);
  }
}

// api/tv
// get series from the API
async function getSeriesFromAPI() {
  try {
    const response = await fetch("../../../api/tv");
    const data = await response.json();

    if (data.success && data.series.length > 0) {
      const randomSeries = shuffleArray(data.series);
      injectMovieData(randomSeries);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des séries :", error);
  }
}

// get movies and series from the API
async function getMixedContentFromAPI() {
  try {
    const [movieRes, tvRes] = await Promise.all([
      fetch("../../../api/movies"),
      fetch("../../../api/tv"),
    ]);

    const movieData = await movieRes.json();
    const tvData = await tvRes.json();

    // table with both movies and series that will be shuffled
    let combinedContent = [];
    if (movieData.success)
      combinedContent = [...combinedContent, ...movieData.movies];
    if (tvData.success)
      combinedContent = [...combinedContent, ...tvData.series];

    if (combinedContent.length > 0) {
      const randomContent = shuffleArray(combinedContent);
      injectMovieData(randomContent);
    }
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des films et séries :",
      error
    );
  }
}

// retrieve the user choices
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
const pills = document.querySelectorAll(".pill");

btnNext2.classList.add("disabled");

pills.forEach((pill) => {
  pill.addEventListener("click", () => {
    pills.forEach((p) => p.classList.remove("is-selected"));
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

// put data into the card
function injectMovieData(items) {
  for (let i = 0; i < 3; i++) {
    const item = items[i];
    if (!item) break;

    const cardContainer = document.querySelector(`#movie-recommended-${i + 1}`);

    if (cardContainer) {
      // inject title
      const titleElement = cardContainer.querySelector(`#movie-title-${i + 1}`);
      titleElement.textContent = item.title || item.name || "Titre inconnu";

      // inject poster
      const posterElement = cardContainer.querySelector(".movie-poster");
      posterElement.style.backgroundImage = `url('${item.poster_path}')`;

      // inject year
      const yearElement = cardContainer.querySelector("#year");
      const dateRaw = item.release_date || item.first_air_date;
      if (dateRaw) {
        yearElement.textContent = dateRaw.split("-")[0];
      }
      // inject format
      const formatElement = cardContainer.querySelector("#format");
      if (formatElement) {
        formatElement.textContent =
          item.media_type === "movie" ? "Film" : "Série";
      }
    }
  }
}
