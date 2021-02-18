const { resolve } = require('path')
const querystring = require('querystring')
const { set, get } = require('./src/db/redis')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')

// 变量存储session
// const SESSION_DATA =  {}

// 设置cookie过期时间
const setCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (24*60*60*1000))
    return d.toGMTString() //GMTString 为cookie的时间格式
}

// 处理postData
const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve({})
            return
        }
        if (req.headers['content-type'] !== 'application/json') {
            resolve({})
            return
        }

        let postData = ''
        req.on('data', chunk => {
            postData += chunk.toString()
        })

        req.on('end', () => {
            if (!postData) {
                resolve({})
                return
            }
            resolve(
                JSON.parse(postData)
            )
        })
    })
    return promise
}

const serverHandle = (req, res) => {
    // 设置返回格式为 json
    res.setHeader('Content-type', 'application/json')

    // 设置 path 和 query
    const url = req.url
    req.path = url.split('?')[0]
    req.query = querystring.parse(url.split('?')[1])

    // 解析cookie
    req.cookie = {}
    // 解析cookie字符串，格式为 k1=v1;k2=v2
    const cookieStr = req.headers.cookie || ''
    cookieStr.split(';').forEach( item => {
        if(!item){
            return 
        }
        const arr = item.split('=')
        const key = arr[0].trim()
        const val = arr[1].trim()
        req.cookie[key] = val
    })

    // 解析session
    // let needSetCookie = false
    // let userId = req.cookie.userid
    // if(userId){
    //     if(!SESSION_DATA[userId]){
    //         SESSION_DATA[userId] = {}
    //     }
    // } else {
    //     needSetCookie = true
    //     userId = `${Date.now()}_${Math.random()}`
    //     SESSION_DATA[userId] = {}
    // }
    // req.session = SESSION_DATA[userId]
    // console.log(req.session)

    // 解析session(使用redis)
    let needSetCookie = false
    let userId = req.cookie.userid
    if(!userId) {
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        // 如果不存在，初始化redis中的session
        set(userId, {})
    }
    // 获取session
    req.sessionId = userId
    get(req.sessionId).then( sessionData => {
        if(sessionData == null) {
            // 初始化redis中的session值
            set(req.sessionId, {})
            // 设置 session
            req.session = {}
        } else {
            // 设置 session
            req.session = sessionData
        }

        console.log('req.session: ', req.session)

        // 在处理路由之前先获取postdata,同是promise可以直接接上
        return getPostData(req)
    })
    .then(postData => {
        // 处理路由之前先取到postData
        req.body = postData

        // 处理blog 路由,handle函数返回的是promise对象
        const blogResult = handleBlogRouter(req, res)
        if (blogResult) {
            blogResult.then(blogData => {

                if(needSetCookie){
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${setCookieExpires()}`)
                }

                res.end(
                    JSON.stringify(blogData)
                )
            })
            return
        }


        // 处理 user 路由
        const userResult = handleUserRouter(req, res)
        if (userResult) {
            userResult.then(userData => {

                if(needSetCookie){
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${setCookieExpires()}`)
                }

                res.end(
                    JSON.stringify(userData)
                )
            })
            return
        }

        // 未命中路由，处理 404 错误
        res.writeHead(404, { 'Content-type': 'text/plain' })
        res.write('404 NOT FOUND')
        res.end()
    })
}

module.exports = serverHandle