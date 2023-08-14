const TodoListRepository = require("./todoList.repository")

class TodoListService {
  constructor() {
    this.TodoListRepository = TodoListRepository
  }

  createNewToDo = async (arg) => await this.TodoListRepository.createNewToDo(arg)

  find = async (arg) => await this.TodoListRepository.find(arg)

  updateToDoStatus = async (arg) => await this.TodoListRepository.updateToDoStatus(arg)

  sort = async ({ sort, query }) => {
    switch (sort) {
      case "NEWEST":
        sort = { createdAt: -1 }
        break

      case "OLDEST":
        sort = { createdAt: 1 }
        break

      case "HIGHEST_PRIORITY":
        sort = { priority: -1 }
        break

      case "LOWEST_PRIORITY":
        sort = { priority: 1 }
        break

      case "NEAREST_DATE":
        sort = { dueDate: 1 }
        query.$and.push({
          dueDate: {
            $gte: new Date(),
          },
        })
        break

      case "DISTANT_DATE":
        sort = { dueDate: -1 }
        query.$and.push({
          dueDate: {
            $gte: new Date(),
          },
        })
        break
      default:
        sort = false
        break
    }
    return { sort, query }
  }

  search = async ({ search, query }) => {
    switch (search.searchMode) {
      case "description":
        query.$and.push({ description: { $regex: search.searchValue } })
        break
      //* for other search in future
    }
    return query
  }
  checkRole = async ({ role, query, userId }) => {
    switch (role) {
      case "CLIENT":
        query.$and.push({ ownerId: userId })
        break
      //* for other role in future
    }

    return query
  }

  dueDateRange = async ({ dueDateRange, query }) => {
    let { startDate, endDate } = dueDateRange
    if (startDate && endDate) {
      endDate = new Date(endDate)
      query.$and.push({ dueDate: { $gte: new Date(startDate), $lt: new Date(endDate.setDate(endDate.getDate() + 1)) } })
    }
    if (startDate && !endDate) {
      query.$and.push({ dueDate: { $gte: new Date(startDate) } })
    }
    if (!startDate && endDate) {
      endDate = new Date(endDate)
      query.$and.push({ dueDate: { $lt: new Date(endDate.setDate(endDate.getDate() + 1)) } })
    }
    return query
  }
}

module.exports = new TodoListService()
