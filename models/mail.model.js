import db from "../utils/db.js";
import { fromMail, transporter } from "../utils/transporter.js";
export default {
  //-----------------Hàm cho Mail-------------------
  sendAuctionEmail(recvEmail, subject, text) {
    // console.log(recvEmail + " " + subject + " " + text);

    var mailOptions = {
      from: fromMail,
      to: recvEmail,
      subject: subject,
      text: text,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  },

  async getListEmailSeller() {
    const sql = `select * from products p left join users u on p.selID=u.uID
    where p.timeEnd between now() - INTERVAL 15 MINUTE and now()`;
    const raw = await db.raw(sql);
    return raw[0];
  },
  async getListEmailWinner() {
    const sql = `select * from products p join users u on p.highestBidID=u.uID
      where p.timeEnd between now() - INTERVAL 15 MINUTE and now()`;
    const raw = await db.raw(sql);
    // console.log(raw[0]);
    return raw[0];
  },
};
