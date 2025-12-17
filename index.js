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