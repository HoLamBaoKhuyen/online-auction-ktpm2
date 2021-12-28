import express from "express";
import upgrdeModel from "../models/upgrde.model.js";
import userModel from "../models/user.model.js";

const router = express.Router();

router.get("/", async function (req, res) {
  const userList = await userModel.findAll();
  // console.log(userList);
  res.render("admin/userManagement", {
    layout: "admin",
    isAtAdminUser: true,
    isAtUserUpdate: false,
    isAtCategories: false,
    isAtProducts: false,
    userList
  });
});
router.get("/user-update", async function (req, res) {
  const userUpdateList = await upgrdeModel.findAllUserUpdate();
// console.log(userUpdateList);
  res.render("admin/userNeedUpdate", {
    layout: "admin",
    isAtAdminUser: false,
    isAtUserUpdate: true,
    isAtCategories: false,
    isAtProducts: false,
    userUpdateList
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
router.get("/products", function (req, res) {
  res.render("admin/productManagement", {
    layout: "admin",
    isAtAdminUser: false,
    isAtUserUpdate: false,
    isAtCategories: false,
    isAtProducts: true,
  });
});

export default router;
