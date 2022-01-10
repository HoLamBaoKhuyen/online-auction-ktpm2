import express from "express";
import profileModel from "../models/profile.model.js";
import productModel from "../models/product.model.js";
import auth from "../middlewares/auth.mdw.js";
import watchlistModel from "../models/watchlist.model.js";
import sellerProductModel from "../models/seller-product.model.js";
import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.get("/", auth, async function (req, res) {
  const id = res.locals.authUser.uID;
  const infor = await profileModel.getInforByID(id);
  console.log(infor);
  res.render("account/profile", {
    information: infor[0],
    isCorrectPwd: true,
  });
});

router.post("/", async function (req, res) {
  const uID = req.body.uID;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const dob = req.body.dob;
  const hotline = req.body.hotline;
  const address = req.body.address;
  const userType = req.body.userType;

  let user = await userModel.findByID(uID);
  const ret = bcrypt.compareSync(req.body.psword, user.psword);
  if (ret === false) {
    const id = res.locals.authUser.uID;
    const infor = await profileModel.getInforByID(id);

    res.render("account/profile", {
      information: infor[0],
      warn: "Mật khẩu không đúng",
    });

    return;
  }

  await userModel.editUser(
    uID,
    firstName,
    lastName,
    dob,
    hotline,
    address,
    userType
  );
  // console.log(user);
  user = await userModel.findByID(uID);
  req.session.authUser = user;
  res.render("account/profile", {
    information: user,
    mes: "Cập nhật thông tin thành công",
  });
});

router.get("/comment/:prodID", auth, async function (req, res) {
  //const userID = req.params.uID || 0;
  const userID = res.locals.authUser.uID;
  const prodID = req.params.prodID || 0;

  const list = await productModel.findByProdID(prodID);
  const check = await profileModel.checkExistRating(userID, prodID);

  res.render("account/product-comment", {
    product: list[0],
    userID,
    existRate: check,
  });
});

router.post("/comment/:prodID", async function (req, res) {
  //const userID = req.params.uID || 0;
  const userID = res.locals.authUser.uID;
  const prodID = req.params.prodID || 0;
  const content = req.body.commentwinprod;
  const type = req.body.commentType;
  const idSeller = await profileModel.getIDseller(prodID);
  console.log(userID + " " + prodID + " " + content + " " + idSeller);

  if (content == "") {
    const list = await productModel.findByProdID(prodID);
    const check = await profileModel.checkExistRating(userID, prodID);

    res.render("account/product-comment", {
      product: list[0],
      userID,
      existRate: check,
      error_message: "Vui lòng nhập vào ô đánh giá",
    });
  } else {
    if (type == "goodcmt") {
      profileModel.bidderAddGoodRate(userID, idSeller, prodID, content);
    } else {
      profileModel.bidderAddBadRate(userID, idSeller, prodID, content);
    }

    res.redirect("/profile");
  }
});

router.get("/profile-comment/:id", auth, async function (req, res) {
  const id = req.params.id || 0;
  //const id = res.locals.authUser.uID;

  const information = await profileModel.getInforByID(id);
  const comment = await profileModel.getComment(id);
  const likeRate = await profileModel.getLikeOfBidder(id);
  const dislikeRate = await profileModel.getDislikeOfBidder(id);

  let point = 0;
  console.log(likeRate+" "+dislikeRate);
  if (likeRate != 0 || dislikeRate != 0)
    point = ((likeRate / (likeRate + dislikeRate)) * 100);
  console.log("Điểm: " + point);

  res.render("account/profile-comment", {
    comment,
    likeRate,
    dislikeRate,
    point,
    infor: information[0],
  });
});

router.get("/profile-comment/seller/:id", auth, async function (req, res) {
  const id = req.params.id || 0;
  //const id = res.locals.authUser.uID;

  const information = await profileModel.getInforByID(id);
  const comment = await profileModel.getCommentToSeller(id);
  const likeRate = await profileModel.getLikeOfSeller(id);
  const dislikeRate = await profileModel.getDislikeOfSeller(id);

  res.render("account/profile-comment", {
    comment,
    likeRate,
    dislikeRate,
    infor: information[0],
  });
});

router.post("/deleteFavo/:delID", async function (req, res) {
  const delID = req.params.delID;
  profileModel.deleteFavoriteProd(res.locals.authUser.uID, delID);
  res.redirect("/profile");
});

export default router;
