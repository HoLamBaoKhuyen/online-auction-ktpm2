import express from "express";

const router = express.Router();

router.get("/", function (req, res) {
  res.render("admin/userManagement", { layout: "admin" });
});
router.get("/user-update", function (req, res) {
  res.render("admin/userNeedUpdate", { layout: "admin" });
});
router.get("/products", function (req, res) {
  res.render("admin/productManagement", { layout: "admin" });
});
router.get("/categories", function (req, res) {
  res.render("admin/categories", { layout: "admin" });
});

export default router;
