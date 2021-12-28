import express from "express";
import upgrdeModel from "../models/upgrde.model.js";
const router = express.Router();

router.get("/", function (req, res) {
  res.render("admin/userManagement", {
    layout: "admin",
    isAtAdminUser: true,
    isAtUserUpdate: false,
    isAtCategories: false,
    isAtProducts: false,
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
