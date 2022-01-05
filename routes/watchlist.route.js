import express from "express";
import userModel from "../models/user.model.js";
import watchlistModel from "../models/watchlist.model.js";

const router = express.Router();
router.get('/', function(req,res){
    res.render('/ProductView/watchlist');
});
router.post('/edit',async function (req,res){
    const item = {
        bidID: req.body.uid,
        prodID: req.body.id
    };
    const ret = await watchlistModel.findByUidProID(item.bidID,item.prodID);
    if (ret===null){
        await watchlistModel.add(item);
    }
    else{
       await watchlistModel.remove(item.bidID,item.prodID);
    }
    res.redirect(req.headers.referer);
    
});



export default router;