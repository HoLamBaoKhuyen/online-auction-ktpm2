import express from "express";
import moment from "moment";
import numeral from "numeral";
import productModel from "../models/product.model.js";
import profileModel from "../models/profile.model.js";

import userModel from "../models/user.model.js";
import prodDesModel from "../models/productdes.model.js";
import watchlistModel from "../models/watchlist.model.js";
import ratingModel from "../models/rating.model.js";
const router = express.Router();

router.get("/", async function (req, res) {
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

  console.log(newlist1);
  res.render("home", {
    top5Price: newlist1,
    top5End: newlist2,
    top5Bid: newlist3,
  });
});

router.get("/allproducts", async function (req, res) {
  const limit = 8;
  const page = req.query.page || 1;
  const offset = (page - 1) * limit;
  const [list, total] = await Promise.all([
    productModel.findPageAll(limit, offset),
    productModel.countAll(),
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

  res.render("ProductView/byCat", {
    products: newlist,
    empty: list.length === 0,
    pageNumbers,
    prev_page: +page - 1,
    next_page: +page + 1,
    can_go_next: +page < nPages,
    can_go_prev: +page > 1,
  });
});

//------------------------------------ C???p 1-----------------------------------------------

router.get("/byCat/:catID", async function (req, res) {
  const catID = req.params.catID || 0;

  const limit = 8;
  const page = req.query.page || 1;
  const offset = (page - 1) * limit;
  const [list, total] = await Promise.all([
    productModel.findPageByCatID(catID, limit, offset),
    productModel.countByCatID(catID),
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
  const categoryName = await productModel.getCategoryName(catID);

  res.render("ProductView/byCat", {
    products: newlist,
    empty: list.length === 0,
    pageNumbers,
    categoryName,
    prev_page: +page - 1,
    next_page: +page + 1,
    can_go_next: +page < nPages,
    can_go_prev: +page > 1,
  });
});

router.get("/byCat/sortDate/:catID", async function (req, res) {
  const catID = req.params.catID || 0;

  const limit = 8;
  const page = req.query.page || 1;
  const offset = (page - 1) * limit;
  const [list, total] = await Promise.all([
    productModel.findPageByCatIDSortDate(catID, limit, offset),
    productModel.countByCatID(catID),
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
  const categoryName = await productModel.getCategoryName(catID);
  categoryName[0].sortDate = 1;

  res.render("ProductView/byCat", {
    products: newlist,
    empty: list.length === 0,
    categoryName,
    pageNumbers,
    prev_page: +page - 1,
    next_page: +page + 1,
    can_go_next: +page < nPages,
    can_go_prev: +page > 1,
  });
});

router.get("/byCat/sortPrice/:catID", async function (req, res) {
  const catID = req.params.catID || 0;

  const limit = 8;
  const page = req.query.page || 1;
  const offset = (page - 1) * limit;
  const [list, total] = await Promise.all([
    productModel.findPageByCatIDSortPrice(catID, limit, offset),
    productModel.countByCatID(catID),
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
  const categoryName = await productModel.getCategoryName(catID);
  categoryName[0].sortPrice = 1;

  categoryName[0].sortPrice = 1;

  res.render("ProductView/byCat", {
    products: newlist,
    empty: list.length === 0,
    pageNumbers,
    categoryName,
    prev_page: +page - 1,
    next_page: +page + 1,
    can_go_next: +page < nPages,
    can_go_prev: +page > 1,
  });
});

//------------------------------------ C???p 2-----------------------------------------------

router.get("/byCat2/:typeID", async function (req, res) {
  const typeID = req.params.typeID || 0;

  const limit = 8;
  const page = req.query.page || 1;
  const offset = (page - 1) * limit;
  const [list, total] = await Promise.all([
    productModel.findPageByTypeID(typeID, limit, offset),
    productModel.countByTypeID(typeID),
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
  const productName = await productModel.getProductName(typeID);

  res.render("ProductView/byCat", {
    products: newlist,
    empty: list.length === 0,
    productName,
    pageNumbers,
    prev_page: +page - 1,
    next_page: +page + 1,
    can_go_next: +page < nPages,
    can_go_prev: +page > 1,
  });
});

router.get("/byCat2/sortDate/:typeID", async function (req, res) {
  const typeID = req.params.typeID || 0;

  const limit = 8;
  const page = req.query.page || 1;
  const offset = (page - 1) * limit;
  const [list, total] = await Promise.all([
    productModel.findPageByTypeIDSortDate(typeID, limit, offset),
    productModel.countByTypeID(typeID),
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
  const productName = await productModel.getProductName(typeID);
  productName[0].sortDate = 1;

  res.render("ProductView/byCat", {
    products: newlist,
    empty: list.length === 0,
    productName,
    pageNumbers,
    prev_page: +page - 1,
    next_page: +page + 1,
    can_go_next: +page < nPages,
    can_go_prev: +page > 1,
  });
});

router.get("/byCat2/sortPrice/:typeID", async function (req, res) {
  const typeID = req.params.typeID || 0;

  const limit = 8;
  const page = req.query.page || 1;
  const offset = (page - 1) * limit;
  const [list, total] = await Promise.all([
    productModel.findPageByTypeIDSortPrice(typeID, limit, offset),
    productModel.countByTypeID(typeID),
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
  const productName = await productModel.getProductName(typeID);

  productName[0].sortPrice = 1;

  res.render("ProductView/byCat", {
    products: newlist,
    empty: list.length === 0,
    pageNumbers,
    productName,
    prev_page: +page - 1,
    next_page: +page + 1,
    can_go_next: +page < nPages,
    can_go_prev: +page > 1,
  });
});

//------------------------------------ DETAIL-----------------------------------------------

router.get("/detail/:prodid", async function (req, res) {
  const prodID = req.params.prodid;
  const product = await productModel.findByProdID(prodID);

  if (product == null) {
    return res.redirect("/");
  }
  const rate = await ratingModel.getBidProdRate(prodID);
  let newlist = productModel.getTimeRemain(product);

  //Ki???m tra th???i gian s???n ph???m c??n hi???u l???c hay kh??ng
  if (new Date() < product[0].timeEnd) {
    product[0].isAvailable = 1;
  }

  if (req.session.authUser) {
    const wlist = await watchlistModel.findByUidProID(
      req.session.authUser.uID,
      prodID
    );
    if (wlist !== null) {
      product[0].inWatchlist = 1;
    }
  }

  if (newlist[0].highestBidID != null) {
    const highestUserBidLike = await profileModel.getLikeOfBidder(
      newlist[0].highestBidID
    );
    const highestUserBidDisLike = await profileModel.getDislikeOfBidder(
      newlist[0].highestBidID
    );
    newlist[0].likeBid = highestUserBidLike;
    newlist[0].dislikeBid = highestUserBidDisLike;
  } else {
    newlist[0].noHighestBid = 1;
  }

  const SelLike = await profileModel.getLikeOfSeller(newlist[0].selID);
  const SelDisLike = await profileModel.getDislikeOfSeller(newlist[0].selID);
  newlist[0].likeSel = SelLike;
  newlist[0].dislikeSel = SelDisLike;

  if (res.locals.authUser) {
    const uID = res.locals.authUser.uID;
    const isProd = await productModel.checkProdOfSeller(uID, prodID);

    //Ki???m tra ????? hi???n ??  th??m description cho seller
    if (res.locals.authUser.userType == "seller" && isProd != null) {
      newlist[0].isProdOfSeller = 1;
    }
    //Ki???m tra id c?? n???m trong danh s??ch b??? decline k
    const checkDecline = await productModel.checkDeclined(uID, prodID);
    if (checkDecline !== null) {
      newlist[0].isDeclined = 1;
    } else {
      const getBidLike = await profileModel.getLikeOfBidder(uID);
      const getBidDisLike = await profileModel.getDislikeOfBidder(uID);
      let point = 0;
      if (getBidLike != 0 || getBidDisLike != 0)
        point = (getBidLike / (getBidLike + getBidDisLike)) * 10;
      console.log("??i???m: " + point);
      if (newlist[0].approve == 0 && point < 8) newlist[0].isDeclined = 1;
    }
  }

  //L???y gi?? t???i thi???u ph???i ?????t
  newlist[0].minbid = newlist[0].curPrice + newlist[0].step;

  if (req.session.bidUnsuccess) {
    newlist[0].unsuccessBid = req.session.bidUnsuccess;
    delete req.session.bidUnsuccess;
  }

  if (req.session.bidSuccess) {
    newlist[0].successBid = req.session.bidSuccess;
    delete req.session.bidSuccess;
  }

  const description = await productModel.getDescription(prodID);

  const similar = await productModel.getSimilarProduct(prodID);
  let newsimilar = productModel.getTimeRemain(similar);

  const historytable = await productModel.getHistoryBid(prodID);

  res.render("ProductView/detail", {
    product: newlist,
    description,
    similar: newsimilar,
    historytable,
    proID: prodID,
    comment: rate,
    countCmt: rate.length,
  });
});

//---------------X??? l?? ?????u gi??------------------------

router.post("/detail/:prodID/makeBid", async function (req, res) {
  const prodID = req.params.prodID;
  const bidValue = req.body.bidPrice;
  const product = await productModel.findByProdID(prodID);

  if (new Date() > product[0].timeEnd) {
    req.session.bidUnsuccess = "S???n ph???m ???? k???t th??c";
  } else {
    if (isNaN(bidValue)) {
      req.session.bidUnsuccess = "Vui l??ng nh???p gi?? l?? CH??? S???";
    } else {
      if (bidValue < product[0].curPrice + product[0].step) {
        req.session.bidUnsuccess =
          "M???c gi?? b???n ????a ra nh??? h??n gi?? hi???n t???i c???a s???n ph???m";
      } else {
        const different = bidValue - product[0].curPrice;
        if (Number.isInteger(different / product[0].step) == false) {
          req.session.bidUnsuccess =
            "Vui l??ng nh???p gi?? t??ng th??m l?? b???i c???a b?????c gi??";
        }

        else {
          // GI?? H???P L???
          const checkAutoAuction = await productModel.checkAutoAuction(prodID);// L???y th??ng tin c???a ng?????i ??ang ?????t gi?? cao nh???t hi???n t???i 

          if (checkAutoAuction == null) //Kh??ng c?? autoauction
          {
            const getMail = await productModel.getEmailinProduct(prodID);//L???y th??ng tin s???n ph???m hi???n t???i

            if (product[0].curPrice + product[0].step != bidValue) //Tr?????ng h???p == th?? t???c l?? ??ang ?????t gi?? th???p nh???t c?? th??? ?????t --> k c???n auto --> != m???i c?? auto
              productModel.addAutoAuction(res.locals.authUser.uID, prodID, bidValue);

            const newbidValue = product[0].curPrice + product[0].step;
            productModel.addAuction(res.locals.authUser.uID, prodID, newbidValue);

            const getMailBid = await profileModel.getInforByID(
              res.locals.authUser.uID
            );

            productModel.sendAuctionEmail(
              getMail[0].sellerMail,
              "Update gi?? c???a s???n ph???m " + product[0].prodName,
              `Gi?? m???i ???????c bid l??: ${numeral(newbidValue).format("0,0")} VND`
            );
            if (getMail[0].currentHighestMail != null)
              productModel.sendAuctionEmail(
                getMail[0].currentHighestMail,
                "Update gi?? c???a s???n ph???m " + product[0].prodName,
                `Gi?? m???i ???????c bid l??: ${numeral(newbidValue).format("0,0")} VND`
              );
            if (getMailBid[0].email != getMail[0].currentHighestMail)
              productModel.sendAuctionEmail(
                getMailBid[0].email,
                "Update gi?? c???a s???n ph???m " + product[0].prodName,
                `B???n v???a m???i ?????u gi?? th??nh c??ng. Gi?? m???i ???????c bid l??: ${numeral(
                  newbidValue
                ).format("0,0")} VND`
              );
            req.session.bidSuccess = "B???n ???? ?????u gi?? th??nh c??ng";

          }
          else {
            // Tr?????ng h???p gi?? m???i cao h??n gi?? l???n nh???t c???a ng?????i ??ang ?????t t??? ?????ng
            if (bidValue > checkAutoAuction.maxprice) {
              const curAutoBid = await productModel.getInforAutoAuction(prodID);
              const getMail = await productModel.getEmailinProduct(prodID);//L???y th??ng tin s???n ph???m hi???n t???i ????? l???y email 


              //X??a auto auction c???a ng?????i hi???n t???i v?? th??m ng?????i m???i
              await productModel.deletefromAutoAuction(prodID);
              productModel.addAutoAuction(res.locals.authUser.uID, prodID, bidValue);

              // if(curAutoBid[0].maxprice != product[0].curPrice)
              //   productModel.addAuction(curAutoBid[0].bidID, prodID, curAutoBid[0].maxprice); // l???y gi?? max c???a ng?????i gi?? cao nh???t trong auto c??

              const newbidValue = curAutoBid[0].maxprice + product[0].step;
              productModel.addAuction(res.locals.authUser.uID, prodID, newbidValue); // th??m v??o gi?? max c???a ng?????i c?? + step ????? ra gi?? bid m???i nh??? nh???t

              if (curAutoBid[0].maxprice + product[0].step == bidValue)
                await productModel.deletefromAutoAuction(prodID); //X??a autoauction c???a bidder hi???n t???i n???u curPrice ???? b???ng gi?? max c???a bidder n??y

              const getMailBid = await profileModel.getInforByID(
                res.locals.authUser.uID
              );

              productModel.sendAuctionEmail(
                getMail[0].sellerMail,
                "Update gi?? c???a s???n ph???m " + product[0].prodName,
                `Gi?? m???i ???????c bid l??: ${numeral(newbidValue).format("0,0")} VND`
              );
              if (getMail[0].currentHighestMail != null)
                productModel.sendAuctionEmail(
                  getMail[0].currentHighestMail,
                  "Update gi?? c???a s???n ph???m " + product[0].prodName,
                  `Gi?? m???i ???????c bid l??: ${numeral(newbidValue).format("0,0")} VND`
                );
              productModel.sendAuctionEmail(
                getMailBid[0].email,
                "Update gi?? c???a s???n ph???m " + product[0].prodName,
                `B???n v???a m???i ?????u gi?? th??nh c??ng. Gi?? m???i ???????c bid l??: ${numeral(newbidValue).format("0,0")} VND`
              );
              req.session.bidSuccess = "B???n ???? ?????u gi?? th??nh c??ng";

            }

            if (bidValue < checkAutoAuction.maxprice) {
              const curAutoBid = await productModel.getInforAutoAuction(prodID);
              const getMail = await productModel.getEmailinProduct(prodID);//L???y th??ng tin s???n ph???m hi???n t???i ????? l???y email 
              const getMailBid = await profileModel.getInforByID(
                res.locals.authUser.uID
              );

              //L???y gi?? cao nh???t c???a ng?????i hi???n t???i ????? ?????u v?? g???i th??ng tin qua email
              productModel.addAuction(res.locals.authUser.uID, prodID, bidValue);

              productModel.sendAuctionEmail(
                getMail[0].sellerMail,
                "Update gi?? c???a s???n ph???m " + product[0].prodName,
                `Gi?? m???i ???????c bid l??: ${numeral(bidValue).format("0,0")} VND`
              );
              if (getMail[0].currentHighestMail != null)
                productModel.sendAuctionEmail(
                  getMail[0].currentHighestMail,
                  "Update gi?? c???a s???n ph???m " + product[0].prodName,
                  `Gi?? m???i ???????c bid l??: ${numeral(bidValue).format("0,0")} VND`
                );
              productModel.sendAuctionEmail(
                getMailBid[0].email,
                "Update gi?? c???a s???n ph???m " + product[0].prodName,
                `B???n v???a m???i ?????u gi?? th??nh c??ng. Gi?? m???i ???????c bid l??: ${numeral(bidValue).format("0,0")} VND`
              );

              //Auto auction ???????c th???c thi
              const newprice = (+bidValue) + (+product[0].step);

              productModel.addAuction(curAutoBid[0].bidID, prodID, newprice);// t??? ?????ng ?????u gi?? m???i 

              if (newprice == checkAutoAuction.maxprice)
                await productModel.deletefromAutoAuction(prodID); //X??a autoauction c???a bidder hi???n t???i n???u curPrice ???? b???ng gi?? max c???a bidder n??y

              const getMail2 = await productModel.getEmailinProduct(prodID);//L???y th??ng tin s???n ph???m hi???n t???i ????? l???y email 
              const getMailBid2 = await profileModel.getInforByID(
                curAutoBid[0].bidID
              );

              //G???i mail
              productModel.sendAuctionEmail(
                getMail2[0].sellerMail,
                "Update gi?? c???a s???n ph???m " + product[0].prodName,
                `Gi?? m???i ???????c bid l??: ${numeral(newprice).format("0,0")} VND`
              );
              if (getMail2[0].currentHighestMail != null)
                productModel.sendAuctionEmail(
                  getMailBid[0].email,
                  "Update gi?? c???a s???n ph???m " + product[0].prodName,
                  `Gi?? m???i ???????c bid l??: ${numeral(newprice).format("0,0")} VND`
                );
              productModel.sendAuctionEmail(
                getMailBid2[0].email,
                "Update gi?? c???a s???n ph???m " + product[0].prodName,
                `B???n v???a m???i ?????u gi?? th??nh c??ng. Gi?? m???i ???????c bid l??: ${numeral(newprice).format("0,0")} VND`
              );
              req.session.bidSuccess = "B???n ???? ?????u gi?? th??nh c??ng";
            }

            if (bidValue == checkAutoAuction.maxprice) {
              const curAutoBid = await productModel.getInforAutoAuction(prodID);
              const getMail = await productModel.getEmailinProduct(prodID);//L???y th??ng tin s???n ph???m hi???n t???i ????? l???y email 
              const getMailBid = await profileModel.getInforByID(
                res.locals.authUser.uID
              );

              productModel.addAuction(curAutoBid[0].bidID, prodID, curAutoBid[0].maxprice);
              await productModel.deletefromAutoAuction(curAutoBid[0].bidID); //X??a autoauction c???a bidder hi???n t???i do curPrice ???? b???ng gi?? max c???a bidder n??y
              req.session.bidUnsuccess = "Gi?? cao nh???t c???a b???n ???? b??? ng?????i kh??c ?????t m???t. Vui l??ng ?????t l???i gi?? kh??c.";// N???u b???ng gi?? th?? ch???n ng?????i ?????t tr?????c

              await productModel.deletefromAutoAuction(prodID); //X??a autoauction c???a bidder hi???n t???i do curPrice ???? b???ng gi?? max c???a bidder n??y


              productModel.sendAuctionEmail(
                getMail[0].sellerMail,
                "Update gi?? c???a s???n ph???m " + product[0].prodName,
                `Gi?? m???i ???????c bid l??: ${numeral(curAutoBid[0].maxprice).format("0,0")} VND`
              );
              if (getMail[0].currentHighestMail != null)
                productModel.sendAuctionEmail(
                  getMail[0].currentHighestMail,
                  "B???n v???a m???i update gi?? c???a s???n ph???m " + product[0].prodName,
                  `Gi?? m???i ???????c bid l??: ${numeral(curAutoBid[0].maxprice).format("0,0")} VND`
                );
            }

          }
          // productModel.addAuction(res.locals.authUser.uID, prodID, bidValue);
          // const getMail = await productModel.getEmailinProduct(prodID);
          // const getMailBid = await profileModel.getInforByID(
          //   res.locals.authUser.uID
          // );
          // productModel.sendAuctionEmail(
          //   getMail[0].sellerMail,
          //   "Update gi?? c???a s???n ph???m " + product[0].prodName,
          //   `Gi?? m???i ???????c bid l??: ${numeral(bidValue).format("0,0")} VND`
          // );
          // if (getMail[0].currentHighestMail != null)
          //   productModel.sendAuctionEmail(
          //     getMail[0].currentHighestMail,
          //     "Update gi?? c???a s???n ph???m " + product[0].prodName,
          //     `Gi?? m???i ???????c bid l??: ${numeral(bidValue).format("0,0")} VND`
          //   );
          // if (getMailBid[0].email != getMail[0].currentHighestMail)
          //   productModel.sendAuctionEmail(
          //     getMailBid[0].email,
          //     "Update gi?? c???a s???n ph???m " + product[0].prodName,
          //     `B???n v???a m???i ?????u gi?? th??nh c??ng. Gi?? m???i ???????c bid l??: ${numeral(
          //       bidValue
          //     ).format("0,0")} VND`
          //   );
        }
      }
    }
  }

  res.redirect("/detail/" + prodID);
});

//Mua ngay
router.post("/detail/:prodID/buyNow", async function (req, res) {
  const prodID = req.params.prodID;
  req.session.bidSuccess = "B???n ???? mua ngay s???n ph???m th??nh c??ng";
  const product = await productModel.findByProdID(prodID);

  productModel.buyNowAuction(
    res.locals.authUser.uID,
    prodID,
    product[0].buyNowPrice
  );
  const getMail = await productModel.getEmailinProduct(prodID);
  const getMailBid = await profileModel.getInforByID(res.locals.authUser.uID);
  productModel.sendAuctionEmail(
    getMail[0].sellerMail,
    "S???n ph???m " + product[0].prodName + " ???? ???????c mua ngay",
    `Gi?? mua ngay l??: ${numeral(product[0].buyNowPrice).format("0,0")} VND`
  );
  if (getMail[0].currentHighestMail != null)
    productModel.sendAuctionEmail(
      getMail[0].currentHighestMail,
      "S???n ph???m " + product[0].prodName + " ???? ???????c mua ngay",
      `Gi?? mua ngay l??: ${numeral(product[0].buyNowPrice).format("0,0")} VND`
    );
  if (getMailBid[0].email != getMail[0].currentHighestMail)
    productModel.sendAuctionEmail(
      getMailBid[0].email,
      "S???n ph???m " + product[0].prodName,
      `B???n v???a mua ngay th??nh c??ng. Gi?? mua ngay l??: ${numeral(
        product[0].buyNowPrice
      ).format("0,0")} VND`
    );
  res.redirect("/detail/" + prodID);
});

// --------Edit description in detail----------------

router.post("/detail/:prodID/editDesc", async function (req, res) {
  const desc = req.body.AddDes;
  const prodID = req.params.prodID;

  const addDesc = productModel.addDesc(prodID, desc);
  const link = "/detail/" + prodID;
  res.redirect(link);
});

//------------------------------------ Search-----------------------------------------------

router.get("/product/search", async function (req, res) {
  const text = req.query.searchbox || 0;
  const category_search = req.query.categorySearch || 0;

  const limit = 8;
  const page = req.query.page || 1;
  const offset = (page - 1) * limit;

  const [list, total] = await Promise.all([
    productModel.searchProd(text, category_search, limit, offset),
    productModel.countsearchProd(text, category_search),
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
  const searchName = [{ search: "", cate: "" }];

  searchName[0].search = text;
  searchName[0].cate = category_search;

  res.render("ProductView/byCat", {
    products: newlist,
    empty: list.length === 0,
    pageNumbers,
    searchName,
    prev_page: +page - 1,
    next_page: +page + 1,
    can_go_next: +page < nPages,
    can_go_prev: +page > 1,
  });
});

router.get("/product/sortPrice/search", async function (req, res) {
  const text = req.query.searchbox || 0;
  const category_search = req.query.categorySearch || 0;

  const limit = 8;
  const page = req.query.page || 1;
  const offset = (page - 1) * limit;
  const [list, total] = await Promise.all([
    productModel.searchProdSortPrice(text, category_search, limit, offset),
    productModel.countsearchProd(text, category_search),
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
  const searchName = [{ search: "", cate: "" }];

  searchName[0].search = text;
  searchName[0].cate = category_search;
  searchName[0].sortPrice = 1;

  res.render("ProductView/byCat", {
    products: newlist,
    empty: list.length === 0,
    pageNumbers,
    searchName,
    prev_page: +page - 1,
    next_page: +page + 1,
    can_go_next: +page < nPages,
    can_go_prev: +page > 1,
  });
});

router.get("/product/sortDate/search", async function (req, res) {
  const text = req.query.searchbox || 0;
  const category_search = req.query.categorySearch || 0;

  const limit = 8;
  const page = req.query.page || 1;
  const offset = (page - 1) * limit;
  const [list, total] = await Promise.all([
    productModel.searchProdSortDate(text, category_search, limit, offset),
    productModel.countsearchProd(text, category_search),
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
  const searchName = [{ search: "", cate: "" }];

  searchName[0].search = text;
  searchName[0].cate = category_search;
  searchName[0].sortDate = 1;

  res.render("ProductView/byCat", {
    products: newlist,
    empty: list.length === 0,
    pageNumbers,
    searchName,
    prev_page: +page - 1,
    next_page: +page + 1,
    can_go_next: +page < nPages,
    can_go_prev: +page > 1,
  });
});

export default router;
