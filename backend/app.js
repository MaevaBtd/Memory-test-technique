// Imports
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// Déclaration du model de données pour la sauvegarde et l'affichage des résultats 
const Results = require('./models/results');

// Initialisation du backend
const app = express();

// Connexion à la Base de données MongoDB
mongoose.connect('mongodb+srv://maeva:WHRR29lPJ6FSNwgY@memory.ikirp.mongodb.net/time_results?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Assure que le JSON et les formulaires HTML sont pris en charge
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Autorise le partage des ressources entre origines multiples pour permettre au client de communiquer avec la base de données
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

// Fonction POST permettant la sauvegarde du nom et du temps de jeu en base de données.
app.post('/api/results', (req, res, next) => {
    delete req.body._id;
    let results = new Results();
    // Formate la réponse afin d'attribuer le nom et le temps à la clé correspondante dans l'objet JSON.
    results.name = req.body.name;
    results.time = req.body.time;
    results.save()
      .then((item => {
        res.send("Results saved to database");
        }))
      .catch(error => res.status(400).json({ error }));
});

// Fonction GET permettant de récupérer en base de données les résultats précédement enregistrés. 
app.use('/api/results', (req, res, next) => {
    Results.find()
    .then(result => res.status(200).json(result))
    .catch(error => res.status(400).json({ error }));
  });

module.exports = app;