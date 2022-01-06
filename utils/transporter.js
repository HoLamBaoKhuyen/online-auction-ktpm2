import nodemailer from "nodemailer";

export const fromMail = "webktpm2@gmail.com";

// e-mail transport configuration
export let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: fromMail,
    pass: "a@12345678",
  },
});
