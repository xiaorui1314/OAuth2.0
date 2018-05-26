const koaRouter = require('koa-router')
const { verifyAccessToken } = require('../middlewares/verify')
const apiClient = require('../api-client')
const apiRouter = new koaRouter()

let client = new apiClient({
    appKey: 'a10086',
    appSecret: 'xffcncgmveu6slxg',
    callbackUrl: 'http://localhost:3000/example/auth/callback'
})
apiRouter.get('/example', async ctx => {
    if (!client._accessToken) {
        return ctx.redirect(client.getRedirectUrl())
    }
    else {
        ctx.body = {
            status: 'OK',
            msg: '授权成功'
        }
    }
})

apiRouter.get('/example/auth/callback', async ctx => {
    const ret = await client.requestAccessToken(ctx.query.code)
    if (ret) {
        console.log(ret)
        ctx.redirect('/example')
    }
})
module.exports = apiRouter