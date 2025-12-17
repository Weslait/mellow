const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Stockage en mémoire (perdu au redémarrage)
let users = [];
let currentId = 1; // Gérer un ID incrémental

const JWT_SECRET = 'films_secret_2024';

// Inscription
async function register(username, password, age) {
  // Vérifier si l'utilisateur existe déjà
  if (users.some(u => u.username === username)) {
    throw new Error('Ce nom d\'utilisateur est déjà pris');
  }
  
  // Hasher le mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Créer l'utilisateur
  const newUser = {
    id: currentId++,
    username: username,
    password: hashedPassword,
    age: age ? parseInt(age) : null,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  console.log(`Utilisateur créé: ${username}, ID: ${newUser.id}`);
  console.log(`Total utilisateurs: ${users.length}`);
  
  // Générer un token JWT
  const token = jwt.sign(
    { 
      id: newUser.id, 
      username: newUser.username 
    }, 
    JWT_SECRET, 
    { expiresIn: '24h' }
  );
  
  return token;
}

// Connexion
async function login(username, password) {
  // Trouver l'utilisateur
  const user = users.find(u => u.username === username);
  
  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }
  
  // Vérifier le mot de passe
  const passwordMatch = await bcrypt.compare(password, user.password);
  
  if (!passwordMatch) {
    throw new Error('Mot de passe incorrect');
  }
  
  console.log(`Connexion réussie: ${username}`);
  
  // Générer un token JWT
  const token = jwt.sign(
    { 
      id: user.id, 
      username: user.username 
    }, 
    JWT_SECRET, 
    { expiresIn: '24h' }
  );
  
  return token;
}

// Vérifier un token
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.log('Token invalide:', error.message);
    return null;
  }
}

// Obtenir les infos d'un utilisateur (sans le mot de passe)
function getUserInfo(userId) {
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return null;
  }
  
  // Retourner sans le mot de passe
  const { password, ...userInfo } = user;
  return userInfo;
}

// Modifier un utilisateur
async function updateUser(userId, updates) {
  // Trouver l'index de l'utilisateur
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    throw new Error('Utilisateur non trouvé');
  }
  
  const user = users[userIndex];
  
  // Vérifier si le nouveau nom d'utilisateur existe déjà (si changement)
  if (updates.username && updates.username !== user.username) {
    const usernameExists = users.some(u => 
      u.username === updates.username && u.id !== userId
    );
    
    if (usernameExists) {
      throw new Error('Ce nom d\'utilisateur est déjà utilisé');
    }
  }
  
  // Mettre à jour les champs
  if (updates.username !== undefined) {
    users[userIndex].username = updates.username;
  }
  
  if (updates.age !== undefined) {
    users[userIndex].age = updates.age ? parseInt(updates.age) : null;
  }
  
  // Si nouveau mot de passe, le hasher
  if (updates.password && updates.password.trim() !== '') {
    users[userIndex].password = await bcrypt.hash(updates.password, 10);
    console.log(`Mot de passe mis à jour pour: ${user.username}`);
  }
  
  // Ajouter un timestamp de mise à jour
  users[userIndex].updatedAt = new Date().toISOString();
  
  console.log(`Utilisateur mis à jour: ${user.username}`);
  
  // Retourner les nouvelles infos (sans le mot de passe)
  const { password, ...updatedUser } = users[userIndex];
  return updatedUser;
}

// Obtenir tous les utilisateurs (pour debug)
function getAllUsers() {
  return users.map(user => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
}

// Supprimer un utilisateur (optionnel)
function deleteUser(userId) {
  const initialLength = users.length;
  users = users.filter(u => u.id !== userId);
  
  if (users.length < initialLength) {
    console.log(`Utilisateur ${userId} supprimé`);
    return true;
  }
  
  return false;
}

// Réinitialiser (pour nos tests)
function reset() {
  users = [];
  currentId = 1;
  console.log('Stockage utilisateurs réinitialisé');
}

module.exports = {
  register,
  login,
  verifyToken,
  getUserInfo,
  updateUser,
  getAllUsers,
  deleteUser,
  reset,
  users: () => users // Export en fonction pour éviter la mutation directe
};