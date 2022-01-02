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

    for (let i = 0; i < participateproducts.length; i++) {
        participateproducts[i].CountBids = await profileModel.countBids(participateproducts[i].prodID);
    }

    let newlistfavorite = productModel.getTimeRemain(favoriteproducts);
    let newlistparticipate = productModel.getTimeRemain(participateproducts);

    if (typeUser == "seller") {

    }
    else {
        res.render('account/profile', {
            information: infor[0],
            type: typeUser[0],
            favorite: newlistfavorite,
            participate: newlistparticipate,
            win: winproducts
        })
    }
});

router.post("/:id", async function (req, res) {
    const email = req.body;
    console.log(email);
});



router.get("/:uID/comment/:prodID", async function (req, res) {
    const userID = req.params.uID || 0;
    const prodID = req.params.prodID || 0;

    const list = await productModel.findByProdID(prodID);
    const check = await profileModel.checkExistRating(userID, prodID);

    res.render("account/product-comment", {
        product: list[0],
        userID,
        existRate: check
    });

});


router.post("/:uID/comment/:prodID", async function (req, res) {
    const userID = req.params.uID || 0;
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
            error_message: 'Vui lòng nhập vào ô đánh giá'
        });
    }
    else {

        if (type == "goodcmt") {
            profileModel.bidderAddGoodRate(userID, idSeller, prodID, content);
        }
        else {
            profileModel.bidderAddBadRate(userID, idSeller, prodID, content);
        }

        res.redirect('/profile/'+userID);
    }
});

router.get("/profile-comment/:id", async function (req, res) {
    const id = req.params.id || 0;

    const information = await profileModel.getInforByID(id);
    const comment = await profileModel.getComment(id);
    const likeRate = await profileModel.getLikeOfBidder(id);
    const dislikeRate = await profileModel.getDislikeOfBidder(id);


    res.render("account/profile-comment", {
        comment,
        likeRate,
        dislikeRate,
        infor: information[0]
    });
});

router.post('/deleteFavo/:delID',async function(req,res){
    const delID = req.params.delID;
    profileModel.deleteFavoriteProd(res.locals.authUser.uID,delID);
    res.redirect('/profile/'+ res.locals.authUser.uID);
});


export default router;