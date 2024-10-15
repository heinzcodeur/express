const express = require('express');
const app = express();

app.use(express.json());

// Définir le dossier contenant les templates EJS
app.set('view engine', 'ejs');

// Statique pour les fichiers CSS/JS
app.use(express.static('public'));

const mysql = require('mysql2');

// Créer une connexion MySQL
const connection = mysql.createConnection({
  host: 'localhost',  // Ou l'adresse de ton serveur MySQL
  user: 'root',       // Ton utilisateur MySQL
  password: 'Lazerty_94',       // Le mot de passe pour ton utilisateur MySQL
  database: 'articles_db'  // Nom de la base de données
});

// Connexion à MySQL
connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à MySQL:', err);
    return;
  }
  console.log('Connecté à MySQL !');
});


// Tableau des articles
let articles = [
  { id: 1, title: 'Article 1', content: 'Ceci est le premier article.' },
  { id: 2, title: 'Article 2', content: 'Ceci est le deuxième article.' }
];

// Route GET : Récupérer tous les articles
app.get('/articles', (req, res) => {
  res.render('articles', {articles})
});

// Route GET : Récupérer un article par son ID
app.get('/articles/:id', (req, res) => {
  const article = articles.find(a => a.id === parseInt(req.params.id));
  if (!article) return res.status(404).send('Article non trouvé');
  res.json(article);
});

// Route POST : Créer un nouvel article
// app.post('/articles', (req, res) => {
//   const newArticle = {
//     id: articles.length + 1,
//     title: req.body.title,
//     content: req.body.content
//   };
//   articles.push(newArticle);
//   res.status(201).json(newArticle);
// });

app.post('/articles', (req, res) => {
  const { title, content } = req.body;

  const sql = 'INSERT INTO articles (title, content) VALUES (?, ?)';
  connection.query(sql, [title, content], (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'insertion de l\'article:', err);
      return res.status(500).send('Erreur lors de l\'enregistrement de l\'article');
    }
    res.status(201).json({ id: result.insertId, title, content });
  });
});


// Route PUT : Mettre à jour un article
app.put('/articles/:id', (req, res) => {
  const article = articles.find(a => a.id === parseInt(req.params.id));
  if (!article) return res.status(404).send('Article non trouvé');

  article.title = req.body.title;
  article.content = req.body.content;
  res.json(article);
});

// Route DELETE : Supprimer un article
app.delete('/articles/:id', (req, res) => {
  const articleIndex = articles.findIndex(a => a.id === parseInt(req.params.id));
  if (articleIndex === -1) return res.status(404).send('Article non trouvé');

  articles.splice(articleIndex, 1);
  res.status(204).send(); // 204 No Content
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Erreur serveur');
});

// Lancer le serveur
const port = 3000;
app.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});
