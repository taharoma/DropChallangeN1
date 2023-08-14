const http = require("http")
const app = require("./app") // Assuming app.js is in the same directory as server.js

const port = process.env.PORT

const server = http.createServer(app)

server.listen(port, (err) => {
  if (err) {
    console.log(err)
  } else {
    console.log(`Server connected on port: ${port}`)
  }
})
