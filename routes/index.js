var express = require('express')
var router = express.Router()
// var app = express()
var User = require('../models/users')

// router.get('/login', function (req, res) {
//   res.render('login')
// })
// router.get('/register', function (req, res) {
//   res.render('register')
// })

// 这里的业务逻辑将写在 两个post 路由里 
// router.post('/login', function (req, res) {
//   console.log('req',req)
//   console.log('res',res)
// })
// router.post('/register', function (req, res) {

// })
router.post('/login', function (req, res) {
  // console.log('params',req.params)
  // console.log('body',req.body)

  var postData = {
      username: req.body.username,
      password: req.body.password
  }
  console.log('user',User)
  User.findOne({
      username: postData.username,
      password: postData.password
  }, function (err, data) {
    console.log('data11',data)
      if(err) throw err
      if(data){
        console.log('res',res)
        res.json({
          'code': 0,
          'msg': '登录成功'
        })
      }else{
        res.json({
          'code': 1,
          'msg': '账号或密码错误'
        })
      }
  } )
})
router.post('/register', function (req, res) {
  // 获取用户提交的信息
  var postData = {
      username: req.body.username,
      password: req.body.password,
      age: req.body.age,
      address: req.body.address
  }
  // 查询是否被注册
  User.findOne({username: postData.username}, function (err, data) {
      if (data) {
        res.json({
          'code': 1,
          'msg': '用户名已被注册'
        })
      } else {
          // 保存到数据库
          User.create(postData, function (err, data) {
              if (err) throw err
              res.json({
                'code': 0,
                'msg': '注册成功'
              })
              res.redirect('/userList')      // 重定向到所用用户列表
          })
      }
  })
})

// 获取所有用户列表
router.get('/userList', function (req, res) {
  var userList = User.find({}, function (err, data) {
      if (err) throw  err
      res.send(data)
  })
})


module.exports = router

