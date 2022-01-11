import express from "express";
import moment from "moment";
import declineBidModel from "../models/declineBid.model.js";
import productModel from "../models/product.model.js";
import ratingModel from "../models/rating.model.js";
import userModel from "../models/user.model.js";
import { fromMail } from "../utils/transporter.js";
import { transporter } from "../utils/transporter.js";
const router = express.Router();

router.post("/declineBid", async function (req, res) {
  const proID = req.body.proDEC;
  const entity = {
    bidID: req.body.decUID,
    prodID: proID,
  };

  const prodItem = await productModel.findByProdID(proID);

  const user = await userModel.findByID(req.body.decUID);
  console.log(user);
  // productModel.sendAuctionEmail(
  //   user.email,
  //   "Từ chối ra giá",
  //   `Bạn đã bị từ chối ra giá sản phẩm ${prodItem[0].prodName}`
  // );

  const data = {
    from: fromMail,
    to: user.email,
    subject: "Từ chối ra giá",
    html:
      "<h3> Bạn đã bị từ chối ra giá sản phẩm" + prodItem[0].prodName + "</h3>",
  };
  try {
    let err = await transporter.sendMail(data);
  } catch {}
  const highest = await declineBidModel.getHighesBidder(proID);
  await declineBidModel.add(entity);
  const tmp = await declineBidModel.highestAfterDec(proID);
  await productModel.deleteUserFromAutoAuction(proID, req.body.decUID);

  if (
    moment(prodItem[0].timeEnd).isBefore(moment()) &&
    highest[0].highestBidID == req.body.decUID
  ) {
    await autoSendBadRate(req.body.decUID, proID, req.session.authUser.uID);
  }

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
async function autoSendBadRate(id, prodid, userID) {
  const content = "Người thắng không thanh toán";
  await ratingModel.sellerAddBadRate(id, userID, prodid, content);
}
export default router;
