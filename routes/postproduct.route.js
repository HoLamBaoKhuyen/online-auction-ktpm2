import express from "express";
import moment from "moment";
import productModel from "../models/product.model.js";
import userModel from "../models/user.model.js";
import prodDesModel from "../models/productdes.model.js";
import auth from "../middlewares/auth.mdw.js";
import fs from "fs-extra";
import multer from "multer";

const router = express.Router();

//------------------------------------ Post-----------------------------------------------

router.get("/postProduct", function (req, res) {
  if (
    typeof req.session.auth === "undefined" ||
    req.session.auth === false ||
    req.session.authUser.userType !== "seller"
  ) {
    res.redirect("/");
    return;
  }
  res.render("seller/postProduct");
});

router.post("/postProduct", auth, async function (req, res) {
  var count = 0;
  const filepath = "./public/images/temp/";
  fs.mkdir(filepath, function (err) {
    if (err) {
      console.error(err);
      fs.remove(filepath);
      res.render("seller/postProduct", {
        err_mes: "Đã xảy ra lỗi. Mời thử lại sau",
      });
      return;
    } else {
      const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, filepath);
        },
        filename: function (req, file, cb) {
          if (count === 0) {
            cb(null, "main.jpg");
            console.log(file.mimetype);
            count++;
          } else {
            cb(null, "thumb" + count + ".jpg");
            count++;
          }
        },
      });
      const upload = multer({ storage });
      upload.array("fileUpload", 4)(req, res, async function (err) {
        if (req.files.length < 3) {
          fs.remove(filepath);
          res.render("seller/postProduct", {
            err_mes: "Số file upload phải từ 3 trở lên",
          });
          return;
        }
        const timeEnd = moment(req.body.date + " " + req.body.time).format(
          "YYYY-MM-DD hh:mm:ss"
        );
        const timePosted = moment().format("YYYY-MM-DD hh:mm:ss");
        //const user = await userModel.findByEmail(req.session.authUser.email);
        console.log(req.body);
        const product = {
          prodName: req.body.prodName,
          prodType: req.body.prodType,
          originalPrice: req.body.curPrice,
          curPrice: req.body.curPrice,
          buyNowPrice: req.body.buyNowPrice,
          step: req.body.step,
          timeEnd: timeEnd,
          timePosted: timePosted,
          selID: req.session.authUser.uID,
          approve: req.body.approve,
        };
        // console.log(product);
        try {
          await productModel.addProduct(product);
        } catch {
          fs.remove(filepath);
          res.render("seller/postProduct", {
            err_mes: "Đã xảy ra lỗi. Mời thử lại sau",
          });
          return;
        }
        const prod = await productModel.searchForDes(
          req.session.authUser.uID,
          req.body.prodName
        );
        if (typeof prod !== "undefined" || prod !== null) {
          const productdes = {
            prodID: prod.prodID,
            des: req.body.des,
            modifyTime: timePosted,
          };

          try {
            await prodDesModel.add(productdes);
          } catch {
            await productModel.removeProduct(prod.prodID);
            fs.remove(filepath);
            res.render("seller/postProduct", {
              err_mes: "Đã xảy ra lỗi. Mời thử lại sau",
            });
            return;
          }
          const newname = "./public/images/" + prod.prodID;
          fs.rename("./public/images/temp", newname, async function (err) {
            if (err) {
              await productModel.removeProduct(prod.prodID);
              fs.remove(filepath);
              res.render("seller/postProduct", {
                err_mes: "Đã xảy ra lỗi. Mời thử lại sau",
              });
              return;
            } else {
              const detail = "/detail/" + prod.prodID;
              const url = detail || "/";
              res.redirect(url);
            }
          });
        }
      });
    }
  });
});
export default router;
