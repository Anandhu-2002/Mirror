var express = require('express');

var router = express.Router();
var userHelpers = require('../helpers/user-helpers');
var fs=require('fs');
const fileUpload = require('express-fileupload');
// const http=require('http');
// var socketio=require('socket.io');
// var app=require('../app')
// io=app.io

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
    photos.reverse()    
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
    console.log(response.otp);
    res.json(response);
  })
});
router.get('/signup2', (req, res) => {

  res.render('user/signup2')
});
router.post('/signup2', (req, res) => {

  userHelpers.Signup(req.body)

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
  let uploadedId = await userHelpers.uploadPhotos(req.body,req.session.user.Username)

  image.mv('./public/photos/' + uploadedId + '.jpg', (err) => {
    if (!err) {
      res.redirect('/home');

    } else {
      console.log('error')
    }

  })
});
router.get('/editphoto/:id',(req,res)=>{
  res.render('user/editphoto',{photo:req.params.id})
});
router.get('/removePhoto/:id',async(req,res)=>{
  let photoId=req.params.id
  await userHelpers.removePhoto(photoId)
  let imgpath='./public/photos/' + photoId + '.jpg'
  fs.unlink(imgpath,(err)=>{
    if (!err) {
      res.redirect('/profile')

    } else {
      console.log('error')
    }


  })
});
router.get('/userlist',async(req,res)=>{
  let users=await userHelpers.findalluser()
  res.render('user/userlist',{users});
})
router.get('/search',verifyLogin,(req,res)=>{
  res.render('user/search')

});
router.post('/userSearch', (req, res) => {
  userHelpers.userSearch(req.body.uname).then((response) => {
   
    res.json(response)
})
})
router.post('/search',async(req, res) => {
  userHelpers.userSearch(req.body.uname).then((response) => {
  
    res.json(response.user)
})
});
router.get('/profile',verifyLogin,async(req,res)=>{
  
  user=req.session.user
  userHelpers.profile(req.session.user.Username).then((photos)=>{
    photos.reverse()
    res.render('user/profile',{user,photos})
  })
  

})

router.get('/viewuserprofile/:id',async(req,res)=>{
  
  let userid=req.params.id
  let User=await userHelpers.userSearch(userid)
  let user=User.user[0]
  userHelpers.profile(userid).then((photos)=>{

    photos.reverse()
    res.render('user/publicprofile',{user,photos})
  })
});





module.exports = router;
