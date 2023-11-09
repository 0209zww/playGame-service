//创建路由
const { Router } = require('express')
const info = new Router()
// const axios = require("axios")
const mysql = require('../mysql')
const JWT =require('./JWT')


info.post('/info', (req, res) => {
    let token = req.get('Authorization')
    const info = JWT.verifyToken(token.split(' ')[1])
    console.log(info, 'userInfo');
    res.send({code:200,message:'获取成功',data:{userInfo:info}})


});
info.put('/set/portrait', (req, res) => {
    let data={data:{}}
    let sql=`UPDATE  user SET  portrait=${req.body.portrait} WHERE Id=${req.body.Id}`
    mysql.query(sql,(err,result)=>{
          if(err){
            data.code = 203

            data.message = '失败'
            res.send(data)
        } else {
            data.code = 200

            data.message = '成功'
            res.send(data)
        }
    })
});
module.exports = info