import session from "express-session";
import mySqlSessionStore from "express-mysql-session";
import { connectionInfo } from "../utils/db.js";
export default function (app) {
  const MySqlSession = mySqlSessionStore(session);

  app.set("trust proxy", 1); // trust first proxy
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: new MySqlSession({
        ...connectionInfo,
        expiration: COOKIE_MAX_AGE,
      }),
    })
  );
}
