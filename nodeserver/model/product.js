const mongoose=require("mongoose")
let productSchema=mongoose.Schema(
    {
        name:String,
        myfile:String
    }
)
module.exports=mongoose.model("product",productSchema)