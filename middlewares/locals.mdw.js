import productModel from "../models/product.model.js";
import categoryModel from "../models/category.model.js";
export default function (app) {
  app.use(async function (req, res, next) {
    res.locals.lv1Categories = await categoryModel.findAllLevel1();
    res.locals.lv2Categories = await categoryModel.findAllLevel2();

    next();
  });
  app.use(function (req, res, next) {
    if (typeof (req.session.auth) === 'undefined') {
      req.session.auth = false;
      res.locals.auth = false;
      res.locals.authUser = null;
    }
    res.locals.auth = req.session.auth;
    res.locals.authUser = req.session.authUser;
    next();
  });
}
