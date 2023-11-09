//创建路由
const { Router } = require('express')
const login = new Router()
// const axios = require("axios")
const mysql = require('../mysql')
const JWT = require('./JWT')
const uuid = require("node-uuid");
const svgCaptcha = require('svg-captcha')
const cookie = require('cookie-parser');
const { getString, setString } = require('./redis')
login.get('/captcha', async (req, res) => {
    const captcha = svgCaptcha.create({
        inverse: false, // 翻转颜色
        fontSize: 48, // 字体大小
        noise: 2, // 干扰线条数
        width: req.query.width || 150, // 宽度
        height: req.query.height || 50, // 高度
        size: 4, // 验证码长度
        ignoreChars: '0o1i', // 验证码字符中排除 0o1i
        color: true, // 验证码是否有彩色
        background: '#cc9966', // 验证码图片背景颜色
    })
    //保存到cookie,忽略大小写
    res.setHeader('Set-Cookie', `captcha=${(captcha.text).toLowerCase()}`)

    res.type('svg')
    res.send(captcha.data)
})

login.post('/login', async (req, res) => {
    let data = {
        code: '',
        data: {},
        message: ''
    }
    // const { captcha } = req.body
    
    // console.log(captcha, req.headers.cookie.indexOf(captcha.toLowerCase()));

    // if ((req.headers.cookie.indexOf(captcha.toLowerCase())) == -1) {
    //     res.send({ code: 2003, success: "no", message: "验证码错误" })

    // }
    console.log(req.body);
    let sql = `SELECT * FROM user WHERE phone = "${req.body.phone}" AND password = "${req.body.password}"`
    mysql.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            if (!(result.length)) {
                data.code = 203
                data.message = '手机号或密码错误'
                res.send(data)

            } else {
                result[0].password = ''

                let token = JWT.createToken({ ...result[0] }, 60*60)
                data.code = 200
                data.data = { token: token, ...result[0] }
                data.message = '成功'
                res.send(data)
            }

        }
    })

});
login.post('/signin', (req, res) => {
    let data = {
        code: '',
        data: {},
        message: ''
    }
    let id = BigInt(`0x${uuid.v4().replace(/-/g, '')}`).toString().slice(0, 16);
    let sql1 = `select 1 from user where phone = "${req.body.phone}" `
    mysql.query(sql1, (err, result) => {
        if (result.length > 0) {
            data.code = 201
            data.data = {}
            data.message = '账号已注册'
            res.send(data)

        } else {
            let sql = `INSERT INTO user (Id, name, phone, portrait ,password) VALUES (${id}, '${req.body.name}', '${req.body.phone}', '${req.body.portrait}','${req.body.password}');`
            mysql.query(sql, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    data.code = 200
                    data.data = { ...result[0] }
                    data.message = '成功'
                    res.send(data)
                }
            })
        }
    })

})
module.exports = login