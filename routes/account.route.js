import express from 'express';
import bcrypt from 'bcryptjs';

import userModel from '../models/user.model.js';
const router = express.Router();


router.get("/login", function (req, res) {
    res.render("Authentication/login", { layout: "authentication" });
  });
router.get("/signup", function (req, res) {
    res.render("Authentication/signup", { layout: "authentication" });
  });
router.post('/signup',async function (req,res){
    const rawPassword = req.body.psword;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(rawPassword,salt);
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
    //await userModel.add(user);
    res.render("Authentication/login", { layout: "authentication" });
  });
  
router.get('/is-available', async function(req,res){
    const user = await userModel.findByEmail(req.query.email);
    if (user === null){
      return res.json(true);
    }
    res.json(false);
  });

export default router;