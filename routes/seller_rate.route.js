import express from "express";
import auth from "../middlewares/auth.mdw.js";
import ratingModel from "../models/rating.model.js";
const router = express.Router();

router.post('/rateBidder/:proID/:bidID',auth,async function(req,res){
    const userID = res.locals.authUser.uID;
    const winID= req.params.bidID;
    const prodID= req.params.proID;
    const content = req.body.commentwinprod;
    const type = req.body.commentType;
        if (type == "goodcmt") {
            ratingModel.sellerAddGoodRate(winID,userID,prodID,content);
        } else {
            ratingModel.sellerAddBadRate(winID,userID,prodID,content);
        }
        const url = "/detail/"+prodID;
        res.redirect(url||"/");
      
});


export default router;