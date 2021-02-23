const { exec,escape } = require('../db/mysql')

const login = (username, password) => {

    // 用escape防止sql注入，用了escape请在下面拼接时把单引号去掉
    username = escape(username)

    password = escape(password)

    let sql = `select username,realname from users where username=${username} and password=${password}`

    console.log(sql)

    return exec(sql).then( rows => {
        return rows[0] || {}
    })
}

module.exports = {
    login
}