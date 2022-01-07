import db from "../utils/db.js";
export default {
  add(entity) {
    // console.log(typeof(entity.bidID));
    return db("declined").insert(entity);
  },
  async highestAfterDec(prodID) {
    const sql =
      `select pa.bidID as highestBidID, pa.price as curPrice
        from participate pa
        where pa.prodID=` +
      prodID +
      `
        and pa.bidID not in	(select d2.bidID from declined d2 where d2.prodID= pa.prodID)
        and pa.price >= ALL(select p.price from participate p  where p.prodID=pa.prodID and p.bidID not in (select d.bidID from declined d where d.prodID= pa.prodID)) `;
    const raw = await db.raw(sql);
    return raw[0];
  },
  async updateHighest(entity, proid) {
    // console.log(entity);
    return await db("products")
      .where("prodID", proid)
      .update({
        highestBidID: +entity.highestBidID,
        curPrice: +entity.curPrice,
      });
  },
  async getHighesBidder(proid) {
    const sql =
      `select p.highestBidID, p.curPrice
        from products p
        where p.prodID =` +
      proid +
      ``;

    const raw = await db.raw(sql);
    return raw[0];
  },
  async resetPrice(id) {
    const sql =
      `update products p set p.curPrice = p.originalPrice where prodID=` +
      id +
      ``;
    return await db.raw(sql);
  },
  async resetHighestBid(id) {
    const sql =
      `update products p set p.highestBidID = null where prodID=` + id + ``;
    return await db.raw(sql);
  },
};
