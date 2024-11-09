const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cloudinary = require('../utils/cloudinary')
const fs = require('fs')

exports.Register = async (req , res)=>{
    try {
        const {userName, email, password}=req.body
        if(!userName || !email || !password){
            return res.status(400).json({
                message: 'please input the missing field'
            })
        }
        const existingUser = await userModel.findOne({email: email.toLowerCase().trim()})
        if(existingUser){
            return res.status(400).json({
                message: 'user already exist please log in'
            })
        }
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        const file = req.file;
    if (!file) {
      return res.status(400).json({
        message: "School image is required",
      });
    }
    const image = await cloudinary.uploader.upload(req.file.path);
    const data = new userModel({
        userName,
        email: email.toLowerCase().trim(),
        password: hash,
        profile: image.secure_url
    })

    fs.unlink(file.path, (err) => {
        if (err) {
          console.error("Error deleting the file from local storage:", err);
        } else {
          console.log("File deleted from local storage");
        }
      });
      const userToken = jwt.sign(
        { id: data._id, email: data.email },
        process.env.JWT_SECRET,
        { expiresIn: "30 mins" }
      );
      await data.save()
      res.status(200).json({
        message: 'registration is complete',
        data
      })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

exports.Login = async(req, res)=>{
    try {
        const{email, password}=req.body
        const existingUser = await userModel.findOne({ email: email.toLowerCase().trim()})
        if(!existingUser){
            return res.status(404).json({
                message: 'user does not exist please register'
            })
        }
        const checkPassword = await bcrypt.compare(password, existingUser.password)
        if(!checkPassword){
            return res.status(400).json({
                message: 'inccorect password'
            })
        }
        const userToken = jwt.sign(
            {
                id: existingUser._id,
                email:existingUser.email,
                name: existingUser.userName
            },
            process.env.JWT_SECRET,
            {expiresIn: '24H'}
        )
        return res.status(200).json({
            message: `${existingUser.userName} is logged in`
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

