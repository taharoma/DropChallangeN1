const { jwt } = require("../utils")
const { statusCodes } = require("../values")
const UserService = require("../User/user.service")

module.exports = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1]
    if (!accessToken) return res.status(403).json({ CODE: statusCodes.AUTH_FAILED })
    const decodeToken = await jwt.tokenDeCode(accessToken)

    if (!decodeToken) return res.status(403).json({ CODE: statusCodes.AUTH_FAILED })
    const verifyToken = await jwt.tokenVerify(accessToken)
    if (verifyToken === "expire") return res.status(403).json({ CODE: statusCodes.AUTH_FAILED })
    const isTokenValid = await UserService.checkTokenValidity(accessToken)

    if (!isTokenValid) return res.status(403).json({ CODE: statusCodes.AUTH_FAILED })

    const foundedUser = await UserService.findUserById(decodeToken._id)
    if (!foundedUser) return res.status(403).json({ CODE: statusCodes.AUTH_FAILED })
    if (!foundedUser.accessToken.includes(accessToken)) return res.status(403).json({ CODE: statusCodes.AUTH_FAILED })

    req.userName = foundedUser.userName
    req.userId = foundedUser._id
    req.accessToken = accessToken
    req.role = foundedUser.role
    next()
  } catch (e) {
    console.log({ e })
    res.status(403).json({ CODE: statusCodes.AUTH_FAILED })
  }
}
