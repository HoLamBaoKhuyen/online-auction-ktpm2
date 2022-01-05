import express from "express";
import userModel from "../models/user.model.js";
import watchlistModel from "../models/watchlist.model.js";

const router = express.Router();

router.post('/edit',async function (req,res){
    console.log(req.body);
    const item = {
        bidID: req.body.uid,
        prodID: req.body.id
    };
    if (req.body.in==='0'){
        await watchlistModel.add(item);
    }
    else{
       await watchlistModel.remove(item.bidID,item.prodID);
    }
    res.redirect(req.headers.referer);
});



export default router;