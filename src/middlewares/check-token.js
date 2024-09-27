const jwt = require("../utils/jwt.js");
const User = require("../models/user_model");
const Super = require("../models/super_model");


const {
  AuthorizationError,
  ForbiddenError,
  InternalServerError,
  InvalidTokenError,
} = require("../utils/errors.js");

const { TokenExpiredError, JsonWebTokenError } = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    let token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return next(new AuthorizationError(401, "No token provided"));
    }

    const { id, agent, role } = jwt.verify(token);
    console.log(jwt.verify(token))
    let user;
    if (role == "User") {
      
      user = await User.findOne({
        _id:id,
        work_status:"working"
      });
     
    } else if (role == "Super") {
      user = await Super.findOne({
        _id:id,
        // work_status:"working"
      });
    }
  
    if (!user) {
      return next(new AuthorizationError(401, "Invalid token"));
    }

    req.user = user ;

    
    return next();
  } catch (error) {
    console.log("check token >>");
    console.log(error);
    if (error instanceof TokenExpiredError) {
      return next(new AuthorizationError(403, "Token has expired"));
    } else if (error instanceof JsonWebTokenError) {
      return next(new InvalidTokenError(401, "Malformed token"));
    }

    return next(new InternalServerError(500, error));
  }
};
