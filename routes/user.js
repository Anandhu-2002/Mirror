var express = require('express');

var router = express.Router();
var userHelpers = require('../helpers/user-helpers');
const verifyLogin = (req, res, next) => {
  if (req.session.userLoggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}


/* GET home page. */
router.get('/', (req, res, next) => {

  res.render('user/login');
});
router.get('/login', (req, res) => {
  res.redirect('/')
})
router.post('/login', (req, res) => {

  userHelpers.Login(req.body).then((response) => {


    if (response.status) {

      req.session.user = response.user
      req.session.userLoggedIn = true
      res.redirect('/home')
    } else {
      eror = req.session.userLoginErr = true
      res.render('user/login', { eror })
    }
  })
});
router.get('/home', verifyLogin, async(req, res) => {
  let user = req.session.user
  userHelpers.viewPhotos().then((photos)=>{
    res.render('user/home', { user, photos})
  })
  
})
router.get('/signup', (req, res) => {
  res.render('user/signup')
});
router.post('/signup', (req, res) => {


  res.render('user/signup2', { user: req.body })


});

router.post('/verify-otp', async (req, res) => {
  userHelpers.VerifyOtp(req.body.mailid).then((response) => {
    console.log(response);
    res.json(response);
  })
});
router.get('/signup2', (req, res) => {

  res.render('user/signup2')
});
router.post('/signup2', (req, res) => {

  userHelpers.Signup(req.body).then((response) => {

  })

  res.redirect('/login')
});
router.post('/userSearch', (req, res) => {
  userHelpers.userSearch(req.body.uname).then((response) => {

    res.json(response)




  })
});
router.get('/uploadPhoto', verifyLogin, (req, res) => {

  res.render('user/photoUpload')
});
router.post('/photos', async (req, res) => {
  console.log(req.body);
  let image = req.files.Image;
  let ob = await userHelpers.uploadPhotos(req.body)

  image.mv('./public/photos/' + ob + '.jpg', (err) => {
    if (!err) {
      res.redirect('/home');

    } else {
      console.log('error')
    }

  })
})



module.exports = router;
