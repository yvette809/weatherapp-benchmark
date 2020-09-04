const jwt = require("jsonwebtoken")

module.exports = function(req,res,next){
    // get token from the header
    const token = req.header('x-auth-token');
    // check if there is no token
    if(!token){
        return res.status(401).json({msg: 'No token, authorisation denied'})
    }

    //verify token
    try{
         const decoded = jwt.verify(token, process.env.jwt_Secret)

         // set the requested user to the user that is in the decoded token
         req.user = decoded.user;
         next()

    }catch(err){
        res.status(401).json({msg: 'Token is not valid'});
    }
}