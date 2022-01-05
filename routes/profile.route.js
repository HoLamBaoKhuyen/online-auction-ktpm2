import express from "express";
import profileModel from "../models/profile.model.js";
import productModel from "../models/product.model.js";
import auth from "../middlewares/auth.mdw.js";
import watchlistModel from "../models/watchlist.model.js";
const router = express.Router();

router.get("/", auth, async function (req, res) {
  const limit = 3;
  const page = req.query.page || 1;
  const offset = (page - 1) * limit;
  const [list, total] = await Promise.all([
    watchlistModel.findPageAll(limit, offset,req.session.authUser.uID),
    watchlistModel.countAll(req.session.authUser.uID),
  ]);

  let nPages = Math.floor(total / limit);
  if (total % limit > 0) nPages++;

  const pageNumbers = [];
  for (let i = 1; i <= nPages; i++) {
    pageNumbers.push({
      value: i,
      isCurrent: +page === i,
    });
  }
  let newlist = productModel.getTimeRemain(list);
  const id = res.locals.authUser.uID;
  const infor = await profileModel.getInforByID(id);
  const typeUser = await profileModel.checkUserType(id);
  //const favoriteproducts = await profileModel.getFavoriteProd(id);
  const favoriteproducts = productModel.getTimeRemain(list);
  const participateproducts = await profileModel.getParticipatingProd(id);
  const winproducts = await profileModel.getWinProd(id);

  for (let i = 0; i < participateproducts.length; i++) {
    participateproducts[i].CountBids = await profileModel.countBids(
      participateproducts[i].prodID
    );
  }

  let newlistfavorite = productModel.getTimeRemain(favoriteproducts);
  let newlistparticipate = productModel.getTimeRemain(participateproducts);

  if (typeUser == "seller") {
    // thêm thông tin bên seller
    res.render("account/profile", {
      information: infor[0],
      type: typeUser[0],
      non_empty: list.length !== 0,
      favorite: newlistfavorite,
      participate: newlistparticipate,
      win: winproducts,
      pageNumbers,
        prev_page: +page - 1,
        next_page: +page + 1,
        can_go_next: +page < nPages,
        can_go_prev: +page > 1,
      //thêm thông tin bên seller
    });
  } else {
    res.render("account/profile", {
      information: infor[0],
      type: typeUser[0],
      non_empty: list.length !== 0,
      favorite: newlistfavorite,
      participate: newlistparticipate,
      win: winproducts,
      pageNumbers,
        prev_page: +page - 1,
        next_page: +page + 1,
        can_go_next: +page < nPages,
        can_go_prev: +page > 1,
    });
  }
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

router.get("/profile-comment", auth, async function (req, res) {
  //const id = req.params.id || 0;
  const id = res.locals.authUser.uID;

  const information = await profileModel.getInforByID(id);
  const comment = await profileModel.getComment(id);
  const likeRate = await profileModel.getLikeOfBidder(id);
  const dislikeRate = await profileModel.getDislikeOfBidder(id);

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
