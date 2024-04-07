const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/userModel')
const { error } = require('console')
// @desc Register a new user
// @route /api/users
// @access Public
const registerUser = asyncHandler(async(req, res)=>{
    // console.log(req.body);
    const{name,email,password} = req.body

    if(!name || !email || !password){
        // return res.status(400).json({message: 'Please include all fields'})
        res.status(400)
        throw new Error('Please include all fields')
    }

    // Find if user already exixst
    const userExists = await User.findOne({email})

    if(userExists){
        res.status(400)
        throw new Error('User already Exists')
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)

    // Create User

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        isAdmin: false
    })

    if (user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email:user.email,
            token: generateToken(user._id)
        })
    }else{
        res.status(400)
        throw new error('invalid user data')
    }

    
    // res.send('Register Route')
})

// @desc Login a new user
// @route /api/users/login
// @access Public
const loginUser = asyncHandler(async(req, res)=>{
    const {email, password} = req.body

    const user = await User.findOne({email})

    // Check if passwords match
    if(user && (await bcrypt.compare(password,user.password))){
        res.status(200).json({
            name: user.name,
            email:user.email,
            token: generateToken(user._id)

        })
    }else{
        res.status(401)
        throw new Error('Invalid Credentials')
    }
    res.send('Register Route')
})

// @desc Get current user
// @route /api/users/me
// @access Private
const getMe = asyncHandler(async(req, res)=>{

    // res.send('Me')
    const user ={
        id: req.user._id,
        email: req.user.email,
        name: req.user.name
    }
    res.status(200).json(user)
})

// Generate token
const generateToken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn:'30d'
    })
}

module.exports = {
    registerUser,
    loginUser,
    getMe
}