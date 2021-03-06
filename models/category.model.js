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
  addLevel2(typeName, category) {
    return db("producttype").insert({ typeName, category });
  },
  findByCatName(catName) {
    return db("categories").where("catName", catName);
  },
  findByTypeName(typeName) {
    return db("producttype").where("typeName", typeName);
  },
  async findByCatID(catID) {
    const list = await db("categories").where("catID", catID);
    return list[0];
  },

  async findByTypeID(typeID) {
    const list = await db("producttype").where("typeID", typeID);
    return list[0];
  },

  delLevel1(catID) {
    return db("categories").where("catID", catID).del();
  },
  delLevel2InLevel1(catID) {
    return db("producttype").where("category", catID).del();
  },
  delLevel2(typeID) {
    return db("producttype").where("typeID", typeID).del();
  },

  async editLevel1(catID, catName) {
    await db("categories").where("catID", catID).update({
      catName,
    });
  },
  async editLevel2(catID, catName) {
    await db("producttype").where("typeID", catID).update({
      typeName: catName,
    });
  },
};
