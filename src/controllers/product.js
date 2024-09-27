const ProductModel = require("../models/product_model");
const cryptoRandomString = require("secure-random-string");
let {
  InternalServerError,
  BadRequestError,
  NotFoundError,
} = require("../utils/errors");

class ProductController {
  async create(req, res, next) {
    try {
      let { name, filename, category_id,  desc } = req.body;

      let Product = await ProductModel.create({
        name,
        category_id,
       
        desc,
        image: filename ? "/static/product/" + filename : undefined,
      });

      return res.status(201).json({
        message: "success",
        data: Product,
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }

  async update(req, res, next) {
    try {
      let { id } = req.params;
      let { name, filename, category_id, price, count, desc } = req.body;
      let value = await ProductModel.updateOne(
        { _id: id },
        {
          name,
          category_id,
          price,
          count,
          desc,
          image: filename ? "/static/product/" + filename : undefined,
        }
      );
      if (value) {
        let Product = await ProductModel.findById(id);
        return res.status(200).json({
          message: "Product is updated",
          data: Product,
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
      let value = await ProductModel.deleteOne({ _id: id });
      if (value.deletedCount > 0) {
        return res.status(200).json({
          message: "Product is deleted",
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
      let all = await ProductModel.find({});
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
      let Product = await ProductModel.findById(id);
      if (Product) {
        return res.status(200).json({
          message: "success",
          data: Product,
        });
      }
      return next(new BadRequestError(400, "Not found"));
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
  async getbyCategoryId(req, res, next) {
    try {
      let { category_id } = req.query;
      let Product = await ProductModel.find({
        category_id,
      });
      if (Product) {
        return res.status(200).json({
          message: "success",
          data: Product,
        });
      }
      return next(new BadRequestError(400, "Not found"));
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
}

module.exports = new ProductController();
