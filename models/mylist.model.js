import db from "../utils/db.js";

export default {
  async countParticipatingProd(id) {
    const sql = `select p.*, concat('***** ',u.firstname) AS nameofUser, par.*
                    from products p
                    left join users u on p.highestBidID = u.UID
                    left join participate par on par.prodID = p.prodID
                    where par.bidID = ${id} group by p.prodID`;
    const raw = await db.raw(sql);
    return raw[0].length;
  },
  async getParticipatingProdPage(limit, offset, id) {
    const sql = `select p.*, concat('***** ',u.firstname) AS nameofUser, par.*
                        from products p
                        left join users u on p.highestBidID = u.UID
                        left join participate par on par.prodID = p.prodID
                        where par.bidID = ${id} group by p.prodID limit ${limit} offset ${offset}`;
    const raw = await db.raw(sql);
    return raw[0];
  },

  async countWinProd(id) {
    const sql = `select p.*, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                    from products p
                    left join users u on p.highestBidID = u.UID
                    left join participate par on par.prodID = p.prodID
                    where p.highestBidID= ${id} and p.timeEnd < curdate()
                    group by p.prodID;`;
    const raw = await db.raw(sql);
    return raw[0].length;
  },
  async getWinProdPage(limit, offset, id) {
    const sql = `select p.*, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                        from products p
                        left join users u on p.highestBidID = u.UID
                        left join participate par on par.prodID = p.prodID
                        where p.highestBidID= ${id} and p.timeEnd < curdate()
                        group by p.prodID  limit ${limit} offset ${offset};`;
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
    const sql = `select p.* from products p
    where timeEnd > now() and p.selID = ${id} limit ${limit} offset ${offset};`;
    const raw = await db.raw(sql);
    return raw[0];
  },
};
