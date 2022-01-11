import express from "express";
import morgan from "morgan";
import { engine } from "express-handlebars";
import { dirname } from "path";
import { fileURLToPath } from "url";

import activate_locals_middleware from "./middlewares/locals.mdw.js";

import viewMdw from "./middlewares/view.mdw.js";
import routesMdw from "./middlewares/routes.mdw.js";
import sessionMdw from "./middlewares/session.mdw.js";

import nodecronMdw from "./middlewares/nodecron.mdw.js";

import dotenv from "dotenv";

import db from "./utils/db.js";

dotenv.config();

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

// nodecronMdw;
// sessionMdw(app);
// activate_locals_middleware(app);
// viewMdw(app);
// routesMdw(app);

app.listen(port, async function () {
  console.log(`Example app listening at http://localhost:${port}`);
  const temp = await db.select().table("users");
  console.log(temp);
});
