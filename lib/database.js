const { invalidParameterError, randomString, getTimestamp } = require('./utils')
const authCodeModel = require('../model/AuthCode')
const tokenModel = require('../model/AccessToken')
exports.getAppInfo = (id) => {
    return Promise.resolve({
        id: id,
        name: 'Node.js实战',
        description: '专注Node.js实战二十年',
        secret: 'xffcncgmveu6slxg',
        redirectUri: 'http://localhost:3000/example/auth/callback'
    })
}

exports.verifyAppRedirectUri = async (clientId, url) => {
    const info = await exports.getAppInfo(clientId)
    url = url.replace(/\'/g, '')
    if (info.redirectUri !== url) {
        return Promise.reject(invalidParameterError('client_id'))
    }
    else {
        return Promise.resolve({
            verified: true
        })
    }
}

exports.generateAuthCode = async (userId, appKey, redirectUri) => {
    const code = randomString(20)
    const newCode = new authCodeModel({
        code,
        userId,
        clientId: appKey
    })
    await newCode.save()
    return Promise.resolve(code)
}

exports.verifyCode = async (code, clientId, appSecret, redirectUri) => {
    const authCode = await authCodeModel.findOne({
        code
    }).exec()
    if (!authCode) {
        return Promise.reject(invalidParameterError('code'))
    }
    if (authCode.clientId !== clientId) {
        return Promise.reject(invalidParameterError('code'))
    }
    const info = await exports.getAppInfo(clientId)
    if (info.secret !== appSecret) {
        return Promise.reject(invalidParameterError('appSecret'))
    }
    if (info.redirectUri.replace(/\'/g, '') !== redirectUri) {
        return Promise.reject(invalidParameterError('redirectUri'))
    }
    return Promise.resolve({
        Success: true,
        userId: authCode.userId
    })
}

exports.generateAccessToken = async (userId, clientId, expires) => {
    const code = randomString(20)
    expires = getTimestamp() + expires
    const token = new tokenModel({
        code,
        userId,
        expires,
        clientId
    })
    await token.save()
    return Promise.resolve(code)
}

exports.deleteCode = async (code) => {
    await authCodeModel.remove({
        code
    })
    return Promise.resolve({
        Success: true
    })
}

exports.getAccessToken = async (token) => {
    const tokenInfo = await tokenModel.findOne({
        code: token
    }).exec()
    return Promise.resolve(tokenInfo)
}