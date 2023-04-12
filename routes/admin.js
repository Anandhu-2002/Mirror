var express = require('express');
var router = express.Router();
var adminHelpers = require('../helpers/admin-helpers');
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

module.exports = router;

