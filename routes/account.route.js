import express from "express";
import bcrypt from "bcryptjs";
import Recaptcha from "express-recaptcha";
import userModel from "../models/user.model.js";
import auth from "../middlewares/auth.mdw.js"
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
router.post("/pre-signup", function (req, res) {
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
      html: "<h3>Mã OTP của bạn là </h3>" + "<h1 style='font-weight:bold;'>" + OTP + "</h1>",
    };
    try {
      let err = await transporter.sendMail(data);
    }
    catch {
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
  }
  else {
    res.render("Authentication/pre_signup", {
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
    if(rawPassword!== req.body.confirm)
    {
      res.render("Authentication/signup_edit", {
        layout: "authentication",
        email:req.body.email,
        pass: rawPassword,
        err_message: "Mật khẩu nhập lại không đúng",
      });
      return;
    }
    if (moment(req.body.dob).isSame(moment())|| moment(req.body.dob).isAfter(moment())){
      res.render("Authentication/signup_edit", {
        layout: "authentication",
        email:req.body.email,
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
    console.log(user);
    await userModel.add(user);
    res.redirect('/account/login');
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

    const url = req.session.retUrl || "/";
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
router.get("/updatepassword/:id", auth, function (req, res) {
  const id = req.params.id;
  if (id != req.session.authUser.uID) {
    res.redirect("/");
  }
  res.render("Authentication/updatepassword", { layout: "authentication" });
});
router.post('/updatepassword/:id', async function (req, res) {
  if (req.body.psword !== req.body.confirm) {
    res.render("Authentication/updatepassword", { layout: "authentication", err_message: "Password not matching" })
    return;
    ;
  }
  const id = req.params.id;
  const user = await userModel.findByID(id);
  const rawPassword = req.body.psword;
  const ret = bcrypt.compareSync(rawPassword, user.psword);
  if (ret === true) {
    res.render("Authentication/updatepassword", { layout: "authentication", err_message: "Reset password failed" });
    return;
  }
  else {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(rawPassword, salt);
    await userModel.updatepassword(id, hash);
    res.render("Authentication/updatepassword", { layout: "authentication", message: "Password Reseted" });
  }

});
function generateOTP() {

  // Declare a string variable 
  // which stores all string
  var string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let OTP = '';
  // Find the length of string
  var len = string.length;
  for (let i = 0; i < 6; i++) {
    OTP += string[Math.floor(Math.random() * len)];
  }
  return OTP;
}


export default router;
