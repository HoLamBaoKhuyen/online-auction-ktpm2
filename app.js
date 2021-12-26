import express from "express";
import morgan from "morgan";
import viewMdw from "./middlewares/view.mdw.js";
import routesMdw from "./middlewares/routes.mdw.js";

import * as path from "path";
import { create } from "express-handlebars";



const port = 3000;
const app = express();
app.use(morgan("dev"));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use("/public", express.static("public"));
viewMdw(app);
routesMdw(app);



app.listen(port, function () {
  console.log(`Example app listening at http://localhost:${port}`);
});
