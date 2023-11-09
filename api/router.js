//创建路由
const { Router } = require('express')
const router = new Router()
// const axios = require("axios")
const mysql = require('../mysql')



router.get('/api', (req, res) => {
    console.log(req.body);
    let sql = 'SELECT * FROM user'
    mysql.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            res.send(result)
        }
    })

});



module.exports = router
