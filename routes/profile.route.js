import express from 'express';
import profileModel from "../models/profile.model.js";
import productModel from "../models/product.model.js";
import e from 'express';

const router = express.Router();

router.get("/:id", async function (req, res) {
    const id = req.params.id;
    const infor = await profileModel.getInforByID(id);
    const typeUser = await profileModel.checkUserType(id);
    const favoriteproducts = await profileModel.getFavoriteProd(id);
    const participateproducts = await profileModel.getParticipatingProd(id);
    const winproducts = await profileModel.getWinProd(id);
    //console.log(favoriteproducts);
    if (typeUser == "seller") {

    }
    else {
        res.render('account/profile', {
            information: infor[0],
            type: typeUser[0],
            favorite: favoriteproducts,
            participate: participateproducts,
            win: winproducts
        })
    }
});

router.post("/:id", async function (req, res) {
    const email = req.body;
    console.log(email);
});
// router.get("/comment", async function (req, res) {
//     const id = req.query.id;
//     const cmt = await getComment(id);
//     const like = await getLikeOfBidder(id);
//     const dislike = await getDislikeOfBidder(id);
//     const infor = await getInforByID(id);

//     res.render("/account/profile-comment",{
//         comment: cmt,
//         like,
//         dislike,
//         infor
//     });
// });

router.get("/:uID/comment/:prodID", async function (req, res) {
    const userID = req.params.uID || 0;
    const prodID = req.params.prodID || 0;

    const list = await productModel.findByProdID(prodID);

    res.render("account/product-comment", {
        product: list[0],
        userID
    });

});

router.post("/:uID/comment/:prodID", async function (req, res) {
    const userID = req.params.uID || 0;
    const prodID = req.params.prodID || 0;
    const content = req.body.commentwinprod;
    const type = req.body.commentType;
    const idSeller = await profileModel.getIDseller(prodID);
    console.log(userID + " " + prodID + " " + content + " " + idSeller);

    if (type == "goodcmt") {
        profileModel.bidderAddGoodRate(userID, idSeller, prodID, content);
    }
    else {
        profileModel.bidderAddBadRate(userID, idSeller, prodID, content);
    }

    const id = userID;
    const infor = await profileModel.getInforByID(id);
    const typeUser = await profileModel.checkUserType(id);
    const favoriteproducts = await profileModel.getFavoriteProd(id);
    const participateproducts = await profileModel.getParticipatingProd(id);
    const winproducts = await profileModel.getWinProd(id);

    res.render('account/profile', {
        information: infor[0],
        type: typeUser[0],
        favorite: favoriteproducts,
        participate: participateproducts,
        win: winproducts
    })


});



export default router;