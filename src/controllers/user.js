const UserModel = require("../models/user_model");
const ProductModel = require("../models/product_model");
const HomeModel = require("../models/home_model");


const cryptoRandomString = require("secure-random-string");
let {
  InternalServerError,
  BadRequestError,
  NotFoundError,
} = require("../utils/errors");

class UserController {
  async create(req, res, next) {
    try {
      let { fullname, phone } = req.body;
      const password = cryptoRandomString({
        length: 8,
        type: "distinguishable",
      });
      let User = await UserModel.create({
        fullname,
        phone,
        login: phone,
        password,
      });

      return res.status(201).json({
        message: "success",
        data: User,
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }

  async update(req, res, next) {
    try {
      let { id } = req.params;
      let { fullname, phone, password } = req.body;
      let value = await UserModel.updateOne(
        { _id: id },
        {
          fullname,
          phone,
          password,
          login: phone ?? undefined,
        }
      );
      if (value) {
        let User = await UserModel.findById(id);
        return res.status(200).json({
          message: "User is updated",
          data: User,
        });
      } else {
        return next(new BadRequestError(400, "Not found"));
      }
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }

  async delete(req, res, next) {
    try {
      let { id } = req.params;
      let value = await UserModel.deleteOne({ _id: id });
      if (value.deletedCount > 0) {
        return res.status(200).json({
          message: "User is deleted",
          data: {
            _id: id,
          },
        });
      } else {
        return next(new NotFoundError(404, "Not found"));
      }
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
  async profile(req, res, next) {
    try {
      let products = await ProductModel.aggregate([
        {
          $lookup: {
            from: "items",
            as: "items",

            let: {
              pId: "$_id",
              userId: req.user.id,
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: [
                          {
                            $toObjectId: "$product_id",
                          },
                          "$$pId",
                        ],
                      },
                      {
                        $eq: [
                          "$user_id",
                          "$$userId",
                        ],
                      }
                    ],
                  },
                },
              },
            ],
          },
        },
      ]);


      let homes = await HomeModel.aggregate([
        {
          $lookup: {
            from: "rooms",
            as: "items",

            let: {
              homeId: "$_id",
              userId: req.user.id,
            },
            pipeline: [
              {
                $match: {
                  $expr: {


                    
                    $eq: [
                      {
                        $toObjectId: "$home_id",
                      },
                      "$$homeId",
                    ],
                  },
                },
              },
            ],
          },
        },
      ]);
      return res.status(200).json({
        message: "success",
        data: {
          products: products,
          homes :homes
        },
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
  async all(req, res, next) {
    try {
      let all = await UserModel.find({});
      return res.status(200).json({
        message: "success",
        data: all,
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
  async get(req, res, next) {
    try {
      let { id } = req.params;
      let User = await UserModel.findById(id);
      if (User) {
        return res.status(200).json({
          message: "success",
          data: User,
        });
      }
      return next(new BadRequestError(400, "Not found"));
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
}

module.exports = new UserController();
