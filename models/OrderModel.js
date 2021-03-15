const sequelize = require('../database/sequelize');
const Movie = require('./Movie')


const OrderModel = sequelize.define('OrderModel');

OrderModel.belongsTo(OrderModel)

module.exports = OrderModel
