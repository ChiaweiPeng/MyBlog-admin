const { exec,escape } = require('../db/mysql')
const { genPassword } = require('../utils/cryp')

const login = (username, password) => {

    // 用escape防止sql注入，用了escape请在下面拼接时把单引号去掉
    username = escape(username)

    // 密码加密
    password = genPassword(password)

    password = escape(password)

    let sql = `select username,realname from users where username=${username} and password=${password}`

    return exec(sql).then( rows => {
        return rows[0] || {}
    })
}

module.exports = {
    login
}