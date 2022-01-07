export default function auth(req, res, next) {
  // console.log(req.session.auth);
  if (typeof req.session.auth === "undefined" || req.session.auth === false) {
    req.session.retUrl = req.originalUrl;
    return res.redirect("/account/login");
  }
  next();
}
