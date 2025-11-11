const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Sport = sequelize.define(
    "Sport",
    {
      sportType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      openTime: {
        type: DataTypes.STRING,
      },
      closeTime: {
        type: DataTypes.STRING,
      },
      sportStadiumId: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      tableName: "Sports",
      timestamps: false
    }
  );

  return Sport;
}
