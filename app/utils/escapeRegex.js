const escape = text => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

module.exports = text => {
  return new RegExp(escape(text), 'gi')
}
