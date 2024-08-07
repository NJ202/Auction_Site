/* api endpoints for the user module*/

const router = require('express').Router();
//const { error } = require('console');
const User = require('../models/userModel');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require('../middleware/authMiddleware');

//public apis- dont need token
//new user registration,callback is usually async
//register is the endpoint, try catch in asyn block,res-response,req-request
router.post('/register', async (req, res) => {
    try {
        //check if user already exists using email
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            throw new Error('User already exists');
        }

        //hashing password using bcrypt,with 10 rounds
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;

        //save new user
        const newuser = new User(req.body);
        await newuser.save();
        res.send({
            success: true,
            message: 'User created successfully'
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
});

//user login
router.post("/login", async (req, res) => {
    try {
        //check if user exists
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            throw new Error("User not found");
        }
        //compare password, plain and encrypted password
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!validPassword) {
            throw new Error("Invalid password");
        }

        //create an assign token-encryptes user id in form of token sent to frontend as login response
        //first parameter is data to be encrypted and second parameter is the secret key in the .env,third is expiry
        const token = jwt.sign({ userId: user._id }, process.env.jwt_secret,{expiresIn : "1d"});

        res.send({
            success: true,
            message: 'User logged in successfully',
            data: token
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
});

//for protected api's that is apis which require a loggen user we need to use middleware which checks for token validity
//get current user
router.post("/get-current-user", authMiddleware, async (req, res) => {
    try {
        //use the middleware by first calling the authmiddleware
        const user = await User.findById(req.body.userId);
        res.send({
           success : true,
           message : "User fetched successfully",
           data : user,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
});


module.exports = router;
