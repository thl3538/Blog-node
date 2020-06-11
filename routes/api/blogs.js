const express = require("express");
const router = express.Router();
const passport = require("passport");

//引入Blogs.js
const Blog = require("../../models/Blog");

// $router GET api/blogs/test 请求的接口名称
// @desc 返回请求的json数据
// @access public 公开的接口
router.get("/test",(req,res) => {
    res.json({msg:"login work"})
})

// $router POST api/blogs/add 请求的接口名称
// @desc 返回请求的json数据
// @access public 公开的接口
router.post("/add",passport.authenticate("jwt",{session:false}), (req,res) => {
    const { name } =  req.user ;
    const profileFields = {userId: req.user};
    if(req.body.title) profileFields.title = req.body.title;
    if(req.body.blog) profileFields.blog = req.body.blog;
    profileFields.name = name

    new Blog(profileFields).save().then(profile => {
        res.json(profile);
    })
})

// $router post api/profiles/delete 请求的接口名称
// @desc 删除数据
// @access private 
router.delete("/delete/:id",passport.authenticate("jwt",{session:false}),(req,res) => {
    Blog.findOneAndRemove({_id: req.params.id})
        .then(profile => {
            profile.save().then(res.json(profile))
        })
        .catch(err => res.status(404).json("删除失败"));
})  

// $router Get api/blogs 请求的接口名称
// @desc获取所有数据
// @access private
router.get("/",passport.authenticate("jwt",{session:false}),(req,res) => {
    Blog.find()
        .then(blog => {
            if(!blog){
                return res.status(404).json('没有任何内容');
            }else{
                res.json(blog);
            }
        })
        .catch(err => res.status(404).json(err));
})

// $router Get api/blogs/:id 请求的接口名称
// @desc获取单条数据
// @access private
router.get("/:id",passport.authenticate("jwt",{session:false}),(req,res) => {
    Blog.findOne({_id: req.params.id})
        .then(profile => {
            if(!profile){
                return res.json({status: 404});
            }else{
                res.json(profile);
            }
        })
        .catch(err => res.status(404).json(err));
})

// $router POST api/blogs/:id/like 请求的接口名称
// @desc给单条博客点赞
// @access private
router.post("/:id/like",passport.authenticate("jwt",{session:false}),(req,res) => {
    // console.log(req);
    Blog.updateOne({_id: req.params.id},{$inc:{ like:1 }})
        .then(blog => {
            res.json(blog)
        })
        .catch(err => res.status(404).json(err));
})

// $router POST api/blogs/:id/like 请求的接口名称
// @desc给单条博客点倒赞
// @access private
router.post("/:id/unlike",passport.authenticate("jwt",{session:false}),(req,res) => {
    // console.log(req);
    Blog.updateOne({_id: req.params.id},{$inc:{ unlike: 1 }})
        .then(blog => {
            res.json(blog)
        })
        .catch(err => res.status(404).json(err));
})

// $router POST api/blogs/:id/comment 请求的接口名称
// @desc给单条博客评论
// @access private
router.post("/:id/comment",passport.authenticate("jwt",{session:false}),(req,res) => {
    Blog.update({_id: req.params.id},{$push: {comment: req.body}} )
    .then(blog => {
        if(!blog) return res.json({err: -1,status: 404});
        res.json({err: 0,status:200});
    })
})


// $router POST api/blogs/:id/comment 请求的接口名称
// @desc给单条博客删除评论
// @access private
//body{id =xx}
router.get("/:id/delcomment",passport.authenticate("jwt",{session:false}),(req,res) => {
    Blog.findOneAndUpdate({_id: req.params.id},{$pull:{ comment: {_id: req.query.id}}} )
    .then(profile => {
        profile.save().then(res.json(profile))
    })
    .catch(err => res.status(404).json("删除失败"));
})


module.exports = router;