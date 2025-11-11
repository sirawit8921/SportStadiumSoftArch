const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const SportStadium = sequelize.define(
    "SportStadium",
    {
      sportstadiumName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
      },
      latitude: {
        type: DataTypes.FLOAT,
      },
      longitude: {
        type: DataTypes.FLOAT,
      },
      indoor: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      facilities: {
        type: DataTypes.JSON,
        defaultValue: [],
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "SportStadiums",
      timestamps: false,
    }
  );

  return SportStadium;
};
