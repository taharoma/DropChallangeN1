const UserService = require("./user.service")
const { bcrypt, jwt } = require("../utils")

const { ErrorHandler, ResponseHandler, ValidatorHandler } = require("../Handler")
const { statusCodes } = require("../values")

class UserController {
  constructor() {
    this.UserService = UserService
    this.jwt = jwt
  }

  async createNewUser(req, res) {
    let { role, userName, password } = req.body
    const isUserNameExist = await this.UserService.isUserNameExist(userName)
    if (isUserNameExist)
      throw new ErrorHandler({
        httpCode: 400,
        statusCode: statusCodes.ERROR_USER_NAME_EXIST,
        message: "username exist",
      })

    const createdUser = await this.UserService.createNewUser({
      role,
      userName,
      password: await bcrypt.hashPassword(password),
    })
    return ResponseHandler.send({
      res,
      httpCode: 200,
      statusCode: statusCodes.SUCCESS_RESPONSE,
      result: createdUser,
    })
  }

  async signIn(req, res) {
    let { userName, password } = req.body
    const foundedUser = await this.UserService.findUserByUserName(userName)
    if (!foundedUser)
      throw new ErrorHandler({
        httpCode: 400,
        statusCode: statusCodes.USER_NAME_NOT_FOUND,
      })
    let accessToken
    const comparePassword = await bcrypt.comparePassword({ password, hashPassword: foundedUser.password })
    if (comparePassword && foundedUser.accessToken.length > 0) {
      for (const i in foundedUser.accessToken) {
        if ((await this.jwt.tokenVerify(foundedUser.accessToken[i])) === "expire") {
          await this.UserService.pullAccessToken({
            userId: foundedUser._id,
            accessToken: foundedUser.accessToken[i],
          })
        }
      }
    }
    accessToken = await this.jwt.tokenGenerator({
      role: foundedUser.role,
      _id: foundedUser._id,
      userName: foundedUser.userName,
      expire: process.env.ACCESS_TOKEN_EXPIRE_TIME,
    })
    await this.UserService.pushAccessToken({ userId: foundedUser._id, accessToken })
    return ResponseHandler.send({
      res,
      httpCode: 200,
      statusCode: statusCodes.SUCCESS_RESPONSE,
      result: {
        accessToken,
      },
    })
  }
}
module.exports = new UserController()
