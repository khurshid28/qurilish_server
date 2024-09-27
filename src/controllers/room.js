const RoomModel = require("../models/room_model");

let mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const cryptoRandomString = require("secure-random-string");
let {
  InternalServerError,
  BadRequestError,
  NotFoundError,
} = require("../utils/errors");

class RoomController {
  async create(req, res, next) {
    try {
      let {
        etaj,
        price,
        home_id,
        filename,
        volume,
        who,
        who_phone,
        room_number,
      } = req.body;

      let Room = await RoomModel.create({
        etaj,
        price,
        home_id,
        who,
        who_phone,
        room_number,
        volume,
        user_id: req.user.id,
        image: filename ? "/static/room/" + filename : undefined,
      });

      return res.status(201).json({
        message: "success",
        data: Room,
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }

  async update(req, res, next) {
    try {
      let { id } = req.params;
      let { etaj, price, home_id, filename, who, who_phone, room_number } =
        req.body;
      let value = await RoomModel.updateOne(
        { _id: id },
        {
          etaj,
          price,
          home_id,
          who,
          who_phone,
          room_number,
          volume,
          room_number,

          image: filename ? "/static/room/" + filename : undefined,
        }
      );
      if (value) {
        let Room = await RoomModel.findById(id);
        return res.status(200).json({
          message: "Room is updated",
          data: Room,
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
      let value = await RoomModel.deleteOne({ _id: id });
      if (value.deletedCount > 0) {
        return res.status(200).json({
          message: "Room is deleted",
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
      let all = await RoomModel.find({});
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
      let Room = await RoomModel.findById(id);
      if (Room) {
        return res.status(200).json({
          message: "success",
          data: Room,
        });
      }
      return next(new BadRequestError(400, "Not found"));
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
  async getbyHomeId(req, res, next) {
    try {
      let { home_id, etaj } = req.query;
      // let Rooms = await RoomModel.find({
      //   home_id,etaj

      // });

      let Rooms = await RoomModel.aggregate([
        {
          $match: {
            home_id: home_id,

            etaj: Number(etaj),
          },
        },
        {
          $lookup: {
            from: "users",
            as: "user",

            let: {
              userId: "$user_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: [
                      "$_id",

                      {
                        $toObjectId: "$$userId",
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
      ]);
      if (Rooms) {
        return res.status(200).json({
          message: "success",
          data: Rooms,
        });
      }
      return next(new BadRequestError(400, "Not found"));
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
}

module.exports = new RoomController();
