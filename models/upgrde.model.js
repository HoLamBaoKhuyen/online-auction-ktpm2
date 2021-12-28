import db from "../utils/db.js";
export default {
  findAllUser() {
    return db("upgrde");
  },
 async findAllUserUpdate() {
    const sql = `select u.uID, CONCAT(u.firstName,' ',u.lastName)  as fullName, u.email, u.dob, up.reqTime from upgrde up join users u on up.bidID = u.uID`;
    const raw = await db.raw(sql);
    // console.log(raw[0]);
    return raw[0];
    },
 
};
