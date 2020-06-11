const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//创建一个视图
const BlogSchema = new Schema({
    userId:{ 
        type: Schema.Types.ObjectId,
        required: false
    },
    name: {
        type: String,
        required: false
    } ,
    title: {
        type: String,
        required: true
    },
    blog: {
        type: String,
        require: true
    },
    author: {
        type: String
    },
    like: {
        type: Number,
        default: 0
    },
    unlike: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    },
    comment: [
        {
            name: {
                type: String
            },
            content: {
                type:String
            },
            time: {
                type: String,
                default: Date.now + ''
            }
        }
    ]
})

module.exports = Blog = mongoose.model("blogs",BlogSchema);//生成model类