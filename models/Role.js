const { DataTypes } = require('sequelize');
const settings = require('../settings');
const sequelize = require('../database/sequelize');

const Role = sequelize.define("Role", {
    name: {
      type: DataTypes.STRING
    }
  }, {
    //Other moddel options go here
    tableName: 'roles'
});

(async () => {
    try {
        await Role.sync()
        console.log(`Table '${Role.tableName}' was created successfully or already existed.`);    
        // Create roles if they don't exist
        await Role.findOrCreate({
            name: settings.roles[0],
            where: {
                name: settings.roles[0]
            } 
        })
        await Role.findOrCreate({
            name: settings.roles[1],
            where: {
                name: settings.roles[1]
            } 
        })
        await Role.findOrCreate({
            name: settings.roles[2],
            where: {
                name: settings.roles[2]
            } 
        })
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();


module.exports = Role
