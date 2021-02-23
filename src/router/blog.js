const { getList,
    getDetail,
    newBlog,
    updateBlog,
    deleteBlog
} = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')

// 登录验证
const loginCheck = (req) => {
    if(!req.session.username){
        return Promise.resolve(
            new ErrorModel('尚未登录，请先登录')
        )
    }
}

const handleBlogRouter = (req, res) => {

    const method = req.method

    // 获取博客列表
    if (method === 'GET' && req.path === '/api/blog/list') {
        const keyword = req.query.keyword || ''
        const type = req.query.type || ''

        if(req.query.isadmin){
            // 要进入管理员界面
            const loginCheckResult = loginCheck(req)
            // 有值则是还没登录，返回未登录提醒
            if(loginCheckResult){
                return loginCheckResult
            }
        }

        const result =  getList(keyword, type)
        return result.then( listData => {
            return new SuccessModel(listData)
        })
    }

    // 获取博客详情
    if (method === 'GET' && req.path === '/api/blog/detail') {
        const id = req.query.id || ''

        const result = getDetail(id)
        return result.then( data => {
            return new SuccessModel(data)
        })
    }

    // 新建博客
    if (method === 'POST' && req.path === '/api/blog/new') {
        // 登录判断
        const loginCheckResult = loginCheck(req)
        if(loginCheckResult){
            return loginCheckResult
        }

        const result = newBlog(req.body)
        return result.then( data => {
            return new SuccessModel(data)
        })
    }

    // 更新博客
    if (method === 'POST' && req.path === '/api/blog/update') {
        const id  = req.query.id || ''

         // 登录判断，防止有人直接通过postman改我的博客
         const loginCheckResult = loginCheck(req)
         if(loginCheckResult){
             return loginCheckResult
         }

        const result = updateBlog(id, req.body)
        return result.then( data => {
            if(data){
                return new SuccessModel('博客更新成功')
            } else {
                return new ErrorModel('博客更新失败')
            }

        })
    }

    // 删除博客
    if (method === 'POST' && req.path === '/api/blog/delete') {
        const id = req.query.id || ''

        // 登录判断，防止有人直接通过postman删我的博客
        const loginCheckResult = loginCheck(req)
        if(loginCheckResult){
            return loginCheckResult
        }

        const result = deleteBlog(id)
        return result.then( data => {
            if(data){
                return new SuccessModel('博客删除成功')
            } else {
                return new ErrorModel('博客删除失败')
            }
        })
    }

}

module.exports = handleBlogRouter