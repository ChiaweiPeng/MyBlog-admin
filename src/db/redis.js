const redis = require('redis')
const { REDIS_CONF } = require('../conf/db')

const redisClient = redis.createClient( REDIS_CONF.port, REDIS_CONF.host)
redisClient.on('error', err => {
    console.error(err)
})

function set(key, val) {
    if(typeof val === 'object') {
        // 传入.set的必须是一个字符串
        val = JSON.stringify(val)
    }

    redisClient.set( key, val ,redis.print)
}

function get (key) {
    const promise = new Promise ( (resolve, reject) => {
        redisClient.get( key , (err, val) => {
            if(err){
                reject(err)
                return 
            }
            // 如果所取的值是Null，直接返回null
            if(val == null) {
                resolve(null)
                return 
            }
            // 尝试将字符串变成JSON对象，不成功就直接返回
            try{
                resolve(
                    JSON.parse(val)
                )
            } catch (ex) {
                resolve(val)
            }
        })
    })

    return promise
}


module.exports = {
    set,
    get
}