const { getList,
    getDetail,
    newBlog,
    updateBlog,
    deleteBlog
} = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')

const handleBlogRouter = (req, res) => {

    const method = req.method

    // 获取博客列表
    if (method === 'GET' && req.path === '/api/blog/list') {
        const keyword = req.query.keyword || ''
        const type = req.query.type || ''

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
        const result = newBlog(req.body)
        return result.then( data => {
            return new SuccessModel(data)
        })
    }

    // 更新博客
    if (method === 'POST' && req.path === '/api/blog/update') {
        const id  = req.query.id || ''

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