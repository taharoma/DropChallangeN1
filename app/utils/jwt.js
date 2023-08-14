const values = require("../values")
const jwt = require("jsonwebtoken")

class jwtService {
  tokenGenerator = async ({ _id, role, userName, expire }) => {
    try {
      const token = jwt.sign({ _id, role, userName }, process.env.JWT_SECRET, {
        expiresIn: expire,
      })
      return token
    } catch (e) {
      console.log({ e })
    }
  }

  tokenDeCode = async (token) => {
    try {
      const data = jwt.decode(token)
      return data
    } catch (e) {
      console.log({ e })
    }
  }

  tokenVerify = async (token) => {
    try {
      console.log({ token, JWT_SECRET: process.env.JWT_SECRET })
      const data = jwt.verify(token, process.env.JWT_SECRET)
      console.log({ data })

      return data
    } catch (e) {
      return "expire"
    }
  }
}

module.exports = new jwtService()
