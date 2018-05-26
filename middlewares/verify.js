const { missingParameterError, invalidParameterError, getTimestamp } = require('../lib/utils')
const { getAccessToken } = require('../lib/database')

exports.verifyAccessToken = async (ctx, next) => {
    const token = ctx.request.body.access_token || ctx.query.access_token
    const source = ctx.request.body.source || ctx.query.source
    if (!token) {
        return await next(missingParameterError('token'))
    }
    if (!source) {
        return await next(missingParameterError('source'))
    }
    const tokenInfo = await getAccessToken(token)
    if (getTimestamp() > tokenInfo.expires)
        if (source !== tokenInfo.clientId) {
            return await next(invalidParameterError('source'))
        }
    ctx.accessTokenInfo = tokenInfo
    await next()
}