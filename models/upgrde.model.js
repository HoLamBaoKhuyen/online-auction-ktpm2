import db from "../utils/db.js";
export default {
  findAllUser() {
    return db("upgrde");
  },
  async findAllUserUpdate(limit, offset) {
    const sql = `select u.uID, CONCAT(u.firstName,' ',u.lastName)  as fullName, u.email, u.dob, up.reqTime from upgrde up join users u on up.bidID = u.uID order by up.reqTime asc limit ${limit} offset ${offset}`;
    const raw = await db.raw(sql);
    // console.log(raw[0]);
    return raw[0];
  },

  async countAllUserUpdate() {
    const list = await db("upgrde").count({ amount: "*" });
    return list[0].amount;
  },

  delUpgrade(uID) {
    return db("upgrde").where("bidID", uID).del();
  },
};
