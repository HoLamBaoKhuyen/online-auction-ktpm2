import accountRouter from "../routes/account.route.js";
import adminRouter from "../routes/admin.route.js";
import productRoute from "../routes/product.route.js";
import profileRoute from "../routes/profile.route.js";
import postProductRoute from "../routes/postproduct.route.js";
import watchlistRoute from "../routes/watchlist.route.js";
import declineRoute from "../routes/decline.route.js";
import sellerRateRoute from "../routes/seller_rate.route.js";
import auth from "./auth.mdw.js";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
export default function (app) {
  // app.get("/err", function (req, res) {
  //   throw new Error("Error!");
  // });

  app.use("/account", accountRouter);
  app.use("/", productRoute);
  app.use("/", postProductRoute);
  app.use("/",auth,declineRoute);
  app.use("/profile", profileRoute);
  app.use("/admin", adminRouter);
  app.use("/mylist", auth, watchlistRoute);
  app.use("/",sellerRateRoute);

  app.use(function (req, res, next) {
    res.render("404", { layout: false });
  });

  app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.render("500", { layout: false });
  });
}
