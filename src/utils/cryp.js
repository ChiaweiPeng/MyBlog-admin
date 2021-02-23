//实现密码加密，后期不提交
const crypto = require('crypto')

// 密钥
const SECRET_KEY = 'Pchiawei_429'

// 实现md5加密
function md5(content){
    let md5 = crypto.createHash('md5')
    return md5.update(content).digest('hex')
}

// 加密函数
function genPassword (password) {
    const str = `password=${password}&key${SECRET_KEY}`
    return md5(str)
}


module.exports = {
    genPassword
}