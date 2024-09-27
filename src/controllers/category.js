const CategoryModel = require("../models/category_model");
const cryptoRandomString = require("secure-random-string");
let { InternalServerError, BadRequestError, NotFoundError } = require("../utils/errors");

class CategoryController {
  async create(req, res, next) {
    try {
      let { name,filename } = req.body;
      console.log(req.body);
    
      let Category = await CategoryModel.create({
        name,
        image: filename ? "/static/category/" + filename : undefined,
      });

      return res.status(201).json({
        message: "success",
        data: Category,
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }

  async update(req, res, next) {
    try {
      let { id } = req.params;
      let { name,filename } = req.body;
      let value = await CategoryModel.updateOne({ _id: id },{
        name,
       
        image: filename ? "/static/category/" + filename : undefined,
      });
      if (value) {
        let Category = await CategoryModel.findById(id);
        return res.status(200).json({
          message: "Category is updated",
          data: Category
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
      let value =await CategoryModel.deleteOne({_id:id})
     if (value.deletedCount > 0) {
        return res.status(200).json({
            message: "Category is deleted",
            data :{
              _id :id
            }
           
          });
     }else{
        return next(new NotFoundError(404, "Not found"));
     }
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }

  async all(req, res, next) {
    try {
     
      let all = await CategoryModel.find({})
      return res.status(200).json({
        message: "success",
        data:all
       
      });
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
  async get(req, res, next) {
    try {
      let {id} =req.params;
      let Category = await CategoryModel.findById(id)
      if (Category) {
        return res.status(200).json({
            message: "success",
            data:Category
           
          });
      }
      return next(new BadRequestError(400, "Not found"));
     
    } catch (error) {
      console.log(error);
      return next(new InternalServerError(500, error.message));
    }
  }
  
  
}

module.exports = new CategoryController();
