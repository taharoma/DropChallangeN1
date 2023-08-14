const UserRoutes = require("./user.routes")
const TodoListRoutes = require("./toDoList.routes")

const express = require("express")
const router = express.Router()

router.use("/user", UserRoutes)
router.use("/to-do-list", TodoListRoutes)

module.exports = router
