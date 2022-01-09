import cron from "node-cron";
import mailModel from "../models/mail.model.js";

// Gửi mail khi kết thúc đấu giá
function sendMailSeller() {
  const list = mailModel.getListEmailSeller();
  for (let i = 0; i < list.length; i++) {
    sendAuctionEmail(
      list[i].email,
      `Thông báo kết thúc đấu giá`,
      `Thời gian đấu giá sản phẩm ${list[i].prodName} đã kết thúc.`
    );
  }
}
function sendMailWinner() {
  const list = mailModel.getListEmailWinner();
  for (let i = 0; i < list.length; i++) {
    sendAuctionEmail(
      list[i].email,
      `Thông báo kết thúc đấu giá`,
      `Chúc mừng bạn đã đấu giá sản phẩm ${list[i].prodName} thành công.
        Chốt giá: ${numeral(list[i].curPrice).format("0,0")} VND`
    );
  }
}

export default cron.schedule("*/5 * * * *", () => {
  console.log("running a task every minute");
  sendMailSeller();
  sendMailWinner();
});
