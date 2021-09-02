const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const multer = require("multer");
var verifier = require('email-verify');
var infoCodes = verifier.infoCodes;
const nodemailer=require("nodemailer")


let img = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "pics")
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + "-" + file.originalname)
    }
})
let upload = multer({ storage: img })

let user = require("./../model/user")
let product = require("./../model/product")
// let cart=require("./../model/cart")
let checkAuth = require("./../middleware/checkAuth")


router.post("/signup", (req, res) => {
    //   let email=req.body.email
    user.find({ email: req.body.email }).then(result => {
        if (result.length === 0) {
            verifier.verify(req.body.email, function (err, info) {
               if ((info.success)===true) {
                    console.log("Success (T/F): " + info.success);
                    console.log("Info: " + info.info);
                     let u1 = new user({
                        name: req.body.name,
                        email: req.body.email,
                        contact: req.body.mobile,
                        password: req.body.password,
})
                    u1.save().then(result => {
                        console.log(result)
                        res.json({"result":"User Registered"})
                    })
                        .catch(err => {
                            console.log(err)
                            res.json("error occured")
                        })
                }
                else if(err) 
                {
                    console.log(err)
                    console.log(info.success)
                    console.log("Success (T/F): " + info.success);
                    console.log("Info: " + info.info);
                    res.json("Domian not found")
                }
                else {
                    console.log(info.success)
                    console.log("Success (T/F): " + info.success);
                    console.log("Info: " + info.info);
                    res.json("Invalid email address")
                }
            })
        }
        else {
        res.json("Email already exists,try a new one")
    }
})
     
 })

router.post("/login", (req, res) => {
    // console.log(req.body)
    user.find({ email: req.body.email, password: req.body.password })
        .select("email name isSuperAdmin").then(user => {
            if (user.length > 0) {
                let loginData = user[0]._doc
                // console.log(loginData)
                const token = jwt.sign(loginData, "SECRET")
                //console.log(token)
                //console.log(user[0].email)
                res.json({ "message": "logged in", "token": token,"user": user[0], "email":user[0].email})
            }
            else {
                res.json("Invalid Credentials")
            }
        })
        .catch(err => {
            console.log(err)
            res.json("error occured")
        })
})
router.get("/",checkAuth, (req, res) => {
    user.findById(req.params.user_id)
        .then(result => {
            res.json(result)
        })
        .catch(err => {
            console.log(err)
            res.json("error occured")
        })
})


router.put("/", checkAuth, (req, res) => {
    user.findByIdAndUpdate(req.params.user_id, { $set: req.body })
        .then(result => {
            res.json(result)
        })
        .catch(err => {
            console.log(err)
            res.json("error occured")
        })
})

router.delete("/", checkAuth, (req, res) => {
    user.findByIdAndDelete(req.params.user_id)
        .then(result => {
            res.json("deleted")
        })
        .catch(err => {
            console.log(err)
            res.json("error occured")
        })
})
router.post('/upload', upload.single("image"), (req, res) => {

    if (req.file) {
        let p1 = new product({
            name: req.body.name,
            myfile: req.file.path
        })
        p1.save().then(result => {
            // console.log(result)
            res.json({ 'Message': 'saved' })
        })
            .catch(err => {
                console.log(err)
                res.json("error occured")
            })
    }
    else {
        res.json({ 'message': 'no file present' })
    }
})


router.get('/home', (req, res) => {
    product.find().then(result => {
        res.json(result)
    })
        .catch(err => {
            res.json(err)
        })
})


router.get("/landing",(req,res)=>{
    user.findById().then(result=>{
        console.log(result)
        res.json(result)
    })
    .catch(err=>{
        res.json(err)
        console.log(err)
    })
})

router.post("/profile/:id", (req, res) => {
     console.log(req.params.id);
     user.findById(req.params.id).then(result=>{
        console.log(result)
        res.json(result)
    })
    .catch(err=>{
        res.json(err)
        console.log(err)
    })
   
})


module.exports = router
