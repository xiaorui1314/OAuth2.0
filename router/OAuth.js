const koaRouter = require('koa-router')
const { createError } = require('../lib/utils')
const { missingParameterError, redirectUriNotMatchError, addParamsToUrl } = require('../lib/utils')
const { getAppInfo, verifyAppRedirectUri, generateAuthCode, verifyCode, generateAccessToken, deleteCode } = require('../lib/database')
const authCode = require('../model/AuthCode')
const ejs = require('ejs')
const fs = require('fs')
const path = require('path')

const oauthRouter = new koaRouter()
const EXPIRES_IN = 60 * 10

oauthRouter.use(async (ctx, next) => {
    ctx.loginUserId = 'Sherry'
    await next()
})
oauthRouter.use(async (ctx, next) => {
    // console.log(ctx.request.body)
    console.log(ctx.request.body)
    const client_id = ctx.query.client_id || ctx.request.body.client_id
    const redirect_url = ctx.query.redirect_url || ctx.request.body.redirect_url
    if (!client_id) {
        return await next(missingParameterError('client_id'))
    }
    if (!redirect_url) {
        return await next(missingParameterError('redirect_url'))
    }
    ctx.appInfo = await getAppInfo(client_id)
    const info = await verifyAppRedirectUri(client_id, redirect_url)
    if (!info.verified) {
        return await next(redirectUriNotMatchError(redirect_url))
    }
    await next()
})
oauthRouter.get('/OAuth2/authorize', async ctx => {
    const template = fs.readFileSync(path.resolve(__dirname, '../views/authrize.ejs'), 'utf-8')
    const html = ejs.render(template, {
        appInfo: ctx.appInfo,
        loginUserId: ctx.loginUserId
    })
    ctx.body = html
})

oauthRouter.post('/OAuth2/authorize', async ctx => {
    const client_id = ctx.query.client_id || ctx.request.body.client_id
    const redirect_url = ctx.query.redirect_url || ctx.request.body.redirect_url
    const code = await generateAuthCode(ctx.loginUserId, client_id, redirect_url)
    if (code) {
        ctx.redirect(addParamsToUrl(redirect_url, {
            code
        }))
    }
})

oauthRouter.post('/OAuth2/access_token', async ctx => {
    const { client_id, redirect_url, client_secret, code } = ctx.request.body
    if (!client_id) {
        const error = missingParameterError('client_id')
        ctx.body = ctx.apiFailed(error)
    }
    if (!client_secret) {
        const error = missingParameterError('client_secret')
        ctx.body = ctx.apiFailed(error)
    }
    if (!redirect_url) {
        const error = missingParameterError('redirect_url')
        ctx.body = ctx.apiFailed(error)
    }
    if (!code) {
        const error = missingParameterError('code')
        ctx.body = ctx.apiFailed(error)
    }
    const result = await verifyCode(code, client_id, client_secret, redirect_url)
    console.log(result)
    if (result.Success) {
        const tokenCode = await generateAccessToken(result.userId, client_id, EXPIRES_IN)
        const res = await deleteCode(code)
        if (res.Success) {
            ctx.body = ctx.apiSuccess({
                access_token: tokenCode,
            })
        }
    }
})

module.exports = oauthRouter