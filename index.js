const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

const corsOptions = {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true
    })
);


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({message: err.message});
    return;
});


app.listen(port, () => {
    console.log(`Server launched on port ${port}`)
});

app.use(express.static("public"));


// Dans index.js
const auth = require('./auth');

// Route d'inscription
app.post('/api/register', async (req, res) => {
  try {
    const { username, password, age } = req.body;
    
    // Validation simple
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nom d\'utilisateur et mot de passe requis'
      });
    }
    
    const token = await auth.register(username, password, age);
    
    res.json({
      success: true,
      token: token,
      message: 'Inscription réussie'
    });
    
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Route de connexion
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nom d\'utilisateur et mot de passe requis'
      });
    }
    
    const token = await auth.login(username, password);
    
    // Stocker dans un cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 heures
      sameSite: 'strict'
    });
    
    res.json({
      success: true,
      message: 'Connexion réussie'
    });
    
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
});

// Route pour vérifier l'authentification
app.get('/api/verify', (req, res) => {
  const token = req.cookies.auth_token;
  
  if (!token) {
    return res.json({
      authenticated: false,
      message: 'Non authentifié'
    });
  }
  
  const decoded = auth.verifyToken(token);
  
  if (!decoded) {
    res.clearCookie('auth_token');
    return res.json({
      authenticated: false,
      message: 'Token invalide'
    });
  }
  
  const userInfo = auth.getUserInfo(decoded.id);
  
  res.json({
    authenticated: true,
    user: userInfo
  });
});

// Route pour récupérer le profil
app.get('/api/profile', (req, res) => {
  const token = req.cookies.auth_token;
  const decoded = auth.verifyToken(token);
  
  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: 'Non authentifié'
    });
  }
  
  const userInfo = auth.getUserInfo(decoded.id);
  
  if (!userInfo) {
    return res.status(404).json({
      success: false,
      message: 'Utilisateur non trouvé'
    });
  }
  
  res.json({
    success: true,
    user: userInfo
  });
});

// Route pour modifier le profil
app.put('/api/profile', async (req, res) => {
  const token = req.cookies.auth_token;
  const decoded = auth.verifyToken(token);
  
  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: 'Non authentifié'
    });
  }
  
  try {
    const updatedUser = await auth.updateUser(decoded.id, req.body);
    
    res.json({
      success: true,
      message: 'Profil mis à jour',
      user: updatedUser
    });
    
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Route de déconnexion
app.post('/api/logout', (req, res) => {
  res.clearCookie('auth_token');
  res.json({
    success: true,
    message: 'Déconnexion réussie'
  });
});

// Route debug pour voir les utilisateurs (à supprimer en production)
app.get('/api/debug/users', (req, res) => {
  res.json({
    users: auth.getAllUsers(),
    count: auth.getAllUsers().length
  });
});


// Dans index.js - ajoute après tes routes d'authentification
const movieService = require('./services/movieService');

// Route pour obtenir les genres (pour les filtres)
app.get('/api/genres', async (req, res) => {
    try {
        const result = await movieService.getGenres();
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

// Recherche générale
app.get('/api/search', async (req, res) => {
    try {
        const { q, type = 'multi', page = 1 } = req.query;
        if (!q) return res.status(400).json({ success: false, message: 'Requête vide' });
        
        const result = await movieService.search(q, type, parseInt(page));
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

// Films avec filtres
app.get('/api/movies', async (req, res) => {
    try {
        const filters = {
            with_genres: req.query.genre,
            primary_release_year: req.query.year,
            'vote_average.gte': req.query.rating_min || 6,
            sort_by: req.query.sort_by || 'popularity.desc',
            page: req.query.page || 1
        };
        
        const result = await movieService.discoverMovies(filters);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

// Séries avec filtres
app.get('/api/tv', async (req, res) => {
    try {
        const filters = {
            with_genres: req.query.genre,
            first_air_date_year: req.query.year,
            'vote_average.gte': req.query.rating_min || 6,
            sort_by: req.query.sort_by || 'popularity.desc',
            page: req.query.page || 1
        };
        
        const result = await movieService.discoverTV(filters);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

// Détails film
app.get('/api/movie/:id', async (req, res) => {
    try {
        const result = await movieService.getMovieDetails(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(404).json({ success: false, message: 'Film non trouvé' });
    }
});

// Détails série
app.get('/api/tv/:id', async (req, res) => {
    try {
        const result = await movieService.getTVDetails(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(404).json({ success: false, message: 'Série non trouvée' });
    }
});

// Questionnaire - suggestions personnalisées
app.post('/api/suggestions', async (req, res) => {
    try {
        const userAnswers = req.body;
        
        // Validation basique
        if (!userAnswers || Object.keys(userAnswers).length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Réponses du questionnaire requises' 
            });
        }
        
        const result = await movieService.getSuggestionsFromQuiz(userAnswers);
        res.json(result);
    } catch (error) {
        console.error('Erreur suggestions:', error);
        res.status(500).json({ success: false, message: 'Erreur génération suggestions' });
    }
});