import express from "express";
import bcrypt from "bcryptjs";
import upgrdeModel from "../models/upgrde.model.js";
import userModel from "../models/user.model.js";
import productModel from "../models/product.model.js";
import categoryModel from "../models/category.model.js";
import adminProductModel from "../models/admin-product.model.js";

const router = express.Router();

router.get("/", async function (req, res) {
  // console.log(userList);

  const limit = 6;
  const page = +req.query.page || 1;
  const offset = (page - 1) * limit;

  const total = await userModel.countAllUser();
  let nPages = Math.floor(total / limit);
  if (total % limit > 0) nPages++;

  const pageNumbers = [];
  for (let i = 1; i <= nPages; i++) {
    pageNumbers.push({
      value: i,
      isCurrent: +page === i,
    });
  }
  const userList = await userModel.findPageUsers(limit, offset);
  res.render("admin/userManagement", {
    layout: "admin",
    isAtAdminUser: true,
    isAtUserUpdate: false,
    isAtCategories: false,
    isAtProducts: false,
    userList,
    pageNumbers,
  });
});
router.post("/", async function (req, res) {
  const rawPassword = req.body.psword;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(rawPassword, salt);
  const user = {
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    psword: hash,
    dob: req.body.dob,
    hotline: req.body.hotline,
    address: req.body.address,
    userType: req.body.userType,
  };
  await userModel.add(user);
  res.redirect(req.headers.referer);
});

router.post("/delete-user", async function (req, res) {
  const uID = req.body.uID;

  await userModel.del(uID);
  await upgrdeModel.delUpgrade(uID);

  res.redirect(req.headers.referer);
});
router.get("/edit-user", async function (req, res) {
  const uID = req.query.uID || 0;
  const user = await userModel.findByID(uID);
  // console.log(user);
  res.render("admin/edit-user", {
    layout: "admin",
    isAtAdminUser: true,
    isAtUserUpdate: false,
    user,
  });
});
router.post("/edit-user", async function (req, res) {
  const uID = req.query.uID || 0;

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const dob = req.body.dob;
  const hotline = req.body.hotline;
  const address = req.body.address;
  const userType = req.body.userType;
  // console.log(userType);
  await userModel.editUser(
    uID,
    firstName,
    lastName,
    dob,
    hotline,
    address,
    userType
  );
  const user = await userModel.findByID(uID);
  // console.log(user);
  res.render("admin/edit-user", {
    layout: "admin",
    isAtAdminUser: true,
    isAtUserUpdate: false,
    user,
  });
});

router.get("/user-update", async function (req, res) {
  const limit = 7;
  const page = +req.query.page || 1;
  const offset = (page - 1) * limit;

  const total = await upgrdeModel.countAllUserUpdate();
  // console.log(total);
  let nPages = Math.floor(total / limit);
  if (total % limit > 0) nPages++;

  const pageNumbers = [];
  for (let i = 1; i <= nPages; i++) {
    pageNumbers.push({
      value: i,
      isCurrent: +page === i,
    });
  }

  const userUpdateList = await upgrdeModel.findAllUserUpdate(limit, offset);
  // console.log(userUpdateList);
  res.render("admin/userNeedUpdate", {
    layout: "admin",
    isAtAdminUser: false,
    isAtUserUpdate: true,
    isAtCategories: false,
    isAtProducts: false,
    userUpdateList,
    pageNumbers,
  });
});
router.post("/user-update/approve", async function (req, res) {
  const uID = req.body.uID || 0;
  console.log(uID);

  await userModel.approveUpgrade(uID);
  await upgrdeModel.delUpgrade(uID);

  res.redirect(req.headers.referer);
});
router.post("/user-update/decline", async function (req, res) {
  const uID = req.body.uID || 0;
  // console.log(uID);
  await upgrdeModel.delUpgrade(uID);

  res.redirect(req.headers.referer);
});
router.get("/categories", async function (req, res) {
  const limit = 6;
  const page = +req.query.page || 1;
  const offset = (page - 1) * limit;

  const total = await categoryModel.countAllLevel1();
  // console.log(total);
  let nPages = Math.floor(total / limit);
  if (total % limit > 0) nPages++;

  const pageNumbers = [];
  for (let i = 1; i <= nPages; i++) {
    pageNumbers.push({
      value: i,
      isCurrent: +page === i,
    });
  }
  const categoryList = await categoryModel.findPageLevel1(limit, offset);
  console.log(categoryList);

  res.render("admin/cate-lv1", {
    layout: "admin",
    isAtAdminUser: false,
    isAtUserUpdate: false,
    isAtCategories: true,
    isAtProducts: false,
    pageNumbers,
    categoryList,
  });
});
router.post("/categories", async function (req, res) {
  const catName = req.body.catName;

  await categoryModel.add(catName);

  res.redirect(req.headers.referer);
});
router.get("/categories/is-available", async function (req, res) {
  const catName = await categoryModel.findByCatName(req.query.catName);
  // console.log(catName);
  if (catName.length === 0) {
    return res.json(true);
  }
  res.json(false);
});

router.get("/categories/detail/byCat/:catID", async function (req, res) {
  const catID = req.params.catID || 0;

  const limit = 6;
  const page = +req.query.page || 1;
  const offset = (page - 1) * limit;

  const total = await categoryModel.countAllLevel2InLevel1(catID);
  // console.log(total);
  let nPages = Math.floor(total / limit);
  if (total % limit > 0) nPages++;

  const pageNumbers = [];
  for (let i = 1; i <= nPages; i++) {
    pageNumbers.push({
      value: i,
      isCurrent: +page === i,
    });
  }
  const level1 = await categoryModel.findByCatID(catID);
  const level2List = await categoryModel.findPageLevel2(catID, limit, offset);
  // console.log(level2List);

  res.render("admin/cate-lv2", {
    layout: "admin",
    isAtAdminUser: false,
    isAtUserUpdate: false,
    isAtCategories: true,
    isAtProducts: false,
    pageNumbers,
    level1,
    level2List,
  });
});
router.post("/categories", async function (req, res) {
  const catName = req.body.catName;

  await categoryModel.add(catName);

  res.redirect(req.headers.referer);
});
router.get("/categories/is-available", async function (req, res) {
  const catName = await categoryModel.findByCatName(req.query.catName);
  // console.log(catName);
  if (catName.length === 0) {
    return res.json(true);
  }
  res.json(false);
});

router.get("/products", async function (req, res) {
  const limit = 6;
  const page = +req.query.page || 1;
  const offset = (page - 1) * limit;

  const total = await productModel.countAll();
  // console.log(total);
  let nPages = Math.floor(total / limit);
  if (total % limit > 0) nPages++;

  const pageNumbers = [];
  for (let i = 1; i <= nPages; i++) {
    pageNumbers.push({
      value: i,
      isCurrent: +page === i,
    });
  }
  const productList = await productModel.findPageAll(limit, offset);
  console.log(productList);

  res.render("admin/productManagement", {
    layout: "admin",
    isAtAdminUser: false,
    isAtUserUpdate: false,
    isAtCategories: false,
    isAtProducts: true,
    productList,
    pageNumbers,
  });
});

router.post("/products/delete", async function (req, res) {
  const prodID = req.body.prodID;
  // console.log(prodID);
  await adminProductModel.delInProducts(prodID);
  await adminProductModel.delInRating(prodID);
  await adminProductModel.delInDeclined(prodID);
  await adminProductModel.delInFavorite(prodID);
  await adminProductModel.delInPaticipate(prodID);
  await adminProductModel.delInProddes(prodID);

  res.redirect(req.headers.referer);
});

export default router;
