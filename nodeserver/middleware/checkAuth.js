const jwt=require("jsonwebtoken")

module.exports=(req,res,next)=>{
    let token=req.body.token
    try{
        req.userdata=jwt.verify(token,"SECRET")
        next()
    }
    catch(err){
        console.log(err)
        res.status(400).json({"message":"not found"})
    }
        
}