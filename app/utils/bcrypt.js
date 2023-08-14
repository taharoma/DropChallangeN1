const bcrypt = require("bcrypt")
const dotenv = require("dotenv")
dotenv.config()
const saltRounds = Number(process.env.SALT_ROUNDS)

class bcryptService {
  hashPassword = async (password) => {
    return bcrypt.hashSync(password, saltRounds)
  }

  comparePassword = async ({ password, hashPassword }) => {
    return bcrypt.compareSync(password, hashPassword)
  }
}

module.exports = new bcryptService()
