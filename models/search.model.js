import db from "../utils/db.js";
export default {
  findAll() {
    // return list;

    return db.select().table("users");
  },

  async findByID(id) {
    const list = await db("users").where("uID", id);
    if (list.length === 0) return null;
    return list[0];
  },
  async findByEmail(email) {
    const list = await db("users").where("email", email);
    if (list.length === 0) return null;
    return list[0];
  },
  add(entity) {
    return db("users").insert(entity);
  },
  del(id) {
    return db("users").where("uID", id).del();
  },
  patch(entity) {
    const id = entity.CatID;
    delete entity.id;
    return db("users").where("uID", id).update(entity);
  },

  async countAllUser(name) {
    const sql = `SELECT * FROM users
    WHERE MATCH(firstName, lastName) AGAINST ('${name}');`;
    const raw = await db.raw(sql);
    return raw;
  },
  findPageUsers(name, limit, offset) {
    return db("users").limit(limit).offset(offset);
  },

  async editUser(uID, firstName, lastName, dob, hotline, address, userType) {
    await db("users").where("uID", uID).update({
      firstName,
      lastName,
      dob,
      hotline,
      address,
      userType,
    });
  },

  async approveUpgrade(uID) {
    await db("users").where("uID", uID).update({
      userType: "seller",
    });
  },

  async fullTextSearchUser(text, limit, offset) {
    const sql = `select * from users u where match(firstName) AGAINST('${text}') OR match(lastName) AGAINST('${text}') limit ${limit} offset ${offset}`;

    const raw = await db.raw(sql);
    return raw[0];
  },
};
