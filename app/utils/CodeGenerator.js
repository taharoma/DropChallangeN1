class CodeGenerator {
  generate = async length => {
    Math.floor(Math.random() * 9 * Math.pow(10, length - 1)) + 10000
  }
}

module.exports = new CodeGenerator()
