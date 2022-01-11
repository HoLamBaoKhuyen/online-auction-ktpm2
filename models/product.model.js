import e from "express";
import db from "../utils/db.js";
import nodemailer from "nodemailer";
import { fromMail, transporter } from "../utils/transporter.js";

export default {
  findAll() {
    return db("products");
  },

  getTimeRemain(list) {
    for (let i = 0; i < list.length; i++) {
      const oneDay = 24 * 60 * 60 * 1000;
      const timeleft = new Date(list[i].timeEnd) - new Date();
      if (timeleft > 0) {
        const dayleft = Math.floor(timeleft / oneDay);

        var minuteleft =
          Math.floor(((timeleft % oneDay) % 3600000) / 60000) +
          Math.floor(timeleft / oneDay) * 24 * 60 +
          Math.floor((timeleft % oneDay) / 3600000) * 60;
        var hourleft = Math.floor(minuteleft / 60);

        var currentleft = new Date() - new Date(list[i].timePosted);
        var postedMinute =
          Math.round(((currentleft % oneDay) % 3600000) / 60000) +
          Math.floor(currentleft / oneDay) * 24 * 60 +
          Math.floor((currentleft % oneDay) / 3600000) * 60;

        if (postedMinute < 60) list[i].newpost = 1;

        if (dayleft >= 1 && dayleft <= 3) {
          // console.log("Day: " + dayleft);
          list[i].remain = dayleft + " ngày";
        } else if (dayleft == 0) {
          if (hourleft > 0) {
            // console.log("Hour: " + hourleft);
            list[i].remain = hourleft + " giờ";
          } else {
            // console.log("minute:" + minuteleft);
            list[i].remain = minuteleft + " phút";
          }
        } else {
          //donothing
        }
      }
    }
    return list;
  },

  async findPageAll(limit, offset) {
    const sql =
      `select p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                        from products p
                        left join users u on p.highestBidID = u.UID
                        left join participate par on par.prodID = p.prodID
                        group by p.prodID, , p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve
                        order by p.timePosted desc
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
      `select p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                    from products p
                    left join users u on p.highestBidID = u.UID
                    left join participate par on par.prodID = p.prodID
                    left join producttype pt on p.prodtype = pt.typeID 
                    where pt.category = ` +
      catID +
      `
                    group by p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve
                    order by p.timePosted desc
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
      `select p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                    from products p
                    left join users u on p.highestBidID = u.UID
                    left join participate par on par.prodID = p.prodID
                    left join producttype pt on p.prodtype = pt.typeID 
                    where pt.category = ` +
      catID +
      `
                    group by p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve
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
      `select p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                    from products p
                    left join users u on p.highestBidID = u.UID
                    left join participate par on par.prodID = p.prodID
                    left join producttype pt on p.prodtype = pt.typeID 
                    where pt.category = ` +
      catID +
      `
                    group by p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve
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
      `select p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                        from products p
                        left join users u on p.highestBidID = u.UID
                        left join participate par on par.prodID = p.prodID
                        where p.prodType = ` +
      typeID +
      `
                        group by p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve
                        order by p.timePosted desc
                        limit ` +
      limit +
      ` offset ` +
      offset;
    const raw = await db.raw(sql);
    return raw[0];
  },

  async findPageByTypeIDSortDate(typeID, limit, offset) {
    const sql =
      `select p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                        from products p
                        left join users u on p.highestBidID = u.UID
                        left join participate par on par.prodID = p.prodID
                        where p.prodType = ` +
      typeID +
      `
                        group by p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve
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
      `select p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                        from products p
                        left join users u on p.highestBidID = u.UID
                        left join participate par on par.prodID = p.prodID
                        where p.prodType = ` +
      typeID +
      `
                        group by p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve
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
      `select p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve, concat('***** ',u.firstname) AS nameofUser, concat('***** ',u2.firstname) AS nameofSeller, count(par.prodID) AS CountBids
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
                    group by p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve, u.firstname, u2.firstname
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
      ` 
                    and pt.bidID not in (select d.bidID
                                        from declined d 
                                        where d.prodID=pt.prodID)
                    order by price asc`;
    const raw = await db.raw(sql);
    return raw[0];
  },

  //----------------------------------------------------------------------

  async getTop5HighestPrice() {
    const sql = `select p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                        from participate par
                        left join products p on par.prodID = p.prodID
                        left join users u on p.highestBidID = u.UID
                        where p.timeEnd > now()
                        group by par.prodID, p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve, u.firstname
                        order by p.curPrice DESC
                        limit 5 offset 0`;
    const raw = await db.raw(sql);
    return raw[0];
  },

  async getTop5HighestBids() {
    const sql = `select p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                    from participate par
                    left join products p on par.prodID = p.prodID
                    left join users u on p.highestBidID = u.UID
                    where p.timeEnd > now()
                    group by par.prodID, p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve, u.firstname
                    order by count(par.prodID) desc
                    limit 5 offset 0`;

    const raw = await db.raw(sql);
    return raw[0];
  },

  async getTop5End() {
    const sql = `select p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve  from (select p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                    from participate par
                    left join products p on par.prodID = p.prodID
                    left join users u on p.highestBidID = u.UID
                    where p.timeEnd > now()
                    group by par.prodID, p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve, u.firstname
                    order by p.timeEnd ASC
                    limit 5 offset 0) as tab
                  order by tab.timeEnd DESC`;
    const raw = await db.raw(sql);
    return raw[0];
  },

  async searchProd(text, category_search, limit, offset) {
    let sql = "";
    if (category_search == "0") {
      sql =
        `select p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                        from products p
                        left join participate par on par.prodID = p.prodID
                        left join users u on p.highestBidID = u.UID
                        left join proddes pd on pd.prodID = p.prodID
                        where
                            match(p.prodName) AGAINST('` +
        text +
        `')
                        group by p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve, u.firstname
                        order by p.timePosted desc
                        limit ` +
        limit +
        ` offset ` +
        offset;
    } else {
      sql =
        `select p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                        from products p
                        left join participate par on par.prodID = p.prodID
                        left join users u on p.highestBidID = u.UID
                        left join proddes pd on pd.prodID = p.prodID
                        where
                            match(p.prodName) AGAINST('` +
        text +
        `') AND p.prodtype=` +
        category_search +
        ` 
                        group by p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve, u.firstname
                        order by p.timePosted desc
                        limit ` +
        limit +
        ` offset ` +
        offset;
    }
    const raw = await db.raw(sql);
    return raw[0];
  },

  async countsearchProd(text, category_search) {
    let sql = "";
    if (category_search == "0") {
      sql =
        `select count(p.prodID) as amount
                            from products p
                            left join proddes pd on pd.prodID = p.prodID
                            where
                                match(p.prodName) AGAINST('` +
        text +
        `')`;
    } else {
      sql =
        `select count(p.prodID) as amount
                        from products p
                        left join proddes pd on pd.prodID = p.prodID
                        where
                            match(p.prodName) AGAINST('` +
        text +
        `') and prodtype=` +
        category_search;
    }
    const raw = await db.raw(sql);
    return raw[0][0].amount;
  },

  async searchProdSortPrice(text, category_search, limit, offset) {
    let sql = "";
    if (category_search == "0") {
      sql =
        `select p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                        from products p
                        left join participate par on par.prodID = p.prodID
                        left join users u on p.highestBidID = u.UID
                        left join proddes pd on pd.prodID = p.prodID
                        where
                            match(p.prodName) AGAINST('` +
        text +
        `')
                        group by p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve, u.firstname
                        order by p.curPrice asc
                        limit ` +
        limit +
        ` offset ` +
        offset;
    } else {
      sql =
        `select p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                        from products p
                        left join participate par on par.prodID = p.prodID
                        left join users u on p.highestBidID = u.UID
                        left join proddes pd on pd.prodID = p.prodID
                        where
                            match(p.prodName) AGAINST('` +
        text +
        `') AND p.prodtype=` +
        category_search +
        ` 
                        group by p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve, u.firstname
                        order by p.curPrice asc
                        limit ` +
        limit +
        ` offset ` +
        offset;
    }
    const raw = await db.raw(sql);
    return raw[0];
  },

  async searchProdSortDate(text, category_search, limit, offset) {
    let sql = "";
    if (category_search == "0") {
      sql =
        `select p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                        from products p
                        left join participate par on par.prodID = p.prodID
                        left join users u on p.highestBidID = u.UID
                        left join proddes pd on pd.prodID = p.prodID
                        where
                            match(p.prodName) AGAINST('` +
        text +
        `')
                        group by p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve, u.firstname
                        order by p.timeEnd desc
                        limit ` +
        limit +
        ` offset ` +
        offset;
    } else {
      sql =
        `select p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve, concat('***** ',u.firstname) AS nameofUser, count(par.prodID) AS CountBids
                        from products p
                        left join participate par on par.prodID = p.prodID
                        left join users u on p.highestBidID = u.UID
                        left join proddes pd on pd.prodID = p.prodID
                        where
                            match(p.prodName) AGAINST('` +
        text +
        `') AND p.prodtype=` +
        category_search +
        ` 
                        group by p.prodID, p.prodName, p.prodType, p.originalPrice, p.curPrice, p.step, p.highestBidID, p.buyNowPrice, p.timePosted, p.timeEnd, p.selID, p.approve, u.firstname
                        order by p.timeEnd desc
                        limit ` +
        limit +
        ` offset ` +
        offset;
    }
    const raw = await db.raw(sql);
    return raw[0];
  },

  async checkProdOfSeller(uID, prodID) {
    const list = await db("products")
      .where("prodID", prodID)
      .andWhere("selID", uID);
    if (list.length === 0) return null;
    return list[0];
  },

  async addDesc(prodID, desc) {
    const sql = `insert into proddes values (${prodID}, concat(curDate()," ",curTime()),'${desc}')`;
    const raw = await db.raw(sql);
  },

  // --------------------Hàm đấu giá-------------------
  async checkDeclined(uID, prodID) {
    const list = await db("declined")
      .where("bidID", uID)
      .andWhere("prodID", prodID);
    if (list.length === 0) return null;
    return list[0];
  },

  async addAuction(uID, prodID, bidPrice) {
    const sql = `insert into participate value(${uID},${prodID},${bidPrice},now())`;
    const raw = await db.raw(sql);
    const sql2 = `update products set highestBidID = ${uID}, curPrice = ${bidPrice} 
                    where prodID = ${prodID}`;
    const raw2 = await db.raw(sql2);
  },

  async buyNowAuction(uID, prodID, buyNowPrice) {
    const sql = `insert into participate value(${uID},${prodID},${buyNowPrice}, now())`;
    const raw = await db.raw(sql);
    const sql2 = `update products set highestBidID = ${uID}, curPrice = ${buyNowPrice}, timeEnd = now()
                    where prodID = ${prodID}`;
    const raw2 = await db.raw(sql2);
  },

  async checkAutoAuction(prodID) {
    const list = await db("autoauction").where("prodID", prodID);
    if (list.length === 0) return null;
    return list[0];
  },

  deletefromAutoAuction(prodID) {
    return db("autoauction").where("prodID", prodID).del();
  },

  deleteUserFromAutoAuction(prodID, uID) {
    return db("autoauction")
      .where("prodID", prodID)
      .andWhere("bidID", uID)
      .del();
  },

  async addAutoAuction(bidID, prodID, price) {
    const sql = `insert into autoauction values (${bidID}, ${prodID}, ${price}, now())`;
    const raw = await db.raw(sql);
  },

  async getInforAutoAuction(prodID) {
    const sql = `select * 
                from autoauction a
                left join users u on a.bidID = u.uID
                where prodID = ${prodID}`;
    const raw = await db.raw(sql);
    return raw[0];
  },

  //-----------------Hàm cho Mail-------------------

  sendAuctionEmail(recvEmail, subject, text) {
    // console.log(recvEmail + " " + subject + " " + text);
    let transporterNodemailer = transporter;

    var mailOptions = {
      from: fromMail,
      to: recvEmail,
      subject: subject,
      text: text,
    };
    transporterNodemailer.sendMail(mailOptions, function (error, info) {
      if (error) {
        // console.log(error);
      } else {
        // console.log("Email sent: " + info.response);
      }
    });
  },

  async getEmailinProduct(prodID) {
    const sql = ` select u.email as sellerMail, u2.email as currentHighestMail
                    from products p
                    left join users u on p.SelID = u.uID
                    left join users u2 on p.highestBidID =u2.uID
                    where p.prodID = ${prodID} `;
    const raw = await db.raw(sql);
    return raw[0];
  },

  addProduct(entity) {
    return db("products").insert(entity);
  },
  async searchForDes(sellerID, proName) {
    const ret = await db("products")
      .where("prodName", proName)
      .andWhere("selID", sellerID);
    return ret[0];
  },
  async removeProduct(id) {
    return await db("products").where("prodID", id).del();
  },
};
