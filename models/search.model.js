import db from "../utils/db.js";
export default {
  //user
  async countAllUser(name) {
    const sql = `SELECT * FROM users
    WHERE MATCH(firstName, lastName) AGAINST ('${name}');`;
    const raw = await db.raw(sql);
    return raw[0].length;
  },

  async fullTextSearchUser(text, limit, offset) {
    const sql = `select * from users u where match(firstName) AGAINST('${text}') OR match(lastName) AGAINST('${text}') limit ${limit} offset ${offset}`;

    const raw = await db.raw(sql);
    return raw[0];
  },

  //user-update
  async countAllUserUpdate(name) {
    const sql = `SELECT * FROM upgrde up join users u on up.bidID = u.uID
    WHERE MATCH(firstName, lastName) AGAINST ('${name}');`;
    const raw = await db.raw(sql);
    return raw[0].length;
  },

  async findAllUserUpdate(name, limit, offset) {
    const sql = `select u.uID, CONCAT(u.firstName,' ',u.lastName)  as fullName, u.email, u.dob, up.reqTime 
    from upgrde up
    join users u on up.bidID = u.uID
    where match(firstName) against ("${name}") or match(lastName) against ("${name}")
    order by up.reqTime asc 
    limit ${limit} 
    offset ${offset}`;
    const raw = await db.raw(sql);
    // console.log(raw[0]);
    return raw[0];
  },

  //search level1
  async countAllLevel1(name) {
    const sql = `SELECT * FROM categories
    WHERE MATCH(catName) AGAINST ('${name}');`;
    const raw = await db.raw(sql);
    return raw[0].length;
  },

  async findPageLevel1(name, limit, offset) {
    const sql = `select * from categories
    where match(catName) against ("${name}")
    limit ${limit} 
    offset ${offset}`;
    const raw = await db.raw(sql);
    // console.log(raw[0]);
    return raw[0];
  },

  //search level 2
  async countAllLevel2InLevel1(name, level1) {
    const sql = ` SELECT * FROM producttype p left join categories c on p.category = c.catID
    WHERE c.catID = ${level1} and MATCH(typeName) AGAINST ('${name}')`;
    const raw = await db.raw(sql);
    return raw[0].length;
  },
  async findPageLevel2(name, catID, limit, offset) {
    const sql = `SELECT * FROM producttype p left join categories c on p.category = c.catID
    WHERE c.catID = ${catID} and MATCH(typeName) AGAINST ('${name}')
    limit ${limit} 
    offset ${offset}`;
    const raw = await db.raw(sql);
    // console.log(raw[0]);
    return raw[0];
  },

  //product

  async countAllProducts(name) {
    const sql = `select p.prodID from products p
        left join users u on p.highestBidID = u.UID
        left join participate par on par.prodID = p.prodID
        left join producttype pType on p.prodType = pType.typeID
        left join users u2 on p.selID = u2.UID
        where match(p.prodName) against ('${name}') or match(pType.typeName) against('${name}')
        group by p.prodID`;
    const raw = await db.raw(sql);
    return raw[0].length;
  },

  async findPageAll(name, limit, offset) {
    const sql = `select p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve, pType.typeName, concat('***** ',u.firstname) AS nameofUser,concat('***** ',u2.firstname) AS nameofSeller, count(par.prodID) AS CountBids
        from products p
        left join users u on p.highestBidID = u.UID
        left join participate par on par.prodID = p.prodID
        left join producttype pType on p.prodType = pType.typeID
        left join users u2 on p.selID = u2.UID
        where match(p.prodName) against ('${name}') or match(pType.typeName) against('${name}')
        group by p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve, pType.typeName limit ${limit} offset ${offset}`;
    const raw = await db.raw(sql);
    return raw[0];
  },
};
