import db from "../utils/db.js";
export default {
  findAllUser() {
    return db("upgrde");
  },
  async findAllUserUpdate(limit, offset) {
    const sql = `select u.uID, CONCAT(u.firstName,' ',u.lastName)  as fullName, u.email, u.dob, up.reqTime from upgrde up join users u on up.bidID = u.uID limit ${limit} offset ${offset}`;
    const raw = await db.raw(sql);
    // console.log(raw[0]);
    return raw[0];
  },

  async countAllUser() {
    const list = await db("users").count({ amount: "*" });
    return list[0].amount;
  },
  async countAllUserUpdate() {
    const list = await db("upgrde").count({ amount: "*" });
    return list[0].amount;
  },
};
