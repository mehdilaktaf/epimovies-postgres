const mongoose = require('mongoose'); 
const settings = require('../settings');

mongoose.connect(
    settings.mongo_url, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    });

const mongo = mongoose.connection;

mongo.on('error', console.error.bind(console, 'Erreur lors de la connexion à la base mongo')); 
mongo.once('open', function (){
    console.log(`Connexion à la base de données ${mongo.name} OK`); 
}); 

module.exports = mongo