const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')


const protect = asyncHandler(async(req,res,next)=>{
    let token

    // console.log("eee");
    // console.log(req.headers.authorization);
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1]
            // console.log(token);
            // console.log("wwe");
            // verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // GEt user from token

            req.user = await User.findById(decoded.id).select('-password')

            next()
        } catch (error) {
            // console.log(error);
            res.status(401)
            throw new Error('Not Authorised')
        }
    }

    if(!token){
        // console.log("object");
        res.status(401)
        throw new Error('Not Authorised')
    }
})

module.exports ={protect}