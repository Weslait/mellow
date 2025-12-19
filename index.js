const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});

app.listen(port, () => {
  console.log(`Server launched on port ${port}`);
});

app.use(express.static("public"));

// Auth
const auth = require("./migration/auth");

// Routes d'authentification
app.post("/api/register", auth.register);
app.post("/api/login", auth.login);
app.post("/api/logout", auth.logout);

// Api externes
const movieService = require("./services/movieService");

// Route pour obtenir les genres (pour les filtres)
app.get("/api/genres", async (req, res) => {
  try {
    const result = await movieService.getGenres();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// Recherche générale
app.get("/api/search", async (req, res) => {
  try {
    const { q, type = "multi", page = 1 } = req.query;
    if (!q)
      return res.status(400).json({ success: false, message: "Requête vide" });

    const result = await movieService.search(q, type, parseInt(page));
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// Films avec filtres
app.get("/api/movies", async (req, res) => {
  try {
    const filters = {
      with_genres: req.query.genre,
      primary_release_year: req.query.year,
      "vote_average.gte": req.query.rating_min || 6,
      sort_by: req.query.sort_by || "popularity.desc",
      page: req.query.page || 1,
    };

    const result = await movieService.discoverMovies(filters);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// Séries avec filtres
app.get("/api/tv", async (req, res) => {
  try {
    const filters = {
      with_genres: req.query.genre,
      first_air_date_year: req.query.year,
      "vote_average.gte": req.query.rating_min || 6,
      sort_by: req.query.sort_by || "popularity.desc",
      page: req.query.page || 1,
    };

    const result = await movieService.discoverTV(filters);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// Détails film
app.get("/api/movie/:id", async (req, res) => {
  try {
    const result = await movieService.getMovieDetails(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(404).json({ success: false, message: "Film non trouvé" });
  }
});

// Détails série
app.get("/api/tv/:id", async (req, res) => {
  try {
    const result = await movieService.getTVDetails(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(404).json({ success: false, message: "Série non trouvée" });
  }
});

// Questionnaire - suggestions personnalisées
app.post("/api/suggestions", async (req, res) => {
  try {
    const userAnswers = req.body;

    // Validation basique
    if (!userAnswers || Object.keys(userAnswers).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Réponses du questionnaire requises",
      });
    }

    const result = await movieService.getSuggestionsFromQuiz(userAnswers);
    res.json(result);
  } catch (error) {
    console.error("Erreur suggestions:", error);
    res
      .status(500)
      .json({ success: false, message: "Erreur génération suggestions" });
  }
});
