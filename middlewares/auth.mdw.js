
export default function auth(req,res,next){
  console.log(req.session.auth);
    if (req.session.auth===false){
      req.session.retUrl=req.originalUrl;
      return res.redirect('/account/login');
    }
    next();
};