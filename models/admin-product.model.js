import db from "../utils/db.js";
export default {
  delInProducts(prodID) {
    return db("products").where("prodID", prodID).del();
  },
  delInRating(prodID) {
    return db("rating").where("prodID", prodID).del();
  },
  delInDeclined(prodID) {
    return db("declined").where("prodID", prodID).del();
  },
  delInFavorite(prodID) {
    return db("favoriteproducts").where("prodID", prodID).del();
  },
  delInPaticipate(prodID) {
    return db("participate").where("prodID", prodID).del();
  },
  delInProddes(prodID) {
    return db("proddes").where("prodID", prodID).del();
  },
};
