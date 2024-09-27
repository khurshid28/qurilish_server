const HomeModel = require("../models/home_model");
const RoomModel = require("../models/room_model");

const cryptoRandomString = require("secure-random-string");
let {
  InternalServerError,
  BadRequestError,
  NotFoundError,
} = require("../utils/errors");

class HomeController {
  async create(req, res, next) {
    try {
      let { address, filename, etajCount } = req.body;
      console.log(req.body);

      let Home = await HomeModel.create({
        address,
        etajCount,
        image: filename ? "/static/home/" + filename : undefined,
      });

      return res.status(201).json({
        message: "success",
        data: Home,
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }

  async update(req, res, next) {
    try {
      let { id } = req.params;
      let { address, filename, etajCount } = req.body;
      let value = await HomeModel.updateOne(
        { _id: id },
        {
          address,
          etajCount,

          image: filename ? "/static/home/" + filename : undefined,
        }
      );

      let rooms = await RoomModel.findOne(
        { home_id: id },
      
      );


      if (value) {
        let Home = await HomeModel.findById(id);
        Home.rooms = rooms

        return res.status(200).json({
          message: "Home is updated",
          data:Home
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
      let value = await HomeModel.deleteOne({ _id: id });
      if (value.deletedCount > 0) {
        return res.status(200).json({
          message: "Home is deleted",
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

  async all(req, res, next) {
    try {
      let all =await HomeModel.aggregate([
        { $addFields: { _id: { $toObjectId: "$_id" } } },

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
            as: "rooms",
          },
        },
      ]);;

      

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
      let Home = await HomeModel.findById(id);
      if (Home) {
        return res.status(200).json({
          message: "success",
          data: Home,
        });
      }
      return next(new BadRequestError(400, "Not found"));
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
}

module.exports = new HomeController();
