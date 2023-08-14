class ResponseHandler {
  constructor (res, httpCode, statusCode, result) {
    this.res = res
    this.httpCode = httpCode
    this.statusCode = statusCode
    this.result = result
  }

  send ({ res, httpCode, statusCode, result = {} }) {
    res.status(httpCode).json({ CODE: statusCode, result })
  }
}
module.exports = new ResponseHandler()
