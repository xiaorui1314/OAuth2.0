exports.handleSuccess = async function (ctx, next) {
    ctx.apiSuccess = (data) => {
        return {
            status: 'OK',
            result: data
        }
    }
    await next()
}

exports.handleError = async function (ctx, next) {
    ctx.apiFailed = (err) => {
        return {
            status: 'Error',
            error_code: err.error_code,
            err_msg: err.err_msg
        }
    }
    await next()
}