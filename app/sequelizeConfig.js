const Sequelize = require("sequelize")
const dotenv = require("dotenv")
dotenv.config()

const sequelize = new Sequelize({
  dialect: process.env.PSG_DIALECT,
  host: process.env.PSG_HOST,
  port: Number(process.env.PSG_PORT),
  username: process.env.PSG_USERNAME,
  password: process.env.PSG_PASSWORD,
  database: process.env.PSG_DATABASE,
})

module.exports = sequelize
