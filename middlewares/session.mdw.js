import session from "express-session";
import { connectionInfo } from "../utils/db.js";
export default function (app) {
  app.set("trust proxy", 1); // trust first proxy
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        //secure: true
      },
      store: new MySqlSession({
        ...connectionInfo,
        expiration: COOKIE_MAX_AGE,
      }),
    })
  );
}
