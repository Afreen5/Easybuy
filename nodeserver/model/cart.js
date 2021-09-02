const mongoose=require("mongoose")
let cartSchema=mongoose.Schema(
    {
        name:String,
        myfile:String
    }
)
module.exports=mongoose.model("cart",cartSchema)