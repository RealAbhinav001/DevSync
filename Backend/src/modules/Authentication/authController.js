const express = require("express");
const userModel = require("./authModels.js")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const config = require("../../config/config.js");
const cookie = require("cookie-parser")

const signupController =async (req,res)=>{
   try{
     const {name,email,password} = req.body;
    const isAlreadyRegister = await userModel.findOne({
        $or:[
            {email}
        ]
    })

    if(isAlreadyRegister){
        return res.status(400).json({
            message:"User already exits"
        })
    }

    const hashedPassword = await bcrypt.hash(password,10);
    const user = await userModel.create({
        name,
        email,
        password:hashedPassword
    })

    const accessToken = jwt.sign({
        id:user.id
    },config.SECRET_KEY,{
        expiresIn:"15m"
    })

    const refreshToken = jwt.sign({
        id:user.id
    },config.SECRET_KEY,{
        expiresIn:"7d"
    })

    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        secure:config.SECURE,
        sameSite:config.SAMESITE,
        maxAge:7*24*60*60*1000
    })

    user.password = undefined

    res.status(201).json({
        message:"user successfull created",
        user,
        accessToken
    })
   }
   catch(error){
    res.status(500).json({
        message:error.message
    })
   }
    
}

const loginController = async (req,res)=>{
    const {email,password} = req.body
    try{
        const user = await userModel.findOne({
            $or:[
                {email}
            ]
        })
        if(!user){
            return res.status(400).json({
                message:"User Not Found"
            })
        }
        const pass = await bcrypt.compare(password,user.password)

        if(!pass){
            return res.status(400).json({
                message:"Check your credentials"
            })
        }

        const accessToken = jwt.sign({
            id:user.id
        },config.SECRET_KEY,{
            expiresIn:"15m"
        })

        const refreshToken = jwt.sign({
            id:user.id
        },config.SECRET_KEY,{
            expiresIn:"7d"
        })

        res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        secure:config.SECURE,
        sameSite:config.SAMESITE,
        maxAge:7*24*60*60*1000
        })

        user.password = undefined;

        res.status(200).json({
            message:"User Found",
            user,
            accessToken
        })
    }
    catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}

const getmeController = async (req,res)=>{
    try{
        const user = await userModel.findById(
            req.user.id
        )

        if(!user){
           return res.status(400).json({
                message:"User not found"
            })
        }
        
        user.password = undefined

        res.status(200).json({
            message:"User successfully found",
            user
        })
    }
    catch(error){
        res.status(500).json({
            message:error.message
        })
    }

}

const logoutController = (req,res)=>{
    try{
        res.clearCookie("refreshToken",{
            httpOnly:true,
            secure:config.SECURE,
            sameSite:config.SAMESITE
        })

        res.status(200).json({
            message:"User successfull Logout"
        })
    }
    catch(error){
        res.status(500).json({
            message:"Some problem occur"
        })
    }
}

const refreshController = (req,res)=>{
    try{
        const refreshToken = req.cookies.refreshToken
        if(!refreshToken){
            return res.status(401).json({
                message:"Invalid"
            })
        }

        const decoded = jwt.verify(refreshToken,config.SECRET_KEY)

        const accessToken = jwt.sign({
            id:decoded.id
        },config.SECRET_KEY,{
            expiresIn:"15m"
        })

        res.status(200).json({
            message:"Access Token Created",
            accessToken
        })
    }
    catch(error){
        res.status(401).json({
            message:error.message
        })
    }

}

module.exports = {
    signupController,
    loginController,
    getmeController,
    refreshController,
    logoutController
}
