import db from "../utils/db.js";

export default {
  findAll() {
    return db("products");
  },

  async findPageAll(limit, offset) {
    const sql =
      `select p.*, pType.typeName, concat('***** ',u.firstname) AS nameofUser,concat('***** ',u2.firstname) AS nameofSeller, count(par.prodID) AS CountBids
        from products p
        left join users u on p.highestBidID = u.UID
        left join participate par on par.prodID = p.prodID
        left join producttype pType on p.prodType = pType.typeID
        left join users u2 on p.selID = u2.UID
        group by p.prodID
                        limit ` +
      limit +
      ` offset ` +
      offset;
    const raw = await db.raw(sql);
    return raw[0];
  },

  async countAll() {
    const list = await db("products").count({ amount: "prodID" });
    return list[0].amount;
  },

  //----------------------------------------------------------------------

  async findPageByCatID(catID, limit, offset) {
    const sql =
      `select p.*, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                    from products p
                    left join users u on p.highestBidID = u.UID
                    left join participate par on par.prodID = p.prodID
                    left join producttype pt on p.prodtype = pt.typeID 
                    where pt.category = ` +
      catID +
      `
                    group by p.prodID
                    limit ` +
      limit +
      ` offset ` +
      offset;
    const raw = await db.raw(sql);
    return raw[0];
  },

  async countByCatID(catID) {
    const sql =
      `select count(p.prodID) as amount
                    from products p
                    left join producttype pt on p.prodType = pt.category
                    where pt.category = ` + catID;
    const raw = await db.raw(sql);
    return raw[0][0].amount;
  },

  async findPageByCatIDSortDate(catID, limit, offset) {
    const sql =
      `select p.*, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                    from products p
                    left join users u on p.highestBidID = u.UID
                    left join participate par on par.prodID = p.prodID
                    left join producttype pt on p.prodtype = pt.typeID 
                    where pt.category = ` +
      catID +
      `
                    group by p.prodID
                    order by p.timeEnd desc
                    limit ` +
      limit +
      ` offset ` +
      offset;
    const raw = await db.raw(sql);
    return raw[0];
  },

  async findPageByCatIDSortPrice(catID, limit, offset) {
    const sql =
      `select p.*, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                    from products p
                    left join users u on p.highestBidID = u.UID
                    left join participate par on par.prodID = p.prodID
                    left join producttype pt on p.prodtype = pt.typeID 
                    where pt.category = ` +
      catID +
      `
                    group by p.prodID
                    order by p.curPrice asc
                    limit ` +
      limit +
      ` offset ` +
      offset;
    const raw = await db.raw(sql);
    return raw[0];
  },

  //----------------------------------------------------------------------

  async countByTypeID(typeID) {
    const list = await db("products")
      .where("prodType", typeID)
      .count({ amount: "prodID" });
    return list[0].amount;
  },

  async findPageByTypeID(typeID, limit, offset) {
    const sql =
      `select p.*, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                        from products p
                        left join users u on p.highestBidID = u.UID
                        left join participate par on par.prodID = p.prodID
                        where p.prodType = ` +
      typeID +
      `
                        group by p.prodID
                        limit ` +
      limit +
      ` offset ` +
      offset;
    const raw = await db.raw(sql);
    return raw[0];
  },

  async findPageByTypeIDSortDate(typeID, limit, offset) {
    const sql =
      `select p.*, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                        from products p
                        left join users u on p.highestBidID = u.UID
                        left join participate par on par.prodID = p.prodID
                        where p.prodType = ` +
      typeID +
      `
                        group by p.prodID
                        order by p.timeEnd desc
                        limit ` +
      limit +
      ` offset ` +
      offset;
    const raw = await db.raw(sql);
    return raw[0];
  },

  async findPageByTypeIDSortPrice(typeID, limit, offset) {
    const sql =
      `select p.*, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                        from products p
                        left join users u on p.highestBidID = u.UID
                        left join participate par on par.prodID = p.prodID
                        where p.prodType = ` +
      typeID +
      `
                        group by p.prodID
                        order by p.curPrice asc
                        limit ` +
      limit +
      ` offset ` +
      offset;
    const raw = await db.raw(sql);
    return raw[0];
  },

  async findByProdID(prodID) {
    const sql =
      `select p.*,pt.*, concat('***** ',u.firstname) AS nameofUser, concat('***** ',u2.firstname) AS nameofSeller
                    from products p
                    left join producttype pt on p.prodType = pt.typeID
                    left join users u on p.highestBidID = u.UID
                    left join users u2 on p.selID = u2.UID
                    where p.prodID=` + prodID;
    const raw = await db.raw(sql);
    return raw[0];
  },

  getCategoryName(catID) {
    return db("categories").where("catID", catID);
  },

  getProductName(typeID) {
    return db("producttype").where("typeID", typeID);
  },

  getDescription(prodID) {
    return db("proddes").where("prodID", prodID).orderBy("modifyTime", "asc");
  },

  async getSimilarProduct(prodID) {
    const sql =
      `select p.*, concat('***** ',u.firstname) AS nameofUser, concat('***** ',u2.firstname) AS nameofSeller, count(par.prodID) AS CountBids
                    from products p
                    left join participate par on par.prodID = p.prodID
                    left join users u on p.highestBidID = u.UID
                    left join users u2 on p.selID = u2.UID
                    
                    where p.prodID != ` +
      prodID +
      ` and p.prodType = (SELECT p2.prodType
                                                        from products p2 
                                                        where p2.prodID = ` +
      prodID +
      `) 
                    group by p.prodID
                    order by RAND() limit 3`;
    const raw = await db.raw(sql);
    return raw[0];
  },

  async getHistoryBid(prodID) {
    const sql =
      `select pt.*, concat('***** ',u.firstname) as userName
                    from participate pt
                    left join users u on u.uID = pt.bidID
                    where pt.prodID = ` +
      prodID +
      ` order by ptime asc`;
    const raw = await db.raw(sql);
    return raw[0];
  },

  //----------------------------------------------------------------------

  async getTop5HighestPrice() {
    const sql = `select p.*, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                        from participate par
                        left join products p on par.prodID = p.prodID
                        left join users u on p.highestBidID = u.UID
                        group by par.prodID
                        order by p.curPrice DESC
                        limit 5 offset 0`;
    const raw = await db.raw(sql);
    return raw[0];
  },

  async getTop5HighestBids() {
    const sql = `select p.*, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                    from participate par
                    left join products p on par.prodID = p.prodID
                    left join users u on p.highestBidID = u.UID
                    group by par.prodID
                    order by count(par.prodID)
                    limit 5 offset 0`;

    const raw = await db.raw(sql);
    return raw[0];
  },

  async getTop5End() {
    const sql = `select p.*, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                    from participate par
                    left join products p on par.prodID = p.prodID
                    left join users u on p.highestBidID = u.UID
                    group by par.prodID
                    order by p.timeEnd ASC
                    limit 5 offset 0`;
    const raw = await db.raw(sql);
    return raw[0];
  },

  async searchProd(text, limit, offset) {
    const sql =
      `select p.*, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                    from products p
                    left join participate par on par.prodID = p.prodID
                    left join users u on p.highestBidID = u.UID
                    left join proddes pd on pd.prodID = p.prodID
                    where
                        match(p.prodName) AGAINST('` +
      text +
      `') OR
                        match(pd.des) AGAINST('` +
      text +
      `')
                    group by p.prodID
                    limit ` +
      limit +
      ` offset ` +
      offset;

    const raw = await db.raw(sql);
    return raw[0];
  },

  async countsearchProd(text) {
    const sql =
      `select count(p.prodID) as amount
                        from products p
                        left join proddes pd on pd.prodID = p.prodID
                        where
                            match(p.prodName) AGAINST('` +
      text +
      `') OR
                            match(pd.des) AGAINST('` +
      text +
      `')`;
    const raw = await db.raw(sql);
    return raw[0][0].amount;
  },

  async searchProdSortPrice(text, limit, offset) {
    const sql =
      `select p.*, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                    from products p
                    left join participate par on par.prodID = p.prodID
                    left join users u on p.highestBidID = u.UID
                    left join proddes pd on pd.prodID = p.prodID
                    where
                        match(p.prodName) AGAINST('` +
      text +
      `') OR
                        match(pd.des) AGAINST('` +
      text +
      `')
                    group by p.prodID
                    order by p.curPrice asc
                    limit ` +
      limit +
      ` offset ` +
      offset;

    const raw = await db.raw(sql);
    return raw[0];
  },

  async searchProdSortDate(text, limit, offset) {
    const sql =
      `select p.*, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                    from products p
                    left join participate par on par.prodID = p.prodID
                    left join users u on p.highestBidID = u.UID
                    left join proddes pd on pd.prodID = p.prodID
                    where
                        match(p.prodName) AGAINST('` +
      text +
      `') OR
                        match(pd.des) AGAINST('` +
      text +
      `')
                    group by p.prodID
                    order by p.timeEnd desc
                    limit ` +
      limit +
      ` offset ` +
      offset;

    const raw = await db.raw(sql);
    return raw[0];
  },
};
