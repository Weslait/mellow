let mysql = require("mysql");
let config = require("../config");

// user: root , Rien pour le mot de passe.
let conx = mysql.createConnection(config.initDb);

conx.connect(function (err) {
  if (err) throw err;
  console.log("Connexion to MySQL successful");
  let SQLQuery = "CREATE DATABASE IF NOT EXISTS " + config.db.database;
  conx.query(SQLQuery, (err, result) => {
    if (err) throw err;
    console.log("Database successfully created");
  });
});
