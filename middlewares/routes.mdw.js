import accountRouter from "../routes/account.route.js";
import adminRouter from "../routes/admin.route.js";
import productRoute from "../routes/product.route.js";
import profileRoute from "../routes/profile.route.js";
import postProductRoute from '../routes/postproduct.route.js'
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
export default function (app) {
  // app.get("/", function (req, res) {
  //     res.render("home");
  //   });

  app.use("/account", accountRouter);
  app.use("/", productRoute);
  app.use("/",postProductRoute);
  app.use("/profile", profileRoute);
  app.use("/admin", adminRouter);
}
