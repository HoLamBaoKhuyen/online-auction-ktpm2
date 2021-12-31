import express from 'express';

import productModel from "../models/product.model.js";

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


//------------------------------------ Search-----------------------------------------------



router.get("/product/search", async function (req, res) {
    const text = req.query.searchbox || 0;
    const category_search= req.query.categorySearch || 0;

    const limit = 8;
    const page = req.query.page || 1;
    const offset = (page - 1) * limit;

        const [list, total] = await Promise.all([
            productModel.searchProd(text,category_search, limit, offset),
            productModel.countsearchProd(text,category_search)
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


    const searchName = [{ search: "",cate: "" }];

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
    const category_search= req.query.categorySearch || 0;


    const limit = 8;
    const page = req.query.page || 1;
    const offset = (page - 1) * limit;
    const [list, total] = await Promise.all([
        productModel.searchProdSortPrice(text,category_search, limit, offset),
        productModel.countsearchProd(text,category_search)
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


    const searchName = [{ search: "",cate: "" }];

    searchName[0].search = text;
    searchName[0].cate = category_search;
    searchName[0].sortPrice=1;

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
    const category_search= req.query.categorySearch || 0;


    const limit = 8;
    const page = req.query.page || 1;
    const offset = (page - 1) * limit;
    const [list, total] = await Promise.all([
        productModel.searchProdSortDate(text,category_search, limit, offset),
        productModel.countsearchProd(text,category_search)
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


    const searchName = [{ search: "",cate: "" }];

    searchName[0].search = text;
    searchName[0].cate = category_search;
    searchName[0].sortDate=1;

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