import db from "../utils/db.js";
export default {
  findAllLevel1() {
    return db("categories");
  },

  findAllLevel2() {
    return db("producttype");
  },

  findLevel2(level1) {
    return db("producttype").where("category", level1);
  },

  findPageLevel1(limit, offset) {
    return db("categories").limit(limit).offset(offset);
  },

  async countAllLevel1() {
    const list = await db("categories").count({ amount: "*" });
    return list[0].amount;
  },
};
