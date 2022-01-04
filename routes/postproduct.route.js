import express from "express";
import moment from "moment";
import productModel from "../models/product.model.js";
import userModel from "../models/user.model.js";
import prodDesModel from "../models/productdes.model.js";

import fs from 'fs-extra'
import multer  from'multer';

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

  
  router.post("/postProduct",async function (req, res) {
    var count=0;
    const filepath=  './public/images/temp/';
    fs.mkdir(filepath,function(err){
        if (err){
            console.error(err);
        }
        else{
            const storage = multer.diskStorage({
                destination: function (req, file, cb) {
                  cb(null,filepath);
                },
                filename: function (req, file, cb) {
                    if (count===0){
                        cb(null, 'main.jpg');
                        count++;
                    }
                    else{
                        cb(null,'thumb'+count+'.jpg');
                        count++;
                    }
                 
                }
              });
              const upload = multer({storage});
                upload.array('fileUpload',4)(req,res, async function(err){
                    const timeEnd = moment(req.body.date + " " + req.body.time).format("YYYY-MM-DD hh:mm:ss");
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
                      approve: 0
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
                if(err){
                    console.error(err);
                }
                else{
                    const newname= './public/images/'+ prod.prodID;
                    fs.rename('./public/images/temp',newname,function(err){
                            if (err){
                                console.error(err);
                            }
                            else{
                                const detail = '/detail/'+ prod.prodID;
                                const url = detail||'/';
                                res.redirect(url);
                            }
                    });
                }
              });
        }
    });
    
  });
  export default router;