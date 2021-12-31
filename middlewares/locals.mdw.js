//import productModel from "../models/product.model.js"
import categoryModel from "../models/category.model.js"
import userModel from "../models/user.model.js";
export default function(app){
    app.use(async function (req, res, next) {
        res.locals.lv1Categories = await categoryModel.findAllLevel1();
        res.locals.lv2Categories = await categoryModel.findAllLevel2();
        res.locals.authUser = await userModel.findByID(1012314);
        next();
      });
}