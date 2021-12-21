import productModel from "../models/product.model";

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
    for (const c of res.locals.categories) {
        if (c.id === +typeID) {
            c.isActive = true;
            break;
        }
    }
    const limit = 10;
    const page = req.query.page || 1;
    const offset = (page - 1) * limit;
    const [list, total] = await Promise.all([
        productModel.findPageAll(limit, offset),
        productModel.countAll()
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

    res.render('vwProduct/byCat', {
        products: list,
        empty: list.length === 0,
        pageNumbers,
        prev_page: +page - 1,
        next_page: +page + 1,
        can_go_next: +page < nPages,
        can_go_prev: +page > 1
    });
});

router.get("/byCat/:catID", async function (req, res) {
    const catID = req.params.catID || 0;

    const limit = 10;
    const page = req.query.page || 1;
    const offset = (page - 1) * limit;
    const [list, total] = await Promise.all([
        productModel.findPageByCatID(catID, limit, offset),
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

router.get("/byCat/:prodType", async function (req, res) {
    const prodType = req.params.prodType || 0;

    const limit = 10;
    const page = req.query.page || 1;
    const offset = (page - 1) * limit;
    const [list, total] = await Promise.all([
        productModel.findPageByProdType(prodType, limit, offset),
        productModel.countByProdType(prodType)
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

router.get("/byCat/sortDate/:prodType", async function (req, res) {
    const prodType = req.params.prodType || 0;

    const limit = 10;
    const page = req.query.page || 1;
    const offset = (page - 1) * limit;
    const [list, total] = await Promise.all([
        productModel.findPageByProdTypeSortDate(prodType, limit, offset),
        productModel.countByProdType(prodType)
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

router.get("/byCat/sortPrice/:prodType", async function (req, res) {
    const prodType = req.params.prodType || 0;

    const limit = 10;
    const page = req.query.page || 1;
    const offset = (page - 1) * limit;
    const [list, total] = await Promise.all([
        productModel.findPageByProdTypeSortPrice(prodType, limit, offset),
        productModel.countByProdType(prodType)
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


router.get("/detail/:prodid", async function (req, res) {
    const prodID = req.params.prodid;
    const product = await productModel.findByProdID(prodID);
    if (product == null) {
        return res.redirect('/');
    }

    const description = await productModel.getDescription(prodID);
    const similar = await productModel.getSimilarProduct(prodID);
    res.render('ProductView/detail', {
        product,
        description,
        similar
    });
});


router.post("/product/search", function (req, res) {
    console.log(req.body.searchbox);
    res.render('ProductView/',{

    })
  });

export default router;