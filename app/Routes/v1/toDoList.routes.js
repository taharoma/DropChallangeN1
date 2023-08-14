const express = require("express")
const { TodoListController } = require("../../TodoList")
const { heimdall, rateLimit } = require("../../middleware")
const { createUser, signIn } = require("../../middleware/validator/user")

const router = express.Router()
const use = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

router.post("/", rateLimit, heimdall, use(TodoListController.createNewToDo.bind(TodoListController)))
router.put("/status", rateLimit, heimdall, use(TodoListController.updateToDoStatus.bind(TodoListController)))
router.post("/find", rateLimit, heimdall, use(TodoListController.findToDoList.bind(TodoListController)))

module.exports = router
