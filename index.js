const express=require("express");
const dotenv=require('dotenv');
dotenv.config();
const connection = require('./config/db');
const userRouter=require('./routes/user.routes');
const blogRouter=require('./routes/blog.routes')
const app=express();
console.log(process.env.JWT);
app.use(express.json());
const cors = require('cors');
const corsOptions ={
    origin:'*', 
    credentials:true,       
}
app.use(cors(corsOptions));
app.use(userRouter,blogRouter);
app.get("/",(req,res)=>{
    res.send({msg:"Welcome to Blogs api"})
})

const port = process.env.PORT || 8080;
app.listen(port,async()=>{
    try{
        await connection
        console.log("connected to Database")
    }catch(err) {
        console.log(err);
    }
    console.log(`server is running on ${port}`);
})
