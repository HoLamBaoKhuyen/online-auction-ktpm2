import { engine } from "express-handlebars";
import numeral from "numeral";
export default function (app){
    app.engine(
        "hbs",
        engine({
          defaultLayout: "bs4.hbs",
          partialsDir: "views/partials/",
          extname: ".hbs",
          helpers:{
            format_price(val){
              return numeral(val).format('0,0');
            }
          }
        }),
      );
    app.set("view engine", "hbs");
    app.set("views", "./views");

}