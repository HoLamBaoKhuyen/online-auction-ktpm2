import express from "express";
import declineBidModel from "../models/declineBid.model.js";
import productModel from "../models/product.model.js";
import userModel from "../models/user.model.js";
const router = express.Router();

router.post("/declineBid", async function (req, res) {
  const proID = req.body.proDEC;
  const entity = {
    bidID: req.body.decUID,
    prodID: proID,
  };

  const prodItem = await productModel.findByProdID(proID);
  const user = await userModel.findByID(req.body.decUID);
  productModel.sendAuctionEmail(
    user.email,
    "Từ chối ra giá",
    `Bạn đã bị từ chối ra giá sản phẩm ${prodItem.prodName}`
  );

  const highest = await declineBidModel.getHighesBidder(proID);
  console.log(highest[0]);
  await declineBidModel.add(entity);
  const tmp = await declineBidModel.highestAfterDec(proID);

  if (tmp[0]) {
    let newtmp = {
      highestBidID: tmp[0].highestBidID.toString(),
      curPrice: tmp[0].curPrice.toString(),
    };
    if (tmp[0].highestBidID !== highest[0].highestBidID) {
      declineBidModel.updateHighest(newtmp, proID);
    }
  } else {
    declineBidModel.resetPrice(proID);
    declineBidModel.resetHighestBid(proID);
  }

  const link = "/detail/" + req.body.proDEC;
  res.redirect(link);
});

export default router;
