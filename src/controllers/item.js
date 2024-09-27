const ItemModel = require("../models/item_model");
const { ObjectId } = require('mongodb');

const cryptoRandomString = require("secure-random-string");
let {
  InternalServerError,
  BadRequestError,
  NotFoundError,
} = require("../utils/errors");

class ItemController {
  async create(req, res, next) {
    try {
      console.log(req.body);
      let { product_id, price, count, from ,type } = req.body;

      let Item = await ItemModel.create({
        product_id,
        price,
        count,
        from,
        type,
        user_id: req.user.id,
      });

      return res.status(201).json({
        message: "success",
        data: Item,
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }

  async update(req, res, next) {
    try {
      let { id } = req.params;
      let { name, product_id, price, count, from,type } = req.body;
      let value = await ItemModel.updateOne(
        { _id: id },
        {
          product_id,
          price,
          count,
          from,
          type,
        }
      );
      if (value) {
        let Item = await ItemModel.findById(id);
        return res.status(200).json({
          message: "Item is updated",
          data: Item,
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
      let value = await ItemModel.deleteOne({ _id: id });
      if (value.deletedCount > 0) {
        return res.status(200).json({
          message: "Item is deleted",
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

      let { user_id,product_id } = req.query;


      let all ;


      if(!user_id && !product_id){
           all = await ItemModel.aggregate([
            { $addFields: { product_id: { $toObjectId: "$product_id" } } },
            { $addFields: { user_id: { $toObjectId: "$user_id" } } },
            {
              $lookup: {
                from: "products",
                localField: "product_id",
                foreignField: "_id",
                as: "product_detail",
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "user_id",
                foreignField: "_id",
                as: "user_detail",
              },
            },
          ]);
      }else if(user_id && product_id){
        all = await ItemModel.aggregate([
          {
            $match: {
              "user_id": user_id,
              "product_id": product_id,
            }
          },
            { $addFields: { product_id: { $toObjectId: "$product_id" } } },
            { $addFields: { user_id: { $toObjectId: "$user_id" } } },
            {
              $lookup: {
                from: "products",
                localField: "product_id",
                foreignField: "_id",
                as: "product_detail",
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "user_id",
                foreignField: "_id",
                as: "user_detail",
              },
            },
          ]);
      }
      
      
      else if(user_id){
       all = await ItemModel.aggregate([
        {
          $match: {
            "user_id": user_id,
          }
        },
          { $addFields: { product_id: { $toObjectId: "$product_id" } } },
          { $addFields: { user_id: { $toObjectId: "$user_id" } } },
          {
            $lookup: {
              from: "products",
              localField: "product_id",
              foreignField: "_id",
              as: "product_detail",
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "user_id",
              foreignField: "_id",
              as: "user_detail",
            },
          },
        ]);
      }
      else if(product_id){
        all = await ItemModel.aggregate([
         {
           $match: {
            // "user_id": user_id,
            "product_id": product_id,

           }
         },
          //  { $addFields: { product_id: { $toObjectId: "$product_id" } } },
           { $addFields: { user_id: { $toObjectId: "$user_id" } } },
          //  {
          //    $lookup: {
          //      from: "products",
          //      localField: "product_id",
          //      foreignField: "_id",
          //      as: "product_detail",
          //    },
          //  },
           {
             $lookup: {
               from: "users",
               localField: "user_id",
               foreignField: "_id",
               as: "user_detail",
             },
           },
         ]);
       }
     
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
      let Item = await ItemModel.findById(id);
      if (Item) {
        return res.status(200).json({
          message: "success",
          data: Item,
        });
      }
      return next(new BadRequestError(400, "Not found"));
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
  async getbyProductId(req, res, next) {
    try {
      let { product_id } = req.query;
      let Item = await ItemModel.find({
        product_id,
      });
      if (Item) {
        return res.status(200).json({
          message: "success",
          data: Item,
        });
      }
      return next(new BadRequestError(400, "Not found"));
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
}

module.exports = new ItemController();
