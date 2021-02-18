// 创建 HTTP 服务， 设置端口
const http = require('http')

const port = 3000
const serverHandle = require('../app')

const server = http.createServer(serverHandle)

server.listen(port)
console.log('server is running on port 3000')