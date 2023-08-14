const express = require("express")
const { TodoListController } = require("../../TodoList")
const { heimdall, rateLimit } = require("../../middleware")
const { createNewToDo, updateToDoStatus, findToDoList } = require("../../middleware/validator/toDoList")

const router = express.Router()
const use = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

router.post("/", rateLimit, heimdall, createNewToDo, use(TodoListController.createNewToDo.bind(TodoListController)))
router.put("/status", rateLimit, heimdall, updateToDoStatus, use(TodoListController.updateToDoStatus.bind(TodoListController)))
router.post("/find", rateLimit, heimdall, findToDoList, use(TodoListController.findToDoList.bind(TodoListController)))

module.exports = router
