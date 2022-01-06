import express from "express";

import watchlistModel from "../models/watchlist.model.js";
import auth from "../middlewares/auth.mdw.js";
import productModel from "../models/product.model.js";
import mylistModel from "../models/mylist.model.js";
const router = express.Router();
router.get("/favorite", auth, async function (req, res) {
  const limit = 8;
  const page = req.query.page || 1;
  const offset = (page - 1) * limit;
  const [list, total] = await Promise.all([
    watchlistModel.findPageAll(limit, offset, req.session.authUser.uID),
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
  if (req.session.authUser) {
    if (newlist) {
      for (let i = 0; i < newlist.length; i++) {
        let proID = newlist[i].prodID;
        let wlist = await watchlistModel.findByUidProID(
          req.session.authUser.uID,
          proID
        );
        if (wlist !== null) {
          newlist[i].inWatchlist = 1;
        }
      }
    }
  }
  res.render("mylist/watchlist", {
    products: newlist,
    empty: list.length === 0,
    pageNumbers,
    prev_page: +page - 1,
    next_page: +page + 1,
    can_go_next: +page < nPages,
    can_go_prev: +page > 1,
  });
});
router.post("/favorite/edit", async function (req, res) {
  const item = {
    bidID: req.body.uid,
    prodID: req.body.id,
  };
  const ret = await watchlistModel.findByUidProID(item.bidID, item.prodID);
  if (ret === null) {
    await watchlistModel.add(item);
  } else {
    await watchlistModel.remove(item.bidID, item.prodID);
  }
  res.redirect(req.headers.referer);
});

router.get("/participating", auth, async function (req, res) {
  const id = res.locals.authUser.uID;

  const limit = 8;
  const page = req.query.page || 1;
  const offset = (page - 1) * limit;

  const total = await mylistModel.countParticipatingProd(id);

  let nPages = Math.floor(total / limit);
  if (total % limit > 0) nPages++;

  const pageNumbers = [];
  for (let i = 1; i <= nPages; i++) {
    pageNumbers.push({
      value: i,
      isCurrent: +page === i,
    });
  }

  const participateproducts = await mylistModel.getParticipatingProdPage(
    limit,
    offset,
    id
  );
  // console.log(participateproducts);

  res.render("mylist/participating", {
    products: participateproducts,
    empty: participateproducts.length === 0,
    pageNumbers,
  });
});
router.post("/participating/edit", async function (req, res) {
  const item = {
    bidID: req.body.uid,
    prodID: req.body.id,
  };
  const ret = await watchlistModel.findByUidProID(item.bidID, item.prodID);
  if (ret === null) {
    await watchlistModel.add(item);
  } else {
    await watchlistModel.remove(item.bidID, item.prodID);
  }
  res.redirect(req.headers.referer);
});

router.get("/winning", auth, async function (req, res) {
  const id = res.locals.authUser.uID;

  const limit = 8;
  const page = req.query.page || 1;
  const offset = (page - 1) * limit;

  const total = await mylistModel.countWinProd(id);

  let nPages = Math.floor(total / limit);
  if (total % limit > 0) nPages++;

  const pageNumbers = [];
  for (let i = 1; i <= nPages; i++) {
    pageNumbers.push({
      value: i,
      isCurrent: +page === i,
    });
  }

  const winproducts = await mylistModel.getWinProdPage(limit, offset, id);
  console.log(winproducts);
  res.render("mylist/winning", {
    products: winproducts,
    empty: winproducts.length === 0,
    pageNumbers,
  });
});
router.post("/winning/edit", async function (req, res) {
  const item = {
    bidID: req.body.uid,
    prodID: req.body.id,
  };
  const ret = await watchlistModel.findByUidProID(item.bidID, item.prodID);
  if (ret === null) {
    await watchlistModel.add(item);
  } else {
    await watchlistModel.remove(item.bidID, item.prodID);
  }
  res.redirect(req.headers.referer);
});

router.get("/myproducts", auth, async function (req, res) {
  const id = res.locals.authUser.uID;

  const limit = 8;
  const page = req.query.page || 1;
  const offset = (page - 1) * limit;

  const total = await mylistModel.countPostProd(id);

  let nPages = Math.floor(total / limit);
  if (total % limit > 0) nPages++;

  const pageNumbers = [];
  for (let i = 1; i <= nPages; i++) {
    pageNumbers.push({
      value: i,
      isCurrent: +page === i,
    });
  }

  const winproducts = await mylistModel.getPostProdPage(limit, offset, id);
  console.log(winproducts);
  res.render("mylist/myproducts", {
    products: winproducts,
    empty: winproducts.length === 0,
    pageNumbers,
  });
});
router.post("/myproducts/edit", async function (req, res) {
  const item = {
    bidID: req.body.uid,
    prodID: req.body.id,
  };
  const ret = await watchlistModel.findByUidProID(item.bidID, item.prodID);
  if (ret === null) {
    await watchlistModel.add(item);
  } else {
    await watchlistModel.remove(item.bidID, item.prodID);
  }
  res.redirect(req.headers.referer);
});
export default router;
