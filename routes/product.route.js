import express from 'express';

import productModel from "../models/product.model.js";

const router = express.Router();

router.get("/", async function (req, res) {
    const top5Price = await productModel.getTop5HighestPrice();
    const top5End = await productModel.getTop5End();
    const top5Bid = await productModel.getTop5HighestBids();
    res.render('home', {
        top5Price,
        top5End,
        top5Bid
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
    }


    res.render('ProductView/byCat', {
        products: list,
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

    console.log(total);
    let nPages = Math.floor(total / limit);
    if (total % limit > 0) nPages++;

    const pageNumbers = [];
    for (let i = 1; i <= nPages; i++) {
        pageNumbers.push({
            value: i,
            isCurrent: +page === i
        });
    }
    const categoryName = await productModel.getCategoryName(catID);

    res.render('ProductView/byCat', {
        products: list,
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

    const categoryName = await productModel.getCategoryName(catID);
    categoryName[0].sortDate = 1;

    res.render('ProductView/byCat', {
        products: list,
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

    const categoryName = await productModel.getCategoryName(catID);
    categoryName[0].sortPrice = 1;

    categoryName[0].sortPrice = 1;
    console.log(categoryName);
    res.render('ProductView/byCat', {
        products: list,
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

    const productName = await productModel.getProductName(typeID);

    res.render('ProductView/byCat', {
        products: list,
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

    const productName = await productModel.getProductName(typeID);
    productName[0].sortDate = 1;

    res.render('ProductView/byCat', {
        products: list,
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

    const productName = await productModel.getProductName(typeID);

    productName[0].sortPrice = 1;

    res.render('ProductView/byCat', {
        products: list,
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
    console.log(product);
    if (product == null) {
        return res.redirect('/');
    }

    const description = await productModel.getDescription(prodID);
    const similar = await productModel.getSimilarProduct(prodID);
    const historytable = await productModel.getHistoryBid(prodID);
    res.render('ProductView/detail', {
        product,
        description,
        similar,
        historytable
    });
});


//------------------------------------ Search-----------------------------------------------



router.get("/product/search", async function (req, res) {
    const text = req.query.searchbox || 0;

    const limit = 8;
    const page = req.query.page || 1;
    const offset = (page - 1) * limit;
    const [list, total] = await Promise.all([
        productModel.searchProd(text, limit, offset),
        productModel.countsearchProd(text)
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

    const searchName = [{ search: "" }];

    searchName[0].search = text;

    res.render('ProductView/byCat', {
        products: list,
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

    const limit = 8;
    const page = req.query.page || 1;
    const offset = (page - 1) * limit;
    const [list, total] = await Promise.all([
        productModel.searchProdSortPrice(text, limit, offset),
        productModel.countsearchProd(text)
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

    const searchName = [{ search: "" }];

    searchName[0].search = text;
    searchName[0].sortPrice=1;

    res.render('ProductView/byCat', {
        products: list,
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

    const limit = 8;
    const page = req.query.page || 1;
    const offset = (page - 1) * limit;
    const [list, total] = await Promise.all([
        productModel.searchProdSortDate(text, limit, offset),
        productModel.countsearchProd(text)
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

    const searchName = [{ search: "" }];

    searchName[0].search = text;
    searchName[0].sortDate=1;

    res.render('ProductView/byCat', {
        products: list,
        empty: list.length === 0,
        pageNumbers,
        searchName,
        prev_page: +page - 1,
        next_page: +page + 1,
        can_go_next: +page < nPages,
        can_go_prev: +page > 1
    });
});
//------------------------------------ Post-----------------------------------------------

router.get('/post',function(req,res){
    res.render('ProductView/postProduct');
});
export default router;