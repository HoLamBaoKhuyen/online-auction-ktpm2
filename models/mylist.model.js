import db from "../utils/db.js";

export default {
  async countParticipatingProd(id) {
    const sql = `select p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve, concat('***** ',u.firstname) AS nameofUser, par.bidID, par.prodID, par.price, par.ptime
                    from products p
                    left join users u on p.highestBidID = u.UID
                    left join participate par on par.prodID = p.prodID
                    where par.bidID = ${id} group by p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve, u.firstname, par.bidID, par.prodID, par.price, par.ptime`;
    const raw = await db.raw(sql);
    return raw[0].length;
  },
  async getParticipatingProdPage(limit, offset, id) {
    const sql = `select p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve, concat('***** ',u.firstname) AS nameofUser, par.bidID, par.prodID, par.price, par.ptime, count(par.prodID) AS CountBids
                        from products p
                        left join users u on p.highestBidID = u.UID
                        left join participate par on par.prodID = p.prodID
                        where par.bidID = ${id} group by p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve, u.firstname, par.bidID, par.prodID, par.price, par.ptime limit ${limit} offset ${offset}`;
    const raw = await db.raw(sql);
    return raw[0];
  },

  async countWinProd(id) {
    const sql = `select p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                    from products p
                    left join users u on p.highestBidID = u.UID
                    left join participate par on par.prodID = p.prodID
                    where p.highestBidID= ${id} and p.timeEnd < now()
                    group by p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve, u.firstname;`;
    const raw = await db.raw(sql);
    return raw[0].length;
  },
  async getWinProdPage(limit, offset, id) {
    const sql = `select p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                        from products p
                        left join users u on p.highestBidID = u.UID
                        left join participate par on par.prodID = p.prodID
                        where p.highestBidID= ${id} and p.timeEnd < now()
                        group by p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve, u.firstname  limit ${limit} offset ${offset};`;
    const raw = await db.raw(sql);
    return raw[0];
  },

  async countPostProd(id) {
    const sql = `select p.* from products p
    where timeEnd > now() and p.selID = ${id}`;
    const raw = await db.raw(sql);
    return raw[0].length;
  },
  async getPostProdPage(limit, offset, id) {
    // const sql = `select p.* from products p
    // where timeEnd > now() and p.selID = ${id} limit ${limit} offset ${offset};`;

    const sql =`select p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve , concat('***** ',u.firstname) AS nameofUser, count(pa.prodID) AS CountBids
    from products p left join users u  on p.highestBidID = u.uID
    left join participate pa on p.prodID = pa.prodID
    where timeEnd > now() and p.selID = ${id} 
    group by p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve, u.firstname limit ${limit} offset ${offset};` ;
    const raw = await db.raw(sql);
    return raw[0];
  },

  async countEndedProd(id){
      const sql =`select p.*
      from products p 
      where p.prodID=`+id+` and p.timeEnd < now();`;
      const ret= await db.raw(sql);
      return ret[0].length;
  },
  async getEndedProdPage(limit,offset,id){
      const sql = `select p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve , concat('***** ',u.firstname) AS nameofUser, count(pa.prodID) AS CountBids
      from products p left join users u  on p.highestBidID = u.uID
      left join participate pa on p.prodID = pa.prodID
      where   p.timeEnd < now() and p.highestBidID is not null
      and p.selID = ${id}
      group by p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve, u.firstname limit ${limit} offset ${offset};`;
      const raw = await db.raw(sql);
      return raw[0];
  },
};
