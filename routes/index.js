var express = require('express')
var router = express.Router()
// var app = express()
var User = require('../models/users')

router.post('/login', function (req, res) {

  var postData = {
    username: req.body.username,
    password: req.body.password
  }
  User.findOne({
    username: postData.username,
    password: postData.password
  }, function (err, data) {
    if (err) throw err
    if (data) {
      console.log('lrrdata', data)
      res.json({
        'code': 200,
        'msg': '登录成功',
        'userName': data.username
      })
    } else {
      res.json({
        'code': 500,
        'msg': '账号或密码错误'
      })
    }
  })
})
router.post('/register', function (req, res) {
  // 获取用户提交的信息
  var postData = {
    username: req.body.username,
    password: req.body.password,
    age: req.body.age,
    address: req.body.address,
    phone: req.body.phone
  }
  // 查询是否被注册
  User.findOne({ username: postData.username }, function (err, data) {
    if (err) throw err
    if (data) {
      res.json({
        'code': 500,
        'msg': '用户名已被注册'
      })
    } else {
      // 保存到数据库
      User.create(postData, function (err, data) {
        if (err) throw err
        res.json({
          'code': 200,
          'msg': '注册成功'
        })
        // res.redirect('/userList')      // 重定向到所用用户列表
      })
    }
  })
})

router.post('/forget', function (req, res) {
  // 获取用户提交的信息
  var postData = {
    username: req.body.username,
    password: req.body.password
  }
  // 修改密码
  User.updateOne({ username: postData.username }, { $set: { 'password': postData.password } }, function (err, data) {
    if (err) throw err
    if (data) {
      res.json({
        'code': 200,
        'msg': '修改成功',
        'data': data
      })
    }
  })
})

// 获取所有用户列表
router.get('/userList', function (req, res) {
  var userList = User.find({}, function (err, data) {
    if (err) throw err
    res.send(data)
  })
})


module.exports = router

