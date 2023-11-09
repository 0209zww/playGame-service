const mysql = require("mysql")
const Dbs = {
    host: 'localhost',
    user: 'root',
    password: '408220535',
    database: 'game'
}
const connection = mysql.createConnection(Dbs)

connection.connect((err)=>{
    if(err) throw err
    console.log('链接成功');
})
// //查询
// connection.query(`sql`, (err, rows, fields) => {
//     if (err) throw err
//     console.log(rows)
// })
//
//
// connection.end()
module.exports = connection

