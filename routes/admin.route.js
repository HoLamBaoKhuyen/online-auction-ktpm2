import express from "express";
import upgrdeModel from "../models/upgrde.model.js";
import userModel from "../models/user.model.js";
import productModel from "../models/product.model.js";

const router = express.Router();

router.get("/", async function (req, res) {
  // console.log(userList);

  const limit = 7;
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
router.get("/categories", function (req, res) {
  res.render("admin/categories", {
    layout: "admin",
    isAtAdminUser: false,
    isAtUserUpdate: false,
    isAtCategories: true,
    isAtProducts: false,
  });
});
router.get("/products", async function (req, res) {
  const limit = 7;
  const page = +req.query.page || 1;
  const offset = (page - 1) * limit;

  const total = await productModel.countAll();
  console.log(total);
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
  // console.log(userUpdateList);

  res.render("admin/productManagement", {
    layout: "admin",
    isAtAdminUser: false,
    isAtUserUpdate: false,
    isAtCategories: false,
    isAtProducts: true,
    productList,
    pageNumbers
  });
});

export default router;
