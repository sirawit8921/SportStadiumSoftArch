const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Team = sequelize.define(
    "Team",
    {
      teamName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expectedNumberOfPlayers: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      currentNumberOfPlayers: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "Teams",
      timestamps: false,
    }
  );

  return Team;
};
