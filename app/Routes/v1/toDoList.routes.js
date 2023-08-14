const express = require("express")
const { TodoListController } = require("../../TodoList")
const { refreshToken, heimdall, rateLimit } = require("../../middleware")
const { createUser, signIn } = require("../../middleware/validator/user")

const router = express.Router()
const use = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

router.post("/", rateLimit, heimdall, use(TodoListController.createNewTask.bind(TodoListController)))

module.exports = router
