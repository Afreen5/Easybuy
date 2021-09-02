const express= require("express")
const app=express()
const cors=require("cors")
app.use(cors())
app.use("/pics",express.static("pics"))

const mongoose=require("mongoose")
mongoose.connect("mongodb://localhost:27017/user",
{useUnifiedTopology:true, useNewUrlParser:true})
.then(()=>{console.log("db connected")})
.catch(err=>{console.log(err)})

// app.use('/',express.static('/nodeserver'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
const userController=require("./controller/user")
app.use("/user",userController)
app.listen("3000",()=>console.log("server running on  port 3000"))