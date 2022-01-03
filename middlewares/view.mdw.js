import { engine } from "express-handlebars";
import numeral from "numeral";
import hbs_sections from "express-handlebars-sections";
import moment from "moment";

export default function (app) {
  app.engine(
    "hbs",
    engine({
      defaultLayout: "bs4.hbs",
      partialsDir: "views/partials/",
      extname: ".hbs",
      helpers: {
        format_price(val) {
          return numeral(val).format("0,0");
        },
        section: hbs_sections(),

        ifCond(v1, v2, option) {
          if (v1 == v2) {
            return option.fn(this);
          }
          return option.inverse(this);
        },

        dateCond(v1, v2, option) {
          if (v1 - v2 < 0) {
            return option.fn(this);
          }
          return option.inverse(this);
        },

        formatTime(date, format) {
          var mmt = moment(date);
          return mmt.format(format);
        },

        concatName(firstName, lastName) {
          var fullName = firstName + " " + lastName;
          return fullName;
        },
        isSeller(type) {
          if (type === "seller") return true;
          return false;
        },
      },
    })
  );
  app.set("view engine", "hbs");
  app.set("views", "./views");
}
