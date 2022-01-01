import express from 'express';

import productModel from "../models/product.model.js";
import profileModel from '../models/profile.model.js';

const router = express.Router();

router.get("/", async function (req, res) {
    const top5Price = await productModel.getTop5HighestPrice();
    const top5End = await productModel.getTop5End();
    const top5Bid = await productModel.getTop5HighestBids();

    let newlist1 = productModel.getTimeRemain(top5Price);
    let newlist2 = productModel.getTimeRemain(top5End);
    let newlist3 = productModel.getTimeRemain(top5Bid);



    res.render('home', {
        top5Price: newlist1,
        top5End: newlist2,
        top5Bid: newlist3
    });
});

router.get("/allproducts", async function (req, res) {

    const limit = 8;
    const page = req.query.page || 1;
    const offset = (page - 1) * limit;
    const [list, total] = await Promise.all([
        productModel.findPageAll(limit, offset),
        productModel.countAll()
    ]);


    let nPages = Math.floor(total / limit);
    if (total % limit > 0) nPages++;

    const pageNumbers = [];
    for (let i = 1; i <= nPages; i++) {
        pageNumbers.push({
            value: i,
            isCurrent: +page === i
        });
    };

    let newlist = productModel.getTimeRemain(list);



    res.render('ProductView/byCat', {
        products: newlist,
        empty: list.length === 0,
        pageNumbers,
        prev_page: +page - 1,
        next_page: +page + 1,
        can_go_next: +page < nPages,
        can_go_prev: +page > 1
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
        productModel.countByCatID(catID)
    ]);

    let nPages = Math.floor(total / limit);
    if (total % limit > 0) nPages++;

    const pageNumbers = [];
    for (let i = 1; i <= nPages; i++) {
        pageNumbers.push({
            value: i,
            isCurrent: +page === i
        });
    }

    let newlist = productModel.getTimeRemain(list);

    const categoryName = await productModel.getCategoryName(catID);

    res.render('ProductView/byCat', {
        products: newlist,
        empty: list.length === 0,
        pageNumbers,
        categoryName,
        prev_page: +page - 1,
        next_page: +page + 1,
        can_go_next: +page < nPages,
        can_go_prev: +page > 1
    });
});



router.get("/byCat/sortDate/:catID", async function (req, res) {
    const catID = req.params.catID || 0;

    const limit = 8;
    const page = req.query.page || 1;
    const offset = (page - 1) * limit;
    const [list, total] = await Promise.all([
        productModel.findPageByCatIDSortDate(catID, limit, offset),
        productModel.countByCatID(catID)
    ])
    let nPages = Math.floor(total / limit);
    if (total % limit > 0) nPages++;

    const pageNumbers = [];
    for (let i = 1; i <= nPages; i++) {
        pageNumbers.push({
            value: i,
            isCurrent: +page === i
        });
    }

    let newlist = productModel.getTimeRemain(list);


    const categoryName = await productModel.getCategoryName(catID);
    categoryName[0].sortDate = 1;

    res.render('ProductView/byCat', {
        products: newlist,
        empty: list.length === 0,
        categoryName,
        pageNumbers,
        prev_page: +page - 1,
        next_page: +page + 1,
        can_go_next: +page < nPages,
        can_go_prev: +page > 1
    });
});

router.get("/byCat/sortPrice/:catID", async function (req, res) {
    const catID = req.params.catID || 0;

    const limit = 8;
    const page = req.query.page || 1;
    const offset = (page - 1) * limit;
    const [list, total] = await Promise.all([
        productModel.findPageByCatIDSortPrice(catID, limit, offset),
        productModel.countByCatID(catID)
    ])
    let nPages = Math.floor(total / limit);
    if (total % limit > 0) nPages++;

    const pageNumbers = [];
    for (let i = 1; i <= nPages; i++) {
        pageNumbers.push({
            value: i,
            isCurrent: +page === i
        });
    }

    let newlist = productModel.getTimeRemain(list);


    const categoryName = await productModel.getCategoryName(catID);
    categoryName[0].sortPrice = 1;

    categoryName[0].sortPrice = 1;

    res.render('ProductView/byCat', {
        products: newlist,
        empty: list.length === 0,
        pageNumbers,
        categoryName,
        prev_page: +page - 1,
        next_page: +page + 1,
        can_go_next: +page < nPages,
        can_go_prev: +page > 1
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
        productModel.countByTypeID(typeID)
    ])
    let nPages = Math.floor(total / limit);
    if (total % limit > 0) nPages++;

    const pageNumbers = [];
    for (let i = 1; i <= nPages; i++) {
        pageNumbers.push({
            value: i,
            isCurrent: +page === i
        });
    }

    let newlist = productModel.getTimeRemain(list);


    const productName = await productModel.getProductName(typeID);

    res.render('ProductView/byCat', {
        products: newlist,
        empty: list.length === 0,
        productName,
        pageNumbers,
        prev_page: +page - 1,
        next_page: +page + 1,
        can_go_next: +page < nPages,
        can_go_prev: +page > 1
    });
});

router.get("/byCat2/sortDate/:typeID", async function (req, res) {
    const typeID = req.params.typeID || 0;

    const limit = 8;
    const page = req.query.page || 1;
    const offset = (page - 1) * limit;
    const [list, total] = await Promise.all([
        productModel.findPageByTypeIDSortDate(typeID, limit, offset),
        productModel.countByTypeID(typeID)
    ])
    let nPages = Math.floor(total / limit);
    if (total % limit > 0) nPages++;

    const pageNumbers = [];
    for (let i = 1; i <= nPages; i++) {
        pageNumbers.push({
            value: i,
            isCurrent: +page === i
        });
    }

    let newlist = productModel.getTimeRemain(list);


    const productName = await productModel.getProductName(typeID);
    productName[0].sortDate = 1;

    res.render('ProductView/byCat', {
        products: newlist,
        empty: list.length === 0,
        productName,
        pageNumbers,
        prev_page: +page - 1,
        next_page: +page + 1,
        can_go_next: +page < nPages,
        can_go_prev: +page > 1
    });
});

router.get("/byCat2/sortPrice/:typeID", async function (req, res) {
    const typeID = req.params.typeID || 0;

    const limit = 8;
    const page = req.query.page || 1;
    const offset = (page - 1) * limit;
    const [list, total] = await Promise.all([
        productModel.findPageByTypeIDSortPrice(typeID, limit, offset),
        productModel.countByTypeID(typeID)
    ])
    let nPages = Math.floor(total / limit);
    if (total % limit > 0) nPages++;

    const pageNumbers = [];
    for (let i = 1; i <= nPages; i++) {
        pageNumbers.push({
            value: i,
            isCurrent: +page === i
        });
    }

    let newlist = productModel.getTimeRemain(list);


    const productName = await productModel.getProductName(typeID);

    productName[0].sortPrice = 1;

    res.render('ProductView/byCat', {
        products: newlist,
        empty: list.length === 0,
        pageNumbers,
        productName,
        prev_page: +page - 1,
        next_page: +page + 1,
        can_go_next: +page < nPages,
        can_go_prev: +page > 1
    });
});




//------------------------------------ DETAIL-----------------------------------------------

router.get("/detail/:prodid", async function (req, res) {
    const prodID = req.params.prodid;
    const product = await productModel.findByProdID(prodID);

    if (product == null) {
        return res.redirect('/');
    }

    let newlist = productModel.getTimeRemain(product);

    if (res.locals.authUser) {
        const uID = res.locals.authUser.uID;
        const isProd = await productModel.checkProdOfSeller(uID, prodID);


        if (res.locals.authUser.userType == "seller" && isProd != null) {
            newlist[0].isProdOfSeller = 1;
        }

        const checkDecline = await productModel.checkDeclined(uID, prodID);
        if (checkDecline != null) {
            newlist[0].isDeclined = 1;
        }
    }

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

    res.render('ProductView/detail', {
        product: newlist,
        description,
        similar: newsimilar,
        historytable
    });
});

//---------------Xử lí đấu giá------------------------

router.post('/detail/:prodID/makeBid', async function (req, res) {
    const prodID = req.params.prodID;
    const bidValue = req.body.bidPrice;
    console.log(bidValue);
    const product = await productModel.findByProdID(prodID);
    if (new Date() > product[0].timeEnd) {
        req.session.bidUnsuccess = 'Sản phẩm đã kết thúc';
    }
    else {
        if (isNaN(bidValue)) {
            req.session.bidUnsuccess = 'Vui lòng nhập giá là CHỮ SỐ';
        }
        else {
            if (bidValue < product[0].curPrice + product[0].step) {
                req.session.bidUnsuccess = 'Mức giá bạn đưa ra nhỏ hơn giá hiện tại của sản phẩm';
            }
            else {
                const different = bidValue - product[0].curPrice;
                if (Number.isInteger(different / product[0].step) == false) {
                    req.session.bidUnsuccess = 'Vui lòng nhập giá tăng thêm là bội của bước giá';
                }
                else {
                    req.session.bidSuccess = 'Bạn đã đấu giá thành công';
                    productModel.addAuction(res.locals.authUser.uID,prodID,bidValue);
                }
            }
        }
    }

    res.redirect('/detail/' + prodID);
});


// --------Edit description in detail----------------

router.post("/detail/:prodID/editDesc", async function (req, res) {
    const desc = req.body.AddDes;
    const prodID = req.params.prodID;

    const addDesc = productModel.addDesc(prodID, desc)
    const link = '/detail/' + prodID;
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
        productModel.countsearchProd(text, category_search)
    ]);

    let nPages = Math.floor(total / limit);
    if (total % limit > 0) nPages++;

    const pageNumbers = [];
    for (let i = 1; i <= nPages; i++) {
        pageNumbers.push({
            value: i,
            isCurrent: +page === i
        });
    }

    let newlist = productModel.getTimeRemain(list);


    const searchName = [{ search: "", cate: "" }];

    searchName[0].search = text;
    searchName[0].cate = category_search;

    res.render('ProductView/byCat', {
        products: newlist,
        empty: list.length === 0,
        pageNumbers,
        searchName,
        prev_page: +page - 1,
        next_page: +page + 1,
        can_go_next: +page < nPages,
        can_go_prev: +page > 1
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
        productModel.countsearchProd(text, category_search)
    ])

    let nPages = Math.floor(total / limit);
    if (total % limit > 0) nPages++;

    const pageNumbers = [];
    for (let i = 1; i <= nPages; i++) {
        pageNumbers.push({
            value: i,
            isCurrent: +page === i
        });
    }

    let newlist = productModel.getTimeRemain(list);


    const searchName = [{ search: "", cate: "" }];

    searchName[0].search = text;
    searchName[0].cate = category_search;
    searchName[0].sortPrice = 1;

    res.render('ProductView/byCat', {
        products: newlist,
        empty: list.length === 0,
        pageNumbers,
        searchName,
        prev_page: +page - 1,
        next_page: +page + 1,
        can_go_next: +page < nPages,
        can_go_prev: +page > 1
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
        productModel.countsearchProd(text, category_search)
    ])
    let nPages = Math.floor(total / limit);
    if (total % limit > 0) nPages++;

    const pageNumbers = [];
    for (let i = 1; i <= nPages; i++) {
        pageNumbers.push({
            value: i,
            isCurrent: +page === i
        });
    };

    let newlist = productModel.getTimeRemain(list);


    const searchName = [{ search: "", cate: "" }];

    searchName[0].search = text;
    searchName[0].cate = category_search;
    searchName[0].sortDate = 1;

    res.render('ProductView/byCat', {
        products: newlist,
        empty: list.length === 0,
        pageNumbers,
        searchName,
        prev_page: +page - 1,
        next_page: +page + 1,
        can_go_next: +page < nPages,
        can_go_prev: +page > 1
    });
});
export default router;