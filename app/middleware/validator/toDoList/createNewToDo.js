const Joi = require("@hapi/joi")
const { statusCodes } = require("../../../values")

const validate = (req, res, next) => {
  const schema = Joi.object({
    description: Joi.string().required(),
    dueDate: Joi.date().iso().required(),
    priority: Joi.number().valid(1, 2, 3, 4, 5, 6, 7, 8, 9, 10).required(),
    status: Joi.string().valid("OPEN", "CLOSED").optional(),
  })
  const { error } = schema.validate(req.body, { abortEarly: false })
  if (error) {
    return res.status(400).json({ statusCode: statusCodes.PARAM_ERROR, message: error.message })
  }
  next()
}

module.exports = validate
