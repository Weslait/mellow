//  function shuffle
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// get movies and series from the API
async function getMixedContentFromAPI() {
  try {
    const [movieRes, tvRes] = await Promise.all([
      fetch("../../api/movies"),
      fetch("../../api/tv"),
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

window.addEventListener("DOMContentLoaded", () => {
  getMixedContentFromAPI();
});
