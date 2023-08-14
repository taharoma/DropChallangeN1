const { DataTypes } = require("sequelize")
const sequelize = require("../sequelizeConfig")

const User = sequelize.define(
  "User",
  {
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["ADMIN", "CLIENT"]],
      },
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    refreshToken: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    accessToken: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    tableName: "users",
    indexes: [
      {
        unique: true,
        fields: ["userName"],
      },
    ],
  }
)

module.exports = User
