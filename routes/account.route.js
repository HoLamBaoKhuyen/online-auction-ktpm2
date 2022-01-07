import express from "express";
import bcrypt from "bcryptjs";
import Recaptcha from "express-recaptcha";
import userModel from "../models/user.model.js";
import watchlistModel from "../models/watchlist.model.js";
import productModel from "../models/product.model.js";
import auth from "../middlewares/auth.mdw.js";
import moment from "moment";
const router = express.Router();
var recaptcha = new Recaptcha.RecaptchaV2(
  "6LeOKdsdAAAAAO1tRxxSCIoufTKvDLRmuC8Cq7BL",
  "6LeOKdsdAAAAACIZLMh8Osrrj5cJmsNDnC-TpsT1"
);

router.get("/login", function (req, res) {
  res.render("Authentication/login", { layout: "authentication" });
});
router.get("/signup", function (req, res) {
  res.render("Authentication/signup_edit", { layout: "authentication" });
});
router.post("/signup", recaptcha.middleware.verify, async function (req, res) {
  if (!req.recaptcha.error) {
    // success code
    const rawPassword = req.body.psword;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(rawPassword, salt);
    const user = {
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      psword: hash,
      dob: req.body.dob,
      hotline: req.body.hotline,
      address: req.body.address,
      userType: "bidder",
    };
    console.log(user);
    await userModel.add(user);
    res.redirect('/account/login');
    //res.render("Authentication/login", { layout: "authentication" });
  } else {
    // error code
    res.render("Authentication/signup", {
      layout: "authentication",
      err_message: "You forgot to check reCaptcha box",
    });
  }
});
router.post("/login", recaptcha.middleware.verify, async function (req, res) {
  if (!req.recaptcha.error) {
    const user = await userModel.findByEmail(req.body.email);
    console.log(user);
    if (user === null) {
      res.render("Authentication/login", {
        layout: "authentication",
        err_message: "Invalid email or password.",
      });
      return;
    }
    const ret = bcrypt.compareSync(req.body.psword, user.psword);
    if (ret === false) {
      res.render("Authentication/login", {
        layout: "authentication",
        err_message: "Invalid email or password.",
      });
      return;
    }

    req.session.auth = true;
    req.session.authUser = user;

    const url = "/";
    res.redirect(url);
  } else {
    res.render("Authentication/login", {
      layout: "authentication",
      err_message: "You forgot to check reCaptcha box",
    });
  }
});
router.post("/logout", recaptcha.middleware.verify, async function (req, res) {
  req.session.auth = false;
  req.session.authUser = null;
  const url = req.headers.referer || "/";
  res.redirect(url);
});
router.get("/is-available", async function (req, res) {
  const user = await userModel.findByEmail(req.query.email);
  if (user === null) {
    return res.json(true);
  }
  res.json(false);
});
router.get("/forgetpassword", function (req, res) {
  res.render("Authentication/forgetpassword", { layout: "authentication" });
});
router.get("/updatepassword", function (req, res) {
  res.render("Authentication/updatepassword", { layout: "authentication" });
});

router.get('/upgrade', auth, async function(req,res){
  const top5Price = await productModel.getTop5HighestPrice();
  const top5End = await productModel.getTop5End();
  const top5Bid = await productModel.getTop5HighestBids();

  let newlist1 = productModel.getTimeRemain(top5Price);
  let newlist2 = productModel.getTimeRemain(top5End);
  let newlist3 = productModel.getTimeRemain(top5Bid);

  if (req.session.authUser) {
    if (newlist3) {
      for (let i = 0; i < newlist3.length; i++) {
        let proID = newlist3[i].prodID;
        let wlist = await watchlistModel.findByUidProID(
          req.session.authUser.uID,
          proID
        );
        if (wlist !== null) {
          newlist3[i].inWatchlist = 1;
        }
      }
    }
    if (newlist1) {
      for (let i = 0; i < newlist1.length; i++) {
        let proID = newlist1[i].prodID;
        let wlist = await watchlistModel.findByUidProID(
          req.session.authUser.uID,
          proID
        );
        if (wlist !== null) {
          newlist1[i].inWatchlist = 1;
        }
      }
    }
    if (newlist2) {
      for (let i = 0; i < newlist2.length; i++) {
        let proID = newlist2[i].prodID;
        let wlist = await watchlistModel.findByUidProID(
          req.session.authUser.uID,
          proID
        );
        if (wlist !== null) {
          newlist2[i].inWatchlist = 1;
        }
      }
    }
  }
  res.render("home",{
    top5Price: newlist1,
  top5End: newlist2,
  top5Bid: newlist3,
  });
});
router.post('/upgrade', auth, async function(req,res){
  const ret = bcrypt.compareSync(req.body.confirm, req.session.authUser.psword);

  const top5Price = await productModel.getTop5HighestPrice();
  const top5End = await productModel.getTop5End();
  const top5Bid = await productModel.getTop5HighestBids();

  let newlist1 = productModel.getTimeRemain(top5Price);
  let newlist2 = productModel.getTimeRemain(top5End);
  let newlist3 = productModel.getTimeRemain(top5Bid);

  if (req.session.authUser) {
    if (newlist3) {
      for (let i = 0; i < newlist3.length; i++) {
        let proID = newlist3[i].prodID;
        let wlist = await watchlistModel.findByUidProID(
          req.session.authUser.uID,
          proID
        );
        if (wlist !== null) {
          newlist3[i].inWatchlist = 1;
        }
      }
    }
    if (newlist1) {
      for (let i = 0; i < newlist1.length; i++) {
        let proID = newlist1[i].prodID;
        let wlist = await watchlistModel.findByUidProID(
          req.session.authUser.uID,
          proID
        );
        if (wlist !== null) {
          newlist1[i].inWatchlist = 1;
        }
      }
    }
    if (newlist2) {
      for (let i = 0; i < newlist2.length; i++) {
        let proID = newlist2[i].prodID;
        let wlist = await watchlistModel.findByUidProID(
          req.session.authUser.uID,
          proID
        );
        if (wlist !== null) {
          newlist2[i].inWatchlist = 1;
        }
      }
    }
  }
  if (ret=== true){
    const request ={
      bidID:req.session.authUser.uID,
      reqTime:moment().format("YYYY-MM-DD hh:mm:ss"),
    }
    await userModel.requestUpgrade(request);
    res.render("home",{
      mes:"Xin nâng cấp thành công",
      top5Price: newlist1,
    top5End: newlist2,
    top5Bid: newlist3,
    });
  }
  else{
    res.render("home",{
      warn:"Xin nâng cấp thất bại",
      top5Price: newlist1,
    top5End: newlist2,
    top5Bid: newlist3,
    });
  }
});
export default router;
