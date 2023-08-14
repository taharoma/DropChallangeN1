const { jwt } = require("../utils")
const { statusCodes } = require("../values")
const UserService = require("../User/user.service")

module.exports = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1]
    if (!accessToken) return res.status(403).json({ CODE: statusCodes.AUTH_FAILED })
    console.log({ accessToken })
    const decodeToken = await jwt.tokenDeCode(accessToken)
    console.log({ decodeToken })

    if (!decodeToken) return res.status(403).json({ CODE: statusCodes.AUTH_FAILED })
    const verifyToken = await jwt.tokenVerify(accessToken)
    console.log({ verifyToken })

    if (verifyToken === "expire") return res.status(403).json({ CODE: statusCodes.AUTH_FAILED })
    const isTokenValid = await UserService.checkTokenValidity(accessToken)
    console.log({ isTokenValid })

    if (!isTokenValid) return res.status(403).json({ CODE: statusCodes.AUTH_FAILED })

    const foundedUser = await UserService.findUserByUserName(decodeToken.userName)
    console.log({ foundedUser })

    if (!foundedUser) return res.status(403).json({ CODE: statusCodes.AUTH_FAILED })
    console.log({ jaaaaaaafar: foundedUser.accessToken })
    if (!foundedUser.accessToken.includes(accessToken)) return res.status(403).json({ CODE: statusCodes.AUTH_FAILED })

    req.userName = foundedUser.userName
    req.accessToken = accessToken
    req.refreshToken = foundedUser?.refreshToken
    req.role = foundedUser.role
    next()
  } catch (e) {
    console.log({ e })
    res.status(403).json({ CODE: statusCodes.AUTH_FAILED })
  }
}
