import accountRouter from "../routes/account.route.js";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
export default function (app){ 
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
}