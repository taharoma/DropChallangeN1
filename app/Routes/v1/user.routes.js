const express = require("express")
const { UserController } = require("../../User")
const { refreshToken, heimdall, rateLimit } = require("../../middleware")
const { createUser, signIn } = require("../../middleware/validator/user")

const router = express.Router()
const use = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

router.post("/sign-up", rateLimit, createUser, use(UserController.createNewUser.bind(UserController)))

router.post("/sign-in", rateLimit, signIn, use(UserController.signIn.bind(UserController)))

router.get("/refresh-token", rateLimit, refreshToken)

module.exports = router
