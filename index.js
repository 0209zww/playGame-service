const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const router = require('./api/router')
const JWT = require('./api/JWT')
const login = require("./api/login")
const info = require("./api/info")
const redis = require('redis')
const session = require("express-session");
// parse application/x-www-form-urlencoded
//配置模板引擎body-parser一定要在app.use(router)挂载路由之前
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
// 全局 中间件  解决所有路由的 跨域问题
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type')
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT')
  res.header('Access-Control-Allow-Credentials', true);
  res.header("Content-Type", "application/json;charset=utf-8");
  next()
})

app.use(session({
  secret: "WickYo",	// 对cookie进行签名
  name: "session",	// cookie名称，默认为connect.sid
  resave: false,	// 强制将会话保存回会话容器
  rolling: true,	// 强制在每个response上设置会话标识符cookie
  resave: false, //添加 resave 选项
  saveUninitialized: true,//添加 saveUninitialized 选项
  cookie: {
    // 5分钟
    maxAge: 300000
  }
}))

app.use(login)
app.use((req, res, next) => {


  let token = req.get('Authorization')
  if (token) {
    const result = JWT.verifyToken(token.split(' ')[1])
    if (result) {
      next()
    } else {
      res.status(401).send({ code: 401, msg: '登录信息已失效，请重新登录' })
    }
  } else {
    res.send({ code: 500, msg: '未携带token' })
  }

})
app.use(router)
app.use(info)
app.listen(3033, function () {
  console.log("中间服务已启动！监听端口3033")
})
