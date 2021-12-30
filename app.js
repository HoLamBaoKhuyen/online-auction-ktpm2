import express from "express";
import morgan from "morgan";
import { engine } from "express-handlebars";
import { dirname } from "path";
import { fileURLToPath } from "url";

import activate_locals_middleware from './middlewares/locals.mdw.js';

import viewMdw from "./middlewares/view.mdw.js";
import routesMdw from "./middlewares/routes.mdw.js";

import * as path from "path";

import { create } from "express-handlebars";

const __dirname = dirname(fileURLToPath(import.meta.url));


const port = 3000;
const app = express();
app.use(morgan("dev"));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use("/public", express.static("public"));
activate_locals_middleware(app);

viewMdw(app);
routesMdw(app);



app.listen(port, function () {
  console.log(`Example app listening at http://localhost:${port}`);
});
