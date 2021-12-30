import express from 'express';
import bcrypt from 'bcryptjs';
import Recaptcha from 'express-recaptcha';
import userModel from '../models/user.model.js';

const router = express.Router();
var recaptcha = new Recaptcha.RecaptchaV2('6LeOKdsdAAAAAO1tRxxSCIoufTKvDLRmuC8Cq7BL', '6LeOKdsdAAAAACIZLMh8Osrrj5cJmsNDnC-TpsT1');

router.get("/login", function (req, res) {
  res.render("Authentication/login", { layout: "authentication" });
});
router.get("/signup", function (req, res) {
  res.render("Authentication/signup", { layout: "authentication" });
});
router.post('/signup', recaptcha.middleware.verify, async function (req, res) {

  if (!req.recaptcha.error) {
    // success code
    const rawPassword = req.body.psword;
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
      userType: 'bidder'

    }
    await userModel.add(user);
    res.render("Authentication/login", { layout: "authentication" });
  } else {
    // error code
    res.render("Authentication/signup", {
      layout: "authentication",
      err_message: 'You forgot to check reCaptcha box'
    });
  }


});
router.post('/login', recaptcha.middleware.verify, async function (req, res) {
  if (!req.recaptcha.error) {
    const user = await userModel.findByEmail(req.body.email);
    if (user === null) {
      res.render("Authentication/login", {
        layout: "authentication",
        err_message: 'Invalid email or password.'
      });
    }
    const ret = bcrypt.compareSync(req.body.psword, user.psword);
    if (ret === false) {
      res.render("Authentication/login", {
        layout: "authentication",
        err_message: 'Invalid email or password.'
      });
    }
    
    req.session.auth = true;
    req.session.authUser = user;

    const url = '/';
    res.redirect(url);
  } else {
    res.render("Authentication/login", {
      layout: "authentication",
      err_message: 'You forgot to check reCaptcha box'
    });
  }

});
router.post('/logout', recaptcha.middleware.verify, async function (req, res) {
    req.session.auth = false;
    req.session.authUser=null;
    const url = req.headers.referer||'/';
    res.redirect(url);
});
router.get('/is-available', async function (req, res) {
  const user = await userModel.findByEmail(req.query.email);
  if (user === null) {
    return res.json(true);
  }
  res.json(false);
});

export default router;