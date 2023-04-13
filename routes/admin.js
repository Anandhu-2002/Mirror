var express = require('express');
var router = express.Router();
var adminHelpers = require('../helpers/admin-helpers');
var userHelpers=require('../helpers/user-helpers');
var fs=require('fs');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin/admin_login');
  
});
router.post('/',(req,res)=>{
  if(req.body.admin==='admin2002' && req.body.Password==='admin@admin07'){
    res.render('admin/admin_home')
     
  }else{
    res.render('admin/admin_login',{eror:true});
  }
});
router.get('/userverification',async(req,res)=>{
   let userrequests=await adminHelpers.userverification()
   res.render('admin/user_requests',{userrequests})
  

})
router.get('/user-approve/:id/:uname',async(req,res)=>{
  let addhar='./public/userverifydoc/' + req.params.id + 'ad.jpg'
  let licence='./public/userverifydoc/' + req.params.id + 'li.jpg'

  fs.unlink(addhar,()=>{
    fs.unlink(licence,async()=>{
      await adminHelpers.userverificationaction(req.params.id)
      await adminHelpers.Userstatusupdate(req.params.uname,'Verified')
      res.redirect('/admin/userverification')
    })
  });
  
 

})
router.get('/user-reject/:id/:uname',async(req,res)=>{

  let addhar='./public/userverifydoc/' + req.params.id + 'ad.jpg'
  let licence='./public/userverifydoc/' + req.params.id + 'li.jpg'

  fs.unlink(addhar,()=>{
    fs.unlink(licence,async()=>{
      await adminHelpers.userverificationaction(req.params.id)
      await adminHelpers.Userstatusupdate(req.params.uname,'Rejected')
      res.redirect('/admin/userverification')
    })
  });

})
router.get('/view-photos',async(req,res)=>{
  userHelpers.viewPhotos().then((photos)=>{
  photos.reverse()  
 
  res.render('admin/view_photos',{photos})

  })
})
router.get('/removephoto/:id',async(req,res)=>{
  let photoId=req.params.id
  await userHelpers.removePhoto(photoId)
  let imgpath='./public/photos/' + photoId + '.jpg'
  fs.unlink(imgpath,(err)=>{
    if (!err) {
      res.redirect('/admin/view-photos')

    } else {
      res.redirect('/admin/view-photos')
    }


  })



})

module.exports = router;

