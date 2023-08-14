const rateLimit = require("express-rate-limit")
const { statusCodes } = require("../values")

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { CODE: statusCodes.TO_MANY_REQUESTS, message: "Too many requests, please try again later" },
})

module.exports = limiter
