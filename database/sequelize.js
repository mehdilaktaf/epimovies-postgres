const settings = require('../settings');
const { Sequelize } = require('sequelize');

const sequelize  = new Sequelize({      
    database: settings.postgres_db,
    username: settings.postgres_user,
    password: settings.postgres_pwd, 
    host: settings.postgres_host,
    port: settings.postgres_port,
    dialect: "postgres",
    logging: false,
    }
);

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to sequelize has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the sequelize database:', error);
    }
})();


module.exports = sequelize
