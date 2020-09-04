const express = require ("express");
const userRouter = express.Router();
const gravatar = require ("gravatar")
const bcrypt = require ("bcryptjs")
const jwt = require("jsonwebtoken")
const basicAuth = require("../middleware/auth")
const UserModel = require("./userSchema");


// const {check, validationResult} = require("express-validator/")

// @route post api/users
// @desc Register user
// @access public
userRouter.post("/register", async(req,res, next)=> {
    
    const {name,email,password} = req.body;
    try{
          // see if user exists
       let user = await UserModel.findOne({email});
       if(user){
           res.status(400).json({msg:"user already exists"})
       }else{

            // get users gravatar
        const avatar = gravatar.url(email, {
            s: '200',
            r:'pg',
            d: 'mm'
        })

        user = new UserModel({
            name,
            email,
            avatar,
            password
        });

         // Encrypt password before saving user in to th database

        const salt = await bcrypt.genSalt(10);
        user.password= await bcrypt.hash(password,salt);
        await user.save();

         // Return jsonwebtoken
         const payload ={
             user:{
                 id:user.id
             }
         }
         jwt.sign(payload,process.env.jwt_Secret, {expiresIn:360000} ,(err,token)=>{
             if(err){
                 throw err
             }else{
                res.json({token})
            }
         })

       };


    }catch(error){
        next(error)
    }
})

userRouter.get("/me", basicAuth, async(req,res,next)=>{
    try{
        const user = await UserModel.findById(req.user.id).select ('-password')
        if(user){
        res.json(user);

        }else{
            const error = new Error("user not found")
            error.httpStatusCode =404
            next(error)

        }

    }catch(error){
        next(error)
    }

})

// login user
userRouter.post("/login", async(req,res, next)=> {
    
    const {email,password} = req.body;
    try{
          // see if user exists
       let user = await UserModel.findOne({email});
       if(!user){
           res.status(400).json({errors:[{msg:"invalid credentials"}]})
       }else{

         const isMatch = await bcrypt.compare(password,user.password)
         if(!isMatch){
            res.status(400).json({errors:[{msg:"invalid credentials"}]})

         }

         // Return jsonwebtoken
         const payload ={
             user:{
                 id:user.id
             }
         }
         jwt.sign(payload,process.env.jwt_Secret, {expiresIn:360000} ,(err,token)=>{
             if(err){
                 throw err
             }else{
                res.json({token})
            }
         })

       };


    }catch(error){
        next(error)
    }
})

// Get loggedin user
userRouter.get("/", basicAuth, async(req,res,next)=>{
    try{
        const user = await UsersModel.findById(req.user.id).select ('-password')
        if(user){
        res.json(user);

        }else{
            const error = new Error("user not found")
            error.httpStatusCode =404
            next(error)

        }

    }catch(error){
        next(error)
    }

})



module.exports =  userRouter