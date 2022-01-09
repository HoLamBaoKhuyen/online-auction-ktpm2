import express from "express";
import bcrypt from "bcryptjs";
import Recaptcha from "express-recaptcha";
import userModel from "../models/user.model.js";
import watchlistModel from "../models/watchlist.model.js";
import productModel from "../models/product.model.js";
import auth from "../middlewares/auth.mdw.js";
import { fromMail } from "../utils/transporter.js";
import { transporter } from "../utils/transporter.js";
import moment from "moment";
const router = express.Router();
var recaptcha = new Recaptcha.RecaptchaV2(
  "6LeOKdsdAAAAAO1tRxxSCIoufTKvDLRmuC8Cq7BL",
  "6LeOKdsdAAAAACIZLMh8Osrrj5cJmsNDnC-TpsT1"
);

router.get("/login", function (req, res) {
  res.render("Authentication/login", { layout: "authentication" });
});
router.get("/signup", function (req, res) {
  res.render("Authentication/pre_signup", { layout: "authentication" });
});
router.get("/pre-signup", function (req, res) {
  res.render("Authentication/pre_signup", { layout: "authentication" });
});
router.post("/pre-signup", recaptcha.middleware.verify, function (req, res) {
  if (!req.recaptcha.error) {
    console.log(req.body);
    if (req.body.code !== req.body.otp) {
      res.render("Authentication/pre_signup", {
        layout: "authentication",
        warn: "Mã không khớp",
      });
      return;
    }
    res.render("Authentication/signup_edit", {
      layout: "authentication",
      email: req.body.email,
      pass: req.body.psword,
    });
  } else {
    res.render("Authentication/pre_signup", {
      layout: "authentication",
      warn: "You forgot to check reCaptcha box",
    });
  }
});
router.post("/sendCode", async function (req, res) {
  const mail = req.body.emailCode;
  console.log(mail);
  const user = await userModel.findByEmail(mail);

  if (user === null) {
    const OTP = generateOTP();
    const data = {
      from: fromMail,
      to: mail,
      subject: "Verify OTP",
      html:
        "<h3>Mã OTP của bạn là </h3>" +
        "<h1 style='font-weight:bold;'>" +
        OTP +
        "</h1>",
    };
    try {
      let err = await transporter.sendMail(data);
    } catch {
      res.render("Authentication/pre_signup", {
        layout: "authentication",
        warn: "Có lỗi xảy ra",
      });
      return;
    }
    res.render("Authentication/pre_signup", {
      layout: "authentication",
      refil: mail,
      code: OTP,
    });
  } else {
    res.render("Authentication/login", {
      layout: "authentication",
      warn: "Email đã tồn tại",
    });
  }
});
router.post("/signup", recaptcha.middleware.verify, async function (req, res) {
  if (!req.recaptcha.error) {
    // success code
    console.log(req.body);
    const rawPassword = req.body.psword;
    if (rawPassword !== req.body.confirm) {
      res.render("Authentication/signup_edit", {
        layout: "authentication",
        email: req.body.email,
        pass: rawPassword,
        err_message: "Mật khẩu nhập lại không đúng",
      });
      return;
    }
    if (
      moment(req.body.dob).isSame(moment()) ||
      moment(req.body.dob).isAfter(moment())
    ) {
      res.render("Authentication/signup_edit", {
        layout: "authentication",
        email: req.body.email,
        pass: rawPassword,
        err_message: "Ngày sinh không hợp lệ",
      });
      return;
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(rawPassword, salt);
    const user = {
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      psword: hash,
      dob: req.body.dob,
      hotline: req.body.hotline,
      address: req.body.address,
      userType: "bidder",
    };
    // console.log(user);
    await userModel.add(user);
    res.redirect("/account/login");
    //res.render("Authentication/login", { layout: "authentication" });
  } else {
    // error code
    res.render("Authentication/signup", {
      layout: "authentication",
      err_message: "You forgot to check reCaptcha box",
    });
  }
});
router.post("/login", recaptcha.middleware.verify, async function (req, res) {
  if (!req.recaptcha.error) {
    const user = await userModel.findByEmail(req.body.email);
    console.log(user);
    if (user === null) {
      res.render("Authentication/login", {
        layout: "authentication",
        err_message: "Invalid email or password.",
      });
      return;
    }
    const ret = bcrypt.compareSync(req.body.psword, user.psword);
    if (ret === false) {
      res.render("Authentication/login", {
        layout: "authentication",
        err_message: "Invalid email or password.",
      });
      return;
    }

    req.session.auth = true;
    req.session.authUser = user;

    const url = "/";
    res.redirect(url);
  } else {
    res.render("Authentication/login", {
      layout: "authentication",
      err_message: "You forgot to check reCaptcha box",
    });
  }
});
router.post("/logout", recaptcha.middleware.verify, async function (req, res) {
  req.session.auth = false;
  req.session.authUser = null;
  const url = req.headers.referer || "/";
  res.redirect(url);
});
router.get("/is-available", async function (req, res) {
  const user = await userModel.findByEmail(req.query.email);
  if (user === null) {
    return res.json(true);
  }
  res.json(false);
});
router.get("/forgetpassword", function (req, res) {
  res.render("Authentication/forgetpassword", { layout: "authentication" });
});
router.post("/forgetpassword/sendCode", async function (req, res) {
  const mail = req.body.emailCode;
  console.log(mail);
  const user = await userModel.findByEmail(mail);

  if (user !== null) {
    const OTP = generateOTP();
    const data = {
      from: fromMail,
      to: mail,
      subject: "Verify OTP",
      html:
        "<h3>Mã OTP của bạn là </h3>" +
        "<h1 style='font-weight:bold;'>" +
        OTP +
        "</h1>",
    };
    try {
      let err = await transporter.sendMail(data);
    } catch {
      res.render("Authentication/forgetpassword", {
        layout: "authentication",
        warn: "Có lỗi xảy ra",
      });
      return;
    }
    res.render("Authentication/forgetpassword", {
      layout: "authentication",
      refil: mail,
      code: OTP,
    });
  } else {
    res.render("Authentication/forgetpassword", {
      layout: "authentication",
      warn: "Tài khoản không tồn tại",
    });
  }
});
router.post(
  "/forgetpassword/update",
  recaptcha.middleware.verify,
  async function (req, res) {
    if (!req.recaptcha.error) {
      if (req.body.psword !== req.body.confirm) {
        res.render("Authentication/forgetpassword", {
          layout: "authentication",
          warn: "Password không khớp",
        });
        return;
      }
      if (req.body.code !== req.body.otp) {
        res.render("Authentication/forgetpassword", {
          layout: "authentication",
          warn: "Sai mã",
        });
        return;
      }
      const mail = req.body.email;
      const user = await userModel.findByEmail(mail);
      const rawPassword = req.body.psword;
      const ret = bcrypt.compareSync(rawPassword, user.psword);
      if (ret === true) {
        res.render("Authentication/forgetpassword", {
          layout: "authentication",
          warn: "Reset password failed",
        });
        return;
      } else {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(rawPassword, salt);
        try {
          await userModel.updatepassword(user.uID, hash);
        } catch {
          res.render("Authentication/forgetpassword", {
            layout: "authentication",
            warn: "Reset password failed",
          });
          return;
        }
        req.session.auth = false;
        req.session.authUser = null;
        res.redirect("/account/login");
      }
    } else {
      res.render("Authentication/forgetpassword", {
        layout: "authentication",
        warn: "You forgot to check reCaptcha box",
      });
      return;
    }
  }
);
router.get("/updatepassword/:id", auth, function (req, res) {
  const id = req.params.id;
  if (id != req.session.authUser.uID) {
    res.redirect("/");
  }
  res.render("Authentication/updatepassword", { layout: "authentication" });
});

router.get("/upgrade", auth, async function (req, res) {
  const top5Price = await productModel.getTop5HighestPrice();
  const top5End = await productModel.getTop5End();
  const top5Bid = await productModel.getTop5HighestBids();

  let newlist1 = productModel.getTimeRemain(top5Price);
  let newlist2 = productModel.getTimeRemain(top5End);
  let newlist3 = productModel.getTimeRemain(top5Bid);

  if (req.session.authUser) {
    if (newlist3) {
      for (let i = 0; i < newlist3.length; i++) {
        let proID = newlist3[i].prodID;
        let wlist = await watchlistModel.findByUidProID(
          req.session.authUser.uID,
          proID
        );
        if (wlist !== null) {
          newlist3[i].inWatchlist = 1;
        }
      }
    }
    if (newlist1) {
      for (let i = 0; i < newlist1.length; i++) {
        let proID = newlist1[i].prodID;
        let wlist = await watchlistModel.findByUidProID(
          req.session.authUser.uID,
          proID
        );
        if (wlist !== null) {
          newlist1[i].inWatchlist = 1;
        }
      }
    }
    if (newlist2) {
      for (let i = 0; i < newlist2.length; i++) {
        let proID = newlist2[i].prodID;
        let wlist = await watchlistModel.findByUidProID(
          req.session.authUser.uID,
          proID
        );
        if (wlist !== null) {
          newlist2[i].inWatchlist = 1;
        }
      }
    }
  }
  res.render("home", {
    top5Price: newlist1,
    top5End: newlist2,
    top5Bid: newlist3,
  });
});
router.post("/upgrade", auth, async function (req, res) {
  const ret = bcrypt.compareSync(req.body.confirm, req.session.authUser.psword);

  const top5Price = await productModel.getTop5HighestPrice();
  const top5End = await productModel.getTop5End();
  const top5Bid = await productModel.getTop5HighestBids();

  let newlist1 = productModel.getTimeRemain(top5Price);
  let newlist2 = productModel.getTimeRemain(top5End);
  let newlist3 = productModel.getTimeRemain(top5Bid);

  if (req.session.authUser) {
    if (newlist3) {
      for (let i = 0; i < newlist3.length; i++) {
        let proID = newlist3[i].prodID;
        let wlist = await watchlistModel.findByUidProID(
          req.session.authUser.uID,
          proID
        );
        if (wlist !== null) {
          newlist3[i].inWatchlist = 1;
        }
      }
    }
    if (newlist1) {
      for (let i = 0; i < newlist1.length; i++) {
        let proID = newlist1[i].prodID;
        let wlist = await watchlistModel.findByUidProID(
          req.session.authUser.uID,
          proID
        );
        if (wlist !== null) {
          newlist1[i].inWatchlist = 1;
        }
      }
    }
    if (newlist2) {
      for (let i = 0; i < newlist2.length; i++) {
        let proID = newlist2[i].prodID;
        let wlist = await watchlistModel.findByUidProID(
          req.session.authUser.uID,
          proID
        );
        if (wlist !== null) {
          newlist2[i].inWatchlist = 1;
        }
      }
    }
  }
  if (ret === true) {
    const request = {
      bidID: req.session.authUser.uID,
      reqTime: moment().format("YYYY-MM-DD hh:mm:ss"),
    };
    await userModel.requestUpgrade(request);
    res.render("home", {
      mes: "Xin nâng cấp thành công",
      top5Price: newlist1,
      top5End: newlist2,
      top5Bid: newlist3,
    });
  } else {
    res.render("home", {
      warn: "Xin nâng cấp thất bại",
      top5Price: newlist1,
      top5End: newlist2,
      top5Bid: newlist3,
    });
  }
});
router.post("/updatepassword/:id", async function (req, res) {
  if (req.body.psword !== req.body.confirm) {
    res.render("Authentication/updatepassword", {
      layout: "authentication",
      err_message: "Password not matching",
    });
    return;
  }
  const id = req.params.id;
  const user = await userModel.findByID(id);
  const rawPassword = req.body.psword;
  const ret = bcrypt.compareSync(rawPassword, user.psword);
  if (ret === true) {
    res.render("Authentication/updatepassword", {
      layout: "authentication",
      err_message: "Reset password failed",
    });
    return;
  } else {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(rawPassword, salt);
    try {
      await userModel.updatepassword(id, hash);
    } catch {
      res.render("Authentication/updatepassword", {
        layout: "authentication",
        err_message: "Reset password failed",
      });
      return;
    }
    req.session.auth = false;
    req.session.authUser = null;
    res.redirect("/account/login");
  }
});
function generateOTP() {
  // Declare a string variable
  // which stores all string
  var string = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let OTP = "";
  // Find the length of string
  var len = string.length;
  for (let i = 0; i < 6; i++) {
    OTP += string[Math.floor(Math.random() * len)];
  }
  return OTP;
}

export default router;
