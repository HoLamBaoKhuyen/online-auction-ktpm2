import profileModel from "../models/profile.model.js";

const router = express.Router();

router.get("/", async function (req, res) {
    id = req.query.id;
    const infor = await getInforByID(id);
    const typeUser = await checkUserType(id);
    const favoriteproducts = await getFavoriteProd(id);
    const participateproducts = await getParticipatingProd(id);
    if (typeUser == "seller"){

    }
    else{
        res.render(/account/profile,{
            information: infor,
            type: typeUser,
            favorite: favoriteproducts,
            participate: participateproducts
        })
    }
});

router.get("/comment", async function (req, res) {
    id = req.query.id;
    const cmt = await getComment(id);
    const like = await getLikeOfBidder(id);
    const dislike = await getDislikeOfBidder(id);
    const infor = await getInforByID(id);

    res.render("/account/profile-comment",{
        comment: cmt,
        like,
        dislike,
        infor
    });
});


export default router;