const SuperModel = require("../models/super_model");
const ItemsModel = require("../models/item_model");

const UserModel = require("../models/user_model");

const ProductModel = require("../models/product_model");

const cryptoRandomString = require("secure-random-string");
let {
  InternalServerError,
  BadRequestError,
  NotFoundError,
} = require("../utils/errors");
const RoomModel = require("../models/room_model");
const HomeModel = require("../models/home_model");

class SuperController {
  async create(req, res, next) {
    try {
      let { fullname, phone } = req.body;
      const password = cryptoRandomString({ length: 8, alphanumeric: true });
      let Super = await SuperModel.create({
        fullname,
        phone,
        login: phone,
        password,
      });

      return res.status(201).json({
        message: "success",
        data: Super,
      });
    } catch (error) {
      console.log(error.message);
      return next(new InternalServerError(500, error.message));
    }
  }

  async update(req, res, next) {
    try {
      let { id } = req.params;
      let { fullname, phone, password } = req.body;
      let value = await SuperModel.updateOne(
        { _id: id },
        {
          fullname,
          phone,
          password,
          login: phone ?? undefined,
        }
      );
      if (value) {
        let Super = await SuperModel.findById(id);
        return res.status(200).json({
          message: "Super is updated",
          data: Super,
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
      let value = await SuperModel.deleteOne({ _id: id });
      if (value.deletedCount > 0) {
        return res.status(200).json({
          message: "Super is deleted",
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
      let users = await UserModel.aggregate([
        {
          $lookup: {
            from: "items",
            as: "items",

            let: {
              userId: "$_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: [
                      {
                        $toObjectId: "$user_id",
                      },
                      "$$userId",
                    ],
                  },
                },
              },
            ],
          },
        },
      ]);

      let products = await ProductModel.aggregate([
        {
          $lookup: {
            from: "items",
            as: "items",

            let: {
              pId: "$_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: [
                      {
                        $toObjectId: "$product_id",
                      },
                      "$$pId",
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
         "users": users,
        "products": products,
        "homes":homes

        },
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
  async all(req, res, next) {
    try {
      let all = await SuperModel.find({});
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
      let Super = await SuperModel.findById(id);
      if (Super) {
        return res.status(200).json({
          message: "success",
          data: Super,
        });
      }
      return next(new BadRequestError(400, "Not found"));
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
}

module.exports = new SuperController();
