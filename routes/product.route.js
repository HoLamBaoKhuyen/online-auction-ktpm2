import express from "express";
import moment from "moment";
import numeral from "numeral";
import productModel from "../models/product.model.js";
import profileModel from "../models/profile.model.js";

import userModel from "../models/user.model.js";
import prodDesModel from "../models/productdes.model.js";
import watchlistModel from "../models/watchlist.model.js";
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

//------------------------------------ Cấp 1-----------------------------------------------

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

//------------------------------------ Cấp 2-----------------------------------------------

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

  let newlist = productModel.getTimeRemain(product);

  //Kiểm tra thời gian sản phẩm còn hiệu lực hay không
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

    //Kiểm tra để hiện ô  thêm description cho seller
    if (res.locals.authUser.userType == "seller" && isProd != null) {
      newlist[0].isProdOfSeller = 1;
    }
    //Kiểm tra id có nằm trong danh sách bị decline k
    const checkDecline = await productModel.checkDeclined(uID, prodID);
    if (checkDecline != null) {
      newlist[0].isDeclined = 1;
    } else {
      const getBidLike = await profileModel.getLikeOfBidder(uID);
      const getBidDisLike = await profileModel.getDislikeOfBidder(uID);
      const point = 0;
      if (getBidLike != 0 && getBidDisLike != 0)
        point = Math.round((getBidLike / (getBidLike + getBidDisLike)) * 10);
      console.log("Điểm: " + point);
      if (newlist[0].approve == 0 && point < 8) newlist[0].isDeclined = 1;
    }
  }

  //Lấy giá tối thiểu phải đặt
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
  });
});

//---------------Xử lí đấu giá------------------------

router.post("/detail/:prodID/makeBid", async function (req, res) {
  const prodID = req.params.prodID;
  const bidValue = req.body.bidPrice;
  const product = await productModel.findByProdID(prodID);

  if (new Date() > product[0].timeEnd) {
    req.session.bidUnsuccess = "Sản phẩm đã kết thúc";
  } else {
    if (isNaN(bidValue)) {
      req.session.bidUnsuccess = "Vui lòng nhập giá là CHỮ SỐ";
    } else {
      if (bidValue < product[0].curPrice + product[0].step) {
        req.session.bidUnsuccess =
          "Mức giá bạn đưa ra nhỏ hơn giá hiện tại của sản phẩm";
      } else {
        const different = bidValue - product[0].curPrice;
        if (Number.isInteger(different / product[0].step) == false) {
          req.session.bidUnsuccess =
            "Vui lòng nhập giá tăng thêm là bội của bước giá";
        } else {
          req.session.bidSuccess = "Bạn đã đấu giá thành công";
          productModel.addAuction(res.locals.authUser.uID, prodID, bidValue);
          const getMail = await productModel.getEmailinProduct(prodID);
          const getMailBid = await profileModel.getInforByID(
            res.locals.authUser.uID
          );
          productModel.sendAuctionEmail(
            getMail[0].sellerMail,
            "Update giá của sản phẩm " + product[0].prodName,
            `Giá mới được bid là: ${numeral(bidValue).format("0,0")} VND`
          );
          if (getMail[0].currentHighestMail != null)
            productModel.sendAuctionEmail(
              getMail[0].currentHighestMail,
              "Update giá của sản phẩm " + product[0].prodName,
              `Giá mới được bid là: ${numeral(bidValue).format("0,0")} VND`
            );
          if (getMailBid[0].email != getMail[0].currentHighestMail)
            productModel.sendAuctionEmail(
              getMailBid[0].email,
              "Update giá của sản phẩm " + product[0].prodName,
              `Bạn vừa mới đấu giá thành công. Giá mới được bid là: ${numeral(
                bidValue
              ).format("0,0")} VND`
            );
        }
      }
    }
  }

  res.redirect("/detail/" + prodID);
});

//Mua ngay
router.post("/detail/:prodID/buyNow", async function (req, res) {
  const prodID = req.params.prodID;
  req.session.bidSuccess = "Bạn đã mua ngay sản phẩm thành công";
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
    "Sản phẩm " + product[0].prodName + " đã được mua ngay",
    `Giá mua ngay là: ${numeral(product[0].buyNowPrice).format("0,0")} VND`
  );
  if (getMail[0].currentHighestMail != null)
    productModel.sendAuctionEmail(
      getMail[0].currentHighestMail,
      "Sản phẩm " + product[0].prodName + " đã được mua ngay",
      `Giá mua ngay là: ${numeral(product[0].buyNowPrice).format("0,0")} VND`
    );
  if (getMailBid[0].email != getMail[0].currentHighestMail)
    productModel.sendAuctionEmail(
      getMailBid[0].email,
      "Sản phẩm " + product[0].prodName,
      `Bạn vừa mua ngay thành công. Giá mua ngay là: ${numeral(
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
