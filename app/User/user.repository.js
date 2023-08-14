const User = require("./user.model") // Import your Sequelize User model
const { Op, literal } = require("sequelize") // Import Op and literal from Sequelize

class UserRepository {
  async createNewUser({ role, userName, password }) {
    return await User.create({
      role,
      userName,
      password,
    })
  }

  async isUserNameExist(userName) {
    return !!(await User.findOne({
      where: { userName },
    }))
  }

  async findPasswordByUserName(userName) {
    return await User.findOne({
      attributes: ["password", "role", "userName", "refreshToken", "accessToken"],
      where: { userName },
    })
  }

  async findUserByUserName(userName) {
    return (await User.findOne({ userName })).dataValues
  }

  async pullAccessToken({ userName, accessToken }) {
    console.log({ pullAccessToken: { userName, accessToken } })
    await User.update({ accessToken: literal(`array_remove("accessToken", '${accessToken}')`) }, { where: { userName }, returning: true })
    return true
  }

  async pushAccessToken({ userName, accessToken }) {
    await User.update(
      {
        accessToken: literal(`array_append("accessToken", '${accessToken}')`),
      },
      { where: { userName }, returning: true }
    )

    return true
  }

  async updateRefreshToken({ userName, refreshToken }) {
    await User.update(
      {
        refreshToken: literal(`array_append("refreshToken", '${refreshToken}')`),
      },
      { where: { userName }, returning: true }
    )
    return true
  }
}

module.exports = new UserRepository()
