const express = require("express")
const mongoose = require("mongoose")
const morgan = require("morgan")
const v1 = require("./Routes/v1")
const cors = require("cors")

const { ErrorHandler } = require("./Handler")
const values = require("./values")
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

const MONGOOSE_USR = process.env.MONGOOSE_USR
const MONGOOSE_AUTH_USR = process.env.MONGOOSE_AUTH_USR
const MONGOOSE_PWD = process.env.MONGOOSE_PWD
const MONGOOSE_PORT = process.env.MONGOOSE_PORT
const MONGOOSE_IP = process.env.MONGOOSE_IP
const MONGOOSE_DATABASE_NAME = process.env.MONGOOSE_DATABASE_NAME
const MONGOOSE_CONNECTION_URL = `mongodb://
${MONGOOSE_USR}:
${encodeURIComponent(MONGOOSE_PWD)}@${MONGOOSE_IP}:${MONGOOSE_PORT}/${MONGOOSE_DATABASE_NAME}`
const MONGOOSE_CONFIG = {
  useNewUrlParser: true,
  authSource: MONGOOSE_AUTH_USR,
  useUnifiedTopology: true,
}
mongoose
  .connect(MONGOOSE_CONNECTION_URL, MONGOOSE_CONFIG)
  .then(async (result) => {
    console.log("CONNECTED")
  })
  .catch((err) => {
    console.log({ MONGO_ERROR: err })
  })
module.exports = app
