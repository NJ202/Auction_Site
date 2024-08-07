//middleware is logic that is executed before executing the endpoint logic
//resusable logic for every protected endpoint

//next is all the logic in the try block for protected api endpoints in userroutes

const jwt = require("jsonwebtoken");
//jwt is gotten in req headers, so u need to decrypt it to get user id
module.exports = (req, res, next) => {
    try {
        //get token- from axios we have bearer index [0] and local storage index [1]
        const token = req.header("authorization").split(" ")[1];
        //decrypt
        const decryptedToken = jwt.verify(token, process.env.jwt_secret);
        //attach user to req body
        req.body.userId = decryptedToken.userId;
        next();

    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });

    }
};

