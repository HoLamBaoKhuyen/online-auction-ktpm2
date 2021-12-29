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

  async countAllUser() {
    const list = await db("users").count({ amount: "*" });
    return list[0].amount;
  },
  findPageUsers(limit, offset) {
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
};
