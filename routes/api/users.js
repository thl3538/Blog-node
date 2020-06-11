const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const keys = require("../../config/key");


//引入User
const User = require("../../models/Users");



router.get("/test",(req,res) => {
    res.json({msg: "work"})
})

// $router post api/users/register 请求的接口名称
// @desc 返回请求的json数据
// @access public 公开的接口
router.post("/register",(req,res) => {
    //查询数据库中是否含有该数据名
    User.findOne({name: req.body.name})
        .then(user => {
            if(user){
                res.json("该用户名已被注册")
            }else{
                const newUser = new User({
                    name: req.body.name,
                    password: req.body.password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
    
                        newUser.password = hash;
                        newUser.save()
                                .then(user => res.json(user))
                                .catch(err => console.log(err));
                    });
                });
            }
        })
})

// $router post api/users/login 请求的接口名称
// @desc 返回token jwt passport
// @access public 公开的接口
router.post("/login",(req,res) => {
    const name = req.body.name;
    const password = req.body.password;
    //查询数据库是否含有该用户名
    User.findOne({name})
        .then(user => {
            if(!user){
                return res.status(404).json("用户不存在")
            }

            bcrypt.compare(password,user.password)
                .then(isMatch => {
                    if(isMatch){
                        const rule = {id: user.id,name: user.name} 
                         // jwt.sign("规则","加密的文字","过期的时间","箭头函数")
                        jwt.sign(rule,keys.secretOrKey,{expiresIn:3600},(err,token) => {
                            if(err) throw err;
                            res.json({
                                success: true,
                                token: "Bearer " + token
                            })
                        })
                    }else{
                        return res.status(400).json("密码错误!");
                    }
                    })
        })
})

module.exports = router;