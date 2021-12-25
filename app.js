import express from "express";
import morgan from "morgan";
import { engine } from "express-handlebars";
import { dirname } from "path";
import { fileURLToPath } from "url";
import numeral from "numeral";
import * as path from "path";
import { create } from "express-handlebars";

import accountRouter from "./routes/account.route.js";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(morgan("dev"));
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.engine(
  "hbs",
  engine({
    defaultLayout: "bs4.hbs",
    partialsDir: "views/partials/",
    extname: ".hbs",
    helpers:{
      format_price(val){
        return numeral(val).format('0,0');
      }
    }
  }),
);

app.use("/public", express.static("public"));

app.set("view engine", "hbs");
app.set("views", "./views");

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/detail", function (req, res) {
  res.render("ProductView/detail");
});

app.get("/profile-comment", function (req, res) {
  res.render("account/profile-comment.hbs");
});

app.get('/profile', function (req, res) {
  res.render('account/profile.hbs');
});


app.get("/admin", function (req, res) {
  res.render("admin/userManagement", { layout: "admin" });
});
app.get("/admin/userNeedUpdate", function (req, res) {
  res.render("admin/userNeedUpdate", { layout: "admin" });
});
app.get("/admin/products", function (req, res) {
  res.render("admin/productManagement", { layout: "admin" });
});
app.get("/admin/categories", function (req, res) {
  res.render("admin/categories", { layout: "admin" });
});

app.use('/account',accountRouter);

const port = 3000;
app.listen(port, function () {
  console.log(`Example app listening at http://localhost:${port}`);
});
