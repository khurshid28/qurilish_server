
const superModel = require("../models/super_model");
const userModel = require("../models/user_model");
const jwt = require("../utils/jwt.js");

let { InternalServerError, BadRequestError, AuthorizationError } = require("../utils/errors");
class LoginController {
  async login(req, res, next) {
    try {
      let { login, password } = req.body;
      
      let user = await superModel.findOne({login,password})
     
      console.log( ">>"+user);

      if(!user) {
        user = await userModel.findOne({login,password})
       }

     if(!user) {
      return next(new AuthorizationError(401, "Invalid login credentials"));
     }

      const token = jwt.sign({
        id: user._id,
        agent: req.headers["user-agent"],
        role: user.role,
      });


      if (user) {
        return res.status(200).json({
            message: "success",
            data: user,
            token
          });
      }
      return next(new AuthorizationError(403, "Invalid login credentials"));
      
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
}

module.exports = new LoginController();
