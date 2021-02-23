const { exec,escape } = require('../db/mysql')
// 防止xss攻击
const xss = require('xss')

// 获取博客列表
const getList = (keyword, type) => {
    let sql = `select * from blogs where 1=1 `
    if (keyword) {
        sql += `and title like '%${keyword}%' `
    }
    if (type) {
        sql += `and type like '%${type}%' `
    }
    sql += `order by createtime desc;`

    // 返回promise
    return exec(sql)
}

// 获取博客详情
const getDetail = (id) => {
    let sql = `select * from blogs where id=${id}`

    return exec(sql).then(rows => {
        return rows[0]
    })
}

// 新建博客
const newBlog = (blogData = {}) => {
    const title = xss(escape(blogData.title))
    const content = xss(escape(blogData.content))
    const type = xss(escape(blogData.type))
    const sub_title = xss(escape(blogData.sub_title))
    const createtime = Date.now()
    const author = 'Pchiawei'

    let sql = `insert into blogs (title, content, createtime, author, type, sub_title) values `
    if(blogData) {
        sql += `(${title},${content},'${createtime}','${author}',${type},${sub_title})`
    }

    console.log(sql)
    return exec(sql).then(insertData => {
        return {
            id : insertData.insertId
        }
    })
}

// 更新博客
const updateBlog = (id, blogData = {}) => {
    const title = xss(escape(blogData.title))
    const content = xss(escape(blogData.content))
    const type = xss(escape(blogData.type))
    const sub_title = xss(escape(blogData.sub_title))
    const createtime = Date.now()

    let sql = `update blogs set `
    if(title) {
        sql += `title=${title},`
    }
    if(content) {
        sql += `content=${content},`
    }
    if(type) {
        sql += `type=${type},`
    }
    if(sub_title) {
        sql +=`sub_title=${sub_title},`
    }
    sql += `createtime=${createtime} where id=${id}`

    return exec(sql).then( updateData => {
        if(updateData.affectedRows > 0){
            return true
        }
        return false
    })
}

// 删除博客
const deleteBlog = (id) => {
    let sql = `delete from blogs where id=${id}`

    return exec(sql).then(delData => {
        if(delData.affectedRows>0){
            return true
        }
        return false
    })
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    deleteBlog
}