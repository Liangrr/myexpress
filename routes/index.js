const express = require('express')
const router = express.Router()
// var app = express()
const User = require('../models/users')
const Article = require('../models/article')
const Token = require('../token/token.js')

router.post('/login', (req, res) => {
  console.log('req111',req.header.Authorization)
  // 要生成token的主题信息
  let postData = {
    username: req.body.username,
    password: req.body.password
  }
  const token = Token.createToken(postData,3600)
  User.findOne({
    username: postData.username,
    password: postData.password
  }, (err,data) => {
    if (err) throw err
    if (data) {
      res.json({
        'code': 200,
        'msg': '登录成功',
        'user': { 'username': data.username },
        'token': token
      })
    } else {
      res.json({
        'code': 500,
        'msg': '账号或密码错误'
      })
    }
  })
})
router.post('/register', (req, res) => {
  // 获取用户提交的信息
  const postData = {
    username: req.body.username,
    password: req.body.password,
    age: req.body.age,
    address: req.body.address,
    phone: req.body.phone
  }
  // 查询是否被注册
  User.findOne({ username: postData.username }, (err,data) => {
    if (err) throw err
    if (data) {
      res.json({
        'code': 500,
        'msg': '用户名已被注册'
      })
    } else {
      // 保存到数据库
      User.create(postData, (err,data) => {
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

router.post('/forget', (req, res) => {
  // 获取用户提交的信息
  const postData = {
    username: req.body.username,
    password: req.body.password
  }
  // 修改密码
  User.updateOne({ username: postData.username }, { $set: { 'password': postData.password } }, (err,data) => {
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

//查询所有文章
router.post('/article', (req, res) => {
  if (req.body.type === 'all') {
    Article.find({}, (err,data) => {
      if (err) throw err
      res.send(data)
    })
  }else if (req.body.type === 'show') {
    Article.findOne({ _id: req.body.id }, (err,data) => {
      if (err) throw err
      res.json({
        'code': 200,
        data: data
      })
    })
  }else if (req.body.type === 'write') {
    // 查询文章是否存在
    Article.findOne({ title: req.body.title }, (err,data) => {
      if (err) throw err
      if (data) {
        Article.updateOne({ title: req.body.title }, { $set: { 'content': req.body.content } }, (err,data) => {
          if (err) throw err
          if (data) {
            res.json({
              'code': 200,
              'msg': '修改成功',
              'data': data
            })
          }
        })
      } else {
        // 保存到数据库
        Article.create({ title: req.body.title, content: req.body.content, username: req.body.username }, (err,data) => {
          if (err) throw err
          res.json({
            'code': 200,
            'msg': '发布成功'
          })
        })
      }
    })
  }
})

// 获取所有用户列表
router.get('/userList', (req, res) => {
  var userList = User.find({}, (err,data) => {
    if (err) throw err
    res.send(data)
  })
})

module.exports = router