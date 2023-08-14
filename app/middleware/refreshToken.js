const { jwt } = require("../utils")
const { statusCodes } = require("../values")
const { UserService } = require("../User")
const { ResponseHandler } = require("../Handler")

module.exports = async (req, res, next) => {
  try {
    let refreshToken = req.headers.refreshtoken
    if (!refreshToken) return res.status(403).json({ CODE: statusCodes.REFRESH_TOKEN_AUTH_FAILED })

    const decodeToken = jwt.tokenDeCode(refreshToken)
    if (!decodeToken) return res.status(403).json({ CODE: statusCodes.REFRESH_TOKEN_AUTH_FAILED })

    const foundedUser = await UserService.findUserByUserName(decodeToken.userName)
    if (!foundedUser) return res.status(403).json({ CODE: statusCodes.REFRESH_TOKEN_AUTH_FAILED })

    const verifyToken = await jwt.tokenVerify(refreshToken)
    if (verifyToken === "expire") return res.status(403).json({ CODE: statusCodes.REFRESH_TOKEN_AUTH_FAILED })
    const accessToken = await jwt.tokenGenerator({
      role: foundedUser.role,
      userName: foundedUser.userName,
      expire: process.env.ACCESS_TOKEN_EXPIRE_TIME,
    })

    for (const i in foundedUser?.accessToken) {
      if ((await jwt.tokenVerify(foundedUser.accessToken[i])) === "expire") {
        await UserService.pullAccessToken({ userName: foundedUser.userName, accessToken: foundedUser.accessToken[i] })
      }
    }

    await UserService.pushAccessToken({ userName: foundedUser.userName, accessToken })

    return ResponseHandler.send({
      res,
      httpCode: 200,
      statusCode: statusCodes.SUCCESS_RESPONSE,
      result: { accessToken },
    })
  } catch (e) {
    console.log({ e })
    return res.status(403).json({ CODE: statusCodes.REFRESH_TOKEN_AUTH_FAILED })
  }
}
