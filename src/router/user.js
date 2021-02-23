const handleBlogRouter = require("./blog")
const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require("../model/resModel")
const { set } = require("../db/redis")

const handleUserRouter = (req, res) => {

    const method = req.method

    if(method === 'POST'&& req.path === '/api/user/login'){
        const username = req.body.username
        const password = req.body.password

        const result = login(username, password)
        return result.then( userData => {
            if(userData.username){
                req.session.username = userData.username
                req.session.realname = userData.realname

                // 同步到redis
                set(req.sessionId, req.session)


                return new SuccessModel('登录成功')
            } else {
                return new ErrorModel('登录失败，请检查用户名或密码')
            }
        })

    }
}

module.exports = handleUserRouter