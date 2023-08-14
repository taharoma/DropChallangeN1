const ToDoList = require("./todoList.model")

class TodoListRepository {
  async createNewToDo({ description, dueDate, priority, status, ownerId }) {
    return await ToDoList({
      description,
      dueDate,
      priority,
      status,
      ownerId,
    }).save()
  }

  async updateToDoStatus({ toDoId, status }) {
    return await ToDoList.findByIdAndUpdate(
      toDoId,
      {
        status,
      },
      { new: true }
    )
  }

  async find({ query, sort, populate, page, limit = 10 }) {
    return page
      ? await ToDoList.paginate(query, { limit, page, lean: true, sort, populate })
      : await ToDoList.find(query).populate(populate).sort(sort).lean()
  }
}

module.exports = new TodoListRepository()
