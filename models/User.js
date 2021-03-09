const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');
const Role = require('./Role')

const User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    }
  }, {
    //Other moddel options go here
    tableName: 'users'
});

User.belongsTo(Role, {as: 'role'});

(async () => {
    try {
        await User.sync()
        console.log(`Table '${User.tableName}' was created successfully or already existed.`);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

module.exports = User
