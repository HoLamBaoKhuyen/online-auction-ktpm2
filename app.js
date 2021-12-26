import express from "express";
import morgan from "morgan";
import { engine } from "express-handlebars";
import { dirname } from "path";
import { fileURLToPath } from "url";
import numeral from "numeral";
import moment from 'moment';
import dateformat from "handlebars-dateformat";
import hbs_sections from 'express-handlebars-sections';
import session from 'express-session';
import activate_locals_middleware from './middlewares/locals.mdw.js';


import * as path from "path";

import { create } from "express-handlebars";

const __dirname = dirname(fileURLToPath(import.meta.url));
import productRoute from './routes/product.route.js';

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
      },

      ifCond(v1,v2,option){
        if(v1 == v2){
          return option.fn(this);
        }
        return option.inverse(this);
      },
      
      dateCond(v1,v2,option){
        if(v1-v2 < 0){
          return option.fn(this);
        }
        return option.inverse(this);
      },

      formatTime(date, format){
        var mmt = moment(date);
        return mmt.format(format);
      }

    }
  }),
);

app.use("/public", express.static("public"));

activate_locals_middleware(app);


app.set("view engine", "hbs");
app.set("views", "./views");

// app.get("/", function (req, res) {
//   res.render("home");
// });

// app.get("/detail", function (req, res) {
//   res.render("ProductView/detail");
// });

// app.get("/profile-comment", function (req, res) {
//   res.render("account/profile-comment");
// });

// app.get('/profile', function (req, res) {
//   res.render('account/profile');
// });

// app.get("/product/search", function (req, res) {
//   console.log(req.query.searchbox);
//   res.render('ProductView/detail');

// });

// app.get('/byCat', function (req, res) {
//   res.render('ProductView/byCat');
// });

app.use('/',productRoute);

app.get("/login", function (req, res) {
  res.render("Authentication/login", { layout: "authentication" });
});
app.get("/signup", function (req, res) {
  res.render("Authentication/signup", { layout: "authentication" });
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



const port = 3000;
app.listen(port, function () {
  console.log(`Example app listening at http://localhost:${port}`);
});
