import express from 'express';
import profileModel from "../models/profile.model.js";

const router = express.Router();

router.get("/:id", async function (req, res) {
    const id = req.params.id;
    const infor = await profileModel.getInforByID(id);
    const typeUser = await profileModel.checkUserType(id);
    const favoriteproducts = await profileModel.getFavoriteProd(id);
    const participateproducts = await profileModel.getParticipatingProd(id);
    const winproducts = await profileModel.getWinProd(id);
    console.log(favoriteproducts);
    if (typeUser == "seller"){

    }
    else{
        res.render('account/profile',{
            information: infor[0],
            type: typeUser[0],
            favorite: favoriteproducts,
            participate: participateproducts,
            win: winproducts
        })
    }
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


export default router;