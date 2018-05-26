const url = require('url')

exports.createError = (code, msg) => {
    let err = new Error(msg)
    err.error_code = code
    err.error_msg = msg
    return err
}
exports.randomString = (size, chars) => {
    size = size || 8
    chars = chars || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let charsLength = chars.length + 1
    let newPass = ''
    while (size > 0) {
        newPass += chars.charAt(Math.floor(Math.random() * charsLength))
        size--
    }
    return newPass
}
exports.addParamsToUrl = (redirectUrl, param) => {
    const info = url.parse(redirectUrl, true)
    for (let k in param) {
        info.query[k] = param[k]
    }
    delete info.search
    return url.format(info)
}

exports.missingParameterError = (name) => {
    return exports.createError('MiSSING_PARAMETER', `缺少参数${name}`)
}
exports.redirectUriNotMatchError = (url) => {
    return exports.createError('REDIRECT_URI_NOT_MATCH', `回调地址不正确:${url}`)
}
exports.invalidParameterError = function (name) {
    return exports.createError('INVALID_PARAMETER', '参数`' + name + '`不正确');
}

exports.getTimestamp = () => {
    return parseInt(Date.now() / 1000, 10)
}