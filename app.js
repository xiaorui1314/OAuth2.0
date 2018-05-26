const koa = require('koa')
const { handleSuccess, handleError } = require('./middlewares/error')
const mongoose = require('mongoose')
const koaBody = require('koa-body')
const oauthRouter = require('./router/OAuth')
const apiRouter = require('./router/api')
mongoose.connect('mongodb://127.0.0.1:27017/auth')
mongoose.connection.on('connected', () => {
    console.log('mongodb Connected')
})
const app = new koa()

app.use(koaBody())
app.use(handleSuccess).use(handleError)

app.use(oauthRouter.routes()).use(oauthRouter.allowedMethods())
app.use(apiRouter.routes()).use(apiRouter.allowedMethods())
app.listen(3000)