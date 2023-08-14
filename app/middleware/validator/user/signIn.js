const Joi = require("@hapi/joi")
const { statusCodes } = require("../../../values")

const validate = (req, res, next) => {
  const schema = Joi.object({
    userName: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string()
      .min(8)
      .max(30)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/)
      .required(),
  })
  const { error } = schema.validate(req.body, { abortEarly: false })
  if (error) {
    return res.status(400).json({ statusCode: statusCodes.PARAM_ERROR, message: error.message })
  }
  next()
}

module.exports = validate
