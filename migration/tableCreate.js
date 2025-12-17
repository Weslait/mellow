const mysql = require("mysql");
const config = require("../config");

const conx = mysql.createConnection(config.db);

conx.connect(err => {
  if (err) throw err;
  console.log("Connexion MySQL réussie");

  const queries = [

    `CREATE TABLE IF NOT EXISTS Users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_name VARCHAR(25) NOT NULL,
      password VARCHAR(255) NOT NULL,
      avatar VARCHAR(100),
      age TINYINT 
    )`,

    `CREATE TABLE IF NOT EXISTS Tags (
      id INT AUTO_INCREMENT PRIMARY KEY,
      tag_name VARCHAR(50) NOT NULL 
    )`,

    `CREATE TABLE IF NOT EXISTS Film (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50),
      year YEAR,
      duration VARCHAR(25),
      rating DECIMAL(3,1)
    )`,

    `CREATE TABLE IF NOT EXISTS Serie (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50),
      year YEAR,
      ep INT,
      rating DECIMAL(3,1)
    )`,

    `CREATE TABLE IF NOT EXISTS users_tags (
      user_id INT NOT NULL,
      tag_id INT NOT NULL,
      PRIMARY KEY (user_id, tag_id),
      FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES Tags(id) ON DELETE CASCADE
    )`,

    `CREATE TABLE IF NOT EXISTS users_films (
      user_id INT NOT NULL,
      film_id INT NOT NULL,
      PRIMARY KEY (user_id, film_id),
      FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
      FOREIGN KEY (film_id) REFERENCES Film(id) ON DELETE CASCADE
    )`,

    `CREATE TABLE IF NOT EXISTS users_series (
      user_id INT NOT NULL,
      serie_id INT NOT NULL,
      PRIMARY KEY (user_id, serie_id),
      FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
      FOREIGN KEY (serie_id) REFERENCES Serie(id) ON DELETE CASCADE
    )`
  ];

  queries.forEach(query => {
    conx.query(query, err => {
      if (err) throw err;
    });
  });

  console.log("Toutes les tables sont crées");
});
