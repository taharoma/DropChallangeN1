const UserRepository = require("./user.repository")
const { jwt } = require("../utils")

class UserService {
  constructor() {
    this.UserRepository = UserRepository
  }

  isUserNameExist = async (arg) => await this.UserRepository.isUserNameExist(arg)

  createNewUser = async (arg) => await this.UserRepository.createNewUser(arg)

  findUserById = async (arg) => await this.UserRepository.findUserById(arg)

  findUserByUserName = async (arg) => await this.UserRepository.findUserByUserName(arg)

  pullAccessToken = async (arg) => await this.UserRepository.pullAccessToken(arg)

  pushAccessToken = async (arg) => await this.UserRepository.pushAccessToken(arg)

  checkTokenValidity = async (accessToken) => {
    const decodeToken = jwt.tokenDeCode(accessToken)
    if (!decodeToken) return false
    const verifyToken = await jwt.tokenVerify(accessToken)
    if (verifyToken === "expire") return false
    return true
  }
}

module.exports = new UserService()
