const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

// ✅ สร้าง instance ของ Sequelize
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

// โหลด Models ทั้งหมด
const UserModel = require("./user");         // ใช้ไฟล์ user.sql.js
const SportStadiumModel = require("./sportstadium"); 
const SportModel = require("./sport");
const TeamModel = require("./team");

// ผูก Model เข้ากับ Sequelize
const User = UserModel(sequelize, DataTypes);
const SportStadium = SportStadiumModel(sequelize, DataTypes);
const Sport = SportModel(sequelize, DataTypes);
const Team = TeamModel(sequelize, DataTypes);

// Export ทั้งหมดออกไป
module.exports = {
  sequelize,
  User,
  SportStadium,
  Sport,
  Team,
};
