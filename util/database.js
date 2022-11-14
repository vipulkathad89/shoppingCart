const Sequelize = require("Sequelize");
const sequelize = new Sequelize("shopping_cart", "root", "", {
    
    dialect: "mysql",
    host: "localhost",
  
});


module.exports = sequelize;
