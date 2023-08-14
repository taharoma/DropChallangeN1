const Joi = require("@hapi/joi")
const { statusCodes } = require("../../../values")

const validate = (req, res, next) => {
  const schema = Joi.object({
    status: Joi.string().valid("OPEN", "CLOSED").required(),
    toDoId: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required(),
  })
  const { error } = schema.validate(req.body, { abortEarly: false })
  if (error) {
    return res.status(400).json({ statusCode: statusCodes.PARAM_ERROR, message: error.message })
  }
  next()
}

module.exports = validate
