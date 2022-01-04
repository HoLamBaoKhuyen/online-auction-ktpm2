import express from "express";
import moment from "moment";
import productModel from "../models/product.model.js";
import userModel from "../models/user.model.js";
import prodDesModel from "../models/productdes.model.js";
const router = express.Router();

//------------------------------------ Post-----------------------------------------------

router.get("/postProduct", function (req, res) {
    if (
      typeof req.session.auth === "undefined" ||
      req.session.auth === false ||
      req.session.authUser.userType !== "seller"
    ) {
      res.redirect("/");
    }
    res.render("ProductView/postProduct");
  });
  router.post("/postProduct", async function (req, res) {
    const timeEnd = moment(req.body.date + " " + req.body.time).format(
      "YYYY-MM-DD hh:mm:ss"
    );
    const timePosted = moment().format("YYYY-MM-DD hh:mm:ss");
    const user = await userModel.findByEmail(req.session.authUser.email);
    const product = {
      prodName: req.body.prodName,
      prodType: req.body.prodType,
      curPrice: req.body.curPrice,
      buyNowPrice: req.body.buyNowPrice,
      step: req.body.step,
      timeEnd: timeEnd,
      timePosted: timePosted,
      selID: user.uID,
    };
    console.log(product);
    await productModel.addProduct(product);
    const prod = await productModel.searchForDes(user.uID, req.body.prodName);
    const productdes = {
      prodID: prod.prodID,
      des: req.body.des,
      modifyTime: timePosted,
    };
    console.log(productdes);
    await prodDesModel.add(productdes);
    res.render("ProductView/postProduct");
  });
  export default router;