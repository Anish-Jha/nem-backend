const mongoose = require('mongoose');
const blogSchema=mongoose.Schema(
    {
        title: String,
        content: String,
        category:String,
        date:String,
        likes:Number,
        comments: [{ username: String, content: String }],
        userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },{
  versionKey:false
  }
);

const Blog = mongoose.model('Blog', blogSchema);

module.exports=Blog;

