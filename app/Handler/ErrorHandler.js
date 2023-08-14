class ErrorHandler extends Error {
  constructor({ httpCode, statusCode, result = {}, message }) {
    super("")
    this.httpCode = httpCode
    this.statusCode = statusCode
    this.result = result
    this.message = message
  }
}
module.exports = ErrorHandler
