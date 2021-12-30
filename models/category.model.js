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

  findPageLevel2(catID, limit, offset) {
    return db("producttype")
      .where("category", catID)
      .limit(limit)
      .offset(offset);
  },

  async countAllLevel1() {
    const list = await db("categories").count({ amount: "*" });
    return list[0].amount;
  },

  async countAllLevel2InLevel1(level1) {
    const list = await db("producttype")
      .where("category", level1)
      .count({ amount: "*" });
    return list[0].amount;
  },

  add(catName) {
    return db("categories").insert({ catName });
  },

  findByCatName(catName) {
    return db("categories").where("catName", catName);
  },

  async findByCatID(catID) {
    const list = await db("categories").where("catID", catID);
    return list[0];
  },
};
