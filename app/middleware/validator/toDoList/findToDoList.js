const { statusCodes } = require("../../../values")
const Joi = require("@hapi/joi")

const validate = (req, res, next) => {
  const schema = Joi.object({
    search: Joi.object({
      searchMode: Joi.string().valid("description").optional(), //todo after add search edit this object validation
      searchValue: Joi.optional(),
    }).optional(),
    dueDateRange: Joi.object({
      startDate: Joi.date(),
      endDate: Joi.date(),
    }).optional(),
    priority: Joi.number().valid(1, 2, 3, 4, 5, 6, 7, 8, 9, 10).optional(),
    status: Joi.string().valid("OPEN", "CLOSED").optional(),
    ownerId: Joi.string().length(24).hex().optional(), // Assuming ObjectId length is 24 characters
    sort: Joi.string().valid("NEWEST", "OLDEST", "HIGHEST_PRIORITY", "LOWEST_PRIORITY", "NEAREST_DATE", "DISTANT_DATE").optional(),
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
  })
  const { error } = schema.validate(req.body, { abortEarly: false })
  if (error) {
    return res.status(400).json({ statusCode: statusCodes.PARAM_ERROR, message: error.message })
  }
  next()
}

module.exports = validate
