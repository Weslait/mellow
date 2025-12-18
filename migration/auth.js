const db = require("../services/db");

// Inscription simple
exports.register = (req, res) => {
    const { username, password, age } = req.body;
    
    if (!username || !password || !age) {
        return res.status(400).json({ error: "Tous les champs sont requis" });
    }
    
    // Vérifier si l'utilisateur existe
    db.query('SELECT id FROM Users WHERE user_name = ?', [username], (err, results) => {
        if (err) return res.status(500).json({ error: "Erreur serveur" });
        if (results.length > 0) return res.status(400).json({ error: "Nom d'utilisateur déjà pris" });
        
        // Insérer le nouvel utilisateur
        db.query('INSERT INTO Users (user_name, password, age) VALUES (?, ?, ?)', 
            [username, password, age], 
            (err, results) => {
                if (err) return res.status(500).json({ error: "Erreur serveur" });
                
                res.json({ 
                    success: true, 
                    message: "Inscription réussie",
                    userId: results.insertId 
                });
            }
        );
    });
};

// Connexion simple
exports.login = (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: "Nom d'utilisateur et mot de passe requis" });
    }
    
    db.query('SELECT id, user_name, password FROM Users WHERE user_name = ?', [username], (err, results) => {
        if (err) return res.status(500).json({ error: "Erreur serveur" });
        if (results.length === 0) return res.status(401).json({ error: "Identifiants incorrects" });
        
        const user = results[0];
        
        // Vérification simple du mot de passe (sans hash pour la simplicité)
        if (user.password !== password) {
            return res.status(401).json({ error: "Identifiants incorrects" });
        }
        
        res.json({ 
            success: true, 
            message: "Connexion réussie",
            userId: user.id,
            username: user.user_name
        });
    });
};

// Déconnexion
exports.logout = (req, res) => {
    res.json({ success: true, message: "Déconnexion réussie" });
};