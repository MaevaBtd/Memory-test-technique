const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const Results = require('./models/results');

mongoose.connect('mongodb+srv://maeva:WHRR29lPJ6FSNwgY@memory.ikirp.mongodb.net/time_results?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true }
    )
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.post('/api/results', (req, res, next) => {
    delete req.body._id;
    let results = new Results();
    results.name = req.body.name;
    results.time = req.body.time;
    results.save()
      .then((item => {
        res.send("item saved to database");
        }))
      .catch(error => res.status(400).json({ error }));
});

app.use('/api/results', (req, res, next) => {
    Results.find()
    .then(result => res.status(200).json(result))
    .catch(error => res.status(400).json({ error }));
  });

module.exports = app;