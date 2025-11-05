const { Sequelize } = require("sequelize");
require("dotenv").config();

exports.createSequelize = async () => {
  const sequelize = new Sequelize(
    process.env.MYSQL_DB,       
    process.env.MYSQL_USER,     
    process.env.MYSQL_PASSWORD, 
    { 
      host: process.env.MYSQL_HOST, 
      port: process.env.MYSQL_PORT || 3306,
      dialect: "mysql",          
      logging: false,
    }
  );

  await sequelize.authenticate();
  return sequelize;
};
