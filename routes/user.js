var express = require('express');
const { generate } = require('otp-generator');
var router = express.Router();
var userHelpers=require('../helpers/user-helpers');



/* GET home page. */
router.get('/', (req, res, next)=>{

  res.render('user/login');
});
router.get('/login',(req,res)=>{
  res.redirect('/')
})
router.post('/login',(req,res)=>{
  
  userHelpers.Login(req.body).then((response) => {
    console.log(response);

    if (response.status) {
      
      req.session.user = response.user
      req.session.userLoggedIn = true
      res.redirect('/home')
    } else {
      eror=req.session.userLoginErr =true
      res.render('user/login',{eror})
    }
  })
});
router.get('/home',(req,res)=>{
  res.render('user/home')
})
router.get('/signup',(req,res)=>{
  res.render('user/signup')
});
router.post('/signup',(req,res)=>{
  
    
    res.render('user/signup2',{user:req.body})
    
  
});

router.post('/verify-otp',async(req,res)=>{
  userHelpers.VerifyOtp(req.body.mailid).then((response)=>{
    console.log(response);
    res.json(response);
  })  
});
router.get('/signup2',(req,res)=>{
  
  res.redirect('/signup2')
});
router.post('/signup2',(req,res)=>{
  
  userHelpers.Signup(req.body).then((response)=>{
    
  })
    
  res.redirect('/login')
});
router.post('/userSearch',(req,res)=>{
  userHelpers.userSearch(req.body.uname)
})

module.exports = router;
