const express = require("express")
const morgan = require("morgan")
const v1 = require("./Routes/v1")
const cors = require("cors")

const { ErrorHandler } = require("./Handler")
const values = require("./values")
const sequelize = require("./sequelizeConfig") // Import your Sequelize configuration
const app = express()

app.use(morgan("dev"))
app.use(cors())
app.use(express.json())

app.use("/api/v1", v1)

app.use((err, req, res, next) => {
  console.log({ err })
  if (err instanceof ErrorHandler) {
    res.status(err.httpCode).json({
      CODE: err.statusCode,
      result: err.result,
      message: err.message,
    })
  } else {
    res.status(500).json({ message: values.statusCodes.ERROR_INTERNAL })
  }
})

sequelize
  .authenticate()

  .then(() => {
    console.log("Connected to PostgreSQL database")
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err)
  })
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database synchronized")
  })
  .catch((err) => {
    console.error("Error synchronizing database:", err)
  })

module.exports = app
