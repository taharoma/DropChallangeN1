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
    const foundedUser = await this.UserService.findPasswordByUserName(userName)
    console.log({ foundedUserA: foundedUser.accessToken })
    if (!foundedUser)
      throw new ErrorHandler({
        httpCode: 400,
        statusCode: statusCodes.USER_NAME_NOT_FOUND,
      })
    let accessToken
    let refreshToken = foundedUser.dataValues?.refreshToken
    const comparePassword = await bcrypt.comparePassword({ password, hashPassword: foundedUser.password })
    console.log({ comparePassword, accessToken: foundedUser.dataValues?.accessToken.length })
    if (comparePassword && foundedUser.dataValues?.accessToken.length > 0) {
      for (const i in foundedUser.dataValues.accessToken) {
        console.log({ accessToken: foundedUser.dataValues.accessToken[i] })
        console.log({ tokenVerify: await this.jwt.tokenVerify(foundedUser.dataValues.accessToken[i]) })
        if ((await this.jwt.tokenVerify(foundedUser.dataValues.accessToken[i])) === "expire") {
          await this.UserService.pullAccessToken({
            userName: foundedUser.dataValues.userName,
            accessToken: foundedUser.dataValues.accessToken[i],
          })
        }
      }

      accessToken = await this.jwt.tokenGenerator({
        role: foundedUser.dataValues.role,
        userName: foundedUser.dataValues.userName,
        expire: process.env.ACCESS_TOKEN_EXPIRE_TIME,
      })
      console.log({ accessToken })
      if ((await this.jwt.tokenVerify(refreshToken)) === "expire") {
        refreshToken = await this.jwt.tokenGenerator({
          role: foundedUser.dataValues.role,
          userName: foundedUser.dataValues.userName,
          expire: process.env.REFRESH_TOKEN_EXPIRE_TIME,
        })
      }
    }
    await this.UserService.pushAccessToken({ userName: foundedUser.dataValues.userName, accessToken })
    await this.UserService.updateRefreshToken({ userName: foundedUser.dataValues.userName, refreshToken })
    return ResponseHandler.send({
      res,
      httpCode: 200,
      statusCode: statusCodes.SUCCESS_RESPONSE,
      result: {
        refreshToken,
        accessToken,
      },
    })
  }
}
module.exports = new UserController()
