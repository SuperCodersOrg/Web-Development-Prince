const bcrypt = require("bcrypt");
const User = require("../Models/user");
const jwt = require("jsonwebtoken");
const signup = async(req,res)=>{

    try{
        const {username,email,password}=req.body;
        const user = await User.findOne({email});
    if(user){
    return res.status(400).json({message:"User already exists"});
     }
      const newUser = new User({username,email,password});
      newUser.password = await bcrypt.hash(password,10);
      await newUser.save();
      res.status(201).json({message:"User created successfully"});
         }
   catch(error){
        res.status(500).json({message:"Internal Server Error"});
    }
}

const login = async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user = await User.findOne({email});
    if(!user){
    return res.status(400).json({message:"User does not exist"});
     }
     const isMatch = await bcrypt.compare(password,user.password);
     if(!isMatch){
        return res.status(400).json({message:"Invalid credentials"});
     }
     const token = jwt.sign({email:user.email,userId:user._id},process.env.JWT_SECRET,{expiresIn:"5h"});
     res.status(200).json({message:"Login successful", token});
    }
    catch(error){
        res.status(500).json({message:"Internal Server Error"});
    }
}
module.exports = { signup, login };