var express = require('express');

var router = express.Router();
var userHelpers = require('../helpers/user-helpers');
var fs=require('fs');
const fileUpload = require('express-fileupload');
const { response } = require('express');

const verifyLogin = (req, res, next) => {
  if (req.session.userLoggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}

function removeObjectWithId(photos, userid) {
  for (let i = 0; i < photos.length; i++) {
    if (photos[i].username===userid) {
      photos.splice(i, 1);
      i--;
    }
  }
  
  return photos;
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
router.get('/signup', (req, res) => {
  res.render('user/signup')
});

router.post('/verify-otp', async (req, res) => {
  userHelpers.VerifyOtp(req.body.mailid).then((response) => {
    res.json(response);
  })
});

router.post('/signup', (req, res) => {

  userHelpers.Signup(req.body)

  res.redirect('/login')
});
router.post('/userSearch', (req, res) => {
  userHelpers.userSearch(req.body.uname).then((response) => {

    res.json(response)




  })
});
router.get('/resetpassword',(req,res)=>{
  res.render('user/commingsoon')
})
router.get('/home', verifyLogin, async(req, res) => {
  let user = req.session.user
  userHelpers.viewPhotos().then((allphotos)=>{
    allphotos.reverse()
    let photos=removeObjectWithId(allphotos,user.Username)   
    res.render('user/home', { user, photos})
  })
  
});
router.get('/photoDetails/:id',async (req,res)=>{
   let id=req.params.id
   let photos=await userHelpers.findPhoto(id)
   res.render('user/imgdetails',{photos})

});

router.get('/uploadPhoto', verifyLogin, (req, res) => {

  res.render('user/photoUpload')
});
router.post('/photos', async (req, res) => {
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
router.get('/editphoto/:id',async(req,res)=>{
  let id=req.params.id
  let photos=await userHelpers.findPhoto(id)
  res.render('user/editimage',{photos})
});
router.post('/editphoto/:id',async(req,res)=>{
  let id=req.params.id
  userHelpers.updatephoto(id,req.body).then(()=>{
     res.redirect('/profile')   
  })
});
router.get('/removephoto/:id',async(req,res)=>{
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
  let userid=req.session.user.Username
  let users=await userHelpers.findalluser()
  const objWithIdIndex = users.findIndex((obj) => obj.Username === userid);
  users.splice(objWithIdIndex, 1);
  res.render('user/userlist',{users,heading:'Message'});
})

router.get('/search',verifyLogin,(req,res)=>{
  res.render('user/search')

});
router.post('/userSearch', (req, res) => {
  userHelpers.userSearch(req.body.uname).then((response) => {
   
    res.json(response)
})
});
router.post('/mailidSearch', (req, res) => {
  userHelpers.mailidSearch(req.body.mailid).then((response) => {
    res.json(response)
})
});
router.post('/search',async(req, res) => {
  userHelpers.userSearch(req.body.uname).then((response) => {
  
    res.json(response.user)
})
});
router.post('/follow',async(req,res)=>{
  let follow=req.body.uname
  let user=req.session.user.Username
  userHelpers.FollowUser(user,follow).then((response)=>{
  
    res.json(response)
  })

});
router.post('/unfollow',async(req,res)=>{
  let unfollow=req.body.uname
  let user=req.session.user.Username
  userHelpers.unFollowUser(user,unfollow).then((response)=>{
  
    res.json(response)

  })

});
router.get('/followers/:uid',async(req,res)=>{
  let users=await userHelpers.Followers(req.params.uid)
  res.render('user/followers&following',{users,heading:'Followers'});

});
router.get('/following/:uid',async(req,res)=>{
  let users=await userHelpers.Following(req.params.uid)
  res.render('user/followers&following',{users,heading:'Following'});

});
router.get('/profile',verifyLogin,async(req,res)=>{
  
  user=req.session.user
  let photos=await userHelpers.profile(user.Username)
  let followers=await userHelpers.Followers(user.Username)
  let following=await userHelpers.Following(user.Username)
  photos.reverse()
  let photocount=photos.length
  let followerscount=followers.length
  let followingcount=following.length
  res.render('user/profile',{user,photos,photocount,followerscount,followingcount})

  

});
router.get('/userverification/:id',async(req,res)=>{
  
 res.render('user/userverification',{uid:req.params.id})

});
router.post('/userverification/:id',async(req,res)=>{
  let uid=req.params.id;
  let licenceimg= req.files.licenceimg;
  let aadharimg=req.files.aadharimg;
  let uploadedId = await userHelpers.userVerification(req.body,uid)

  licenceimg.mv('./public/userverifydoc/' + uploadedId +'li'+ '.jpg');
  aadharimg.mv('./public/userverifydoc/' + uploadedId +'ad'+ '.jpg');
  res.redirect('/profile')

 
 });
router.get('/viewuserprofile/:id',async(req,res)=>{
  
  let userid=req.params.id
  let User=await userHelpers.userSearch(userid)
  let user=User.user[0]
  let photos=await userHelpers.profile(userid)
  let followers=await userHelpers.Followers(userid)
  let following=await userHelpers.Following(userid)
  let followed=false
  if(followers.includes(req.session.user.Username)){
      followed=true
  }
  photos.reverse()
  let photocount=photos.length
  let followerscount=followers.length
  let followingcount=following.length
  res.render('user/publicprofile',{user,photos,photocount,followerscount,followingcount,followed})
});

router.get('/message/:uid',async(req,res)=>{
  var reciver=req.params.uid;
  var sender=req.session.user.Username;
  
  res.render('user/message',{reciver,sender})

  
});




module.exports = router;
