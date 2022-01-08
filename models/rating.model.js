import db from "../utils/db.js"
export default {
    async sellerAddGoodRate(uid, idseller, prodID, comment) {
        const sql = `insert into rating values (` + uid + `,` + idseller + `,` + prodID + `, true, true,'` + comment + `')`;
        const raw = await db.raw(sql);
    },

    async sellerAddBadRate(uid, idseller, prodID, comment) {
        const sql = `insert into rating values (` + uid + `,` + idseller + `,` + prodID + `, false, true,'` + comment + `')`;
        const raw = await db.raw(sql);
    },
    async getBidProdRate(id) {
        const sql = `select r.* , concat(u.firstName,' ' ,u.lastName) as userName
        from rating r left join users u on r.bidID = u.uID
        where r.prodID =`+ id + ` and rateToBidder=false;`;
        const raw = await db.raw(sql);
        return raw[0];
    },
  
}