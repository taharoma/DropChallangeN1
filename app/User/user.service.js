const UserRepository = require("./user.repository")
const { jwt } = require("../utils")

class UserService {
  constructor() {
    this.UserRepository = UserRepository
  }

  isUserNameExist = async (arg) => await this.UserRepository.isUserNameExist(arg)

  createNewUser = async (arg) => await this.UserRepository.createNewUser(arg)

  findPasswordByUserName = async (arg) => await this.UserRepository.findPasswordByUserName(arg)

  pullAccessToken = async (arg) => await this.UserRepository.pullAccessToken(arg)

  updateRefreshToken = async (arg) => await this.UserRepository.updateRefreshToken(arg)

  pushAccessToken = async (arg) => await this.UserRepository.pushAccessToken(arg)

  findUserByUserName = async (arg) => await this.UserRepository.findUserByUserName(arg)

  checkTokenValidity = async (accessToken) => {
    const decodeToken = jwt.tokenDeCode(accessToken)
    if (!decodeToken) return false
    const verifyToken = await jwt.tokenVerify(accessToken)
    if (verifyToken === "expire") return false
    return true
  }
}

module.exports = new UserService()
