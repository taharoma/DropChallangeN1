const TodoListService = require("./todoList.service")
const { ErrorHandler, ResponseHandler } = require("../Handler")
const { statusCodes } = require("../values")

class TodoListController {
  constructor() {
    this.TodoListService = TodoListService
  }

  async createNewToDo(req, res) {
    let { description, dueDate, priority, status } = req.body
    const createdTask = await this.TodoListService.createNewToDo({
      description,
      dueDate,
      priority,
      status,
      ownerId: req.userId,
    })
    return ResponseHandler.send({
      res,
      httpCode: 201,
      statusCode: statusCodes.SUCCESS_RESPONSE,
      result: createdTask,
    })
  }

  async updateToDoStatus(req, res) {
    let { toDoId, status } = req.body
    const createdTask = await this.TodoListService.updateToDoStatus({
      toDoId,
      status,
    })
    return ResponseHandler.send({
      res,
      httpCode: 201,
      statusCode: statusCodes.SUCCESS_RESPONSE,
      result: createdTask,
    })
  }

  async findToDoList(req, res) {
    let { page, limit, sort = "NEWEST", search, dueDateRange, priority, status, ownerId, populate } = req.body
    let query = { $and: [] }
    let values = await this.TodoListService.sort({ sort, query })
    query = values.query
    sort = values.sort

    query = await this.TodoListService.checkRole({ role: req.role, userId: req.userId, query })

    if (priority) query.$and.push({ priority })
    if (status) query.$and.push({ status })
    if (ownerId && req.role === "ADMIN") query.$and.push({ ownerId })

    if (search) query = await this.TodoListService.search({ search, query })

    if (dueDateRange) query = await this.TodoListService.dueDateRange({ dueDateRange, query })
    query = query.$and.length < 1 ? null : query
    return ResponseHandler.send({
      res,
      httpCode: 201,
      statusCode: statusCodes.SUCCESS_RESPONSE,
      result: await this.TodoListService.find({ query, sort, populate, page, limit }),
    })
  }
}
module.exports = new TodoListController()
