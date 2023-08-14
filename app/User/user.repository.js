const User = require("./user.model")

class UserRepository {
  async isUserNameExist(userName) {
    return !!(await User.findOne({ userName }))
  }

  async findUserById(id) {
    return await User.findById(id).select("password role userName accessToken")
  }

  async findUserByUserName(userName) {
    return await User.findOne({ userName }).select("password role userName accessToken")
  }

  async createNewUser({ role, userName, password }) {
    return await User({ role, userName, password }).save()
  }

  async pullAccessToken({ userId, accessToken }) {
    return await User.findByIdAndUpdate(userId, { $pull: { accessToken } }, { new: true })
  }

  async pushAccessToken({ userId, accessToken }) {
    return await User.findByIdAndUpdate(userId, { $push: { accessToken } })
  }
}

module.exports = new UserRepository()
