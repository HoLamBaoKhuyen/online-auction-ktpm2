import accountRouter from "../routes/account.route.js";
import adminRouter from "../routes/admin.route.js";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
export default function (app) {
  // app.get("/", function (req, res) {
  //     res.render("home");
  //   });

  //   app.get("/detail", function (req, res) {
  //     res.render("ProductView/detail");
  //   });

  //   app.get("/profile-comment", function (req, res) {
  //     res.render("account/profile-comment.hbs");
  //   });

  //   app.get('/profile', function (req, res) {
  //     res.render('account/profile.hbs');
  //   });

  app.use("/admin", adminRouter);

  app.use("/account", accountRouter);
}
