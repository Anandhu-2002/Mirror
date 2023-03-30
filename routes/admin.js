var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin/admin_login');
  
});
router.post('/login',(req,res)=>{
  if(req.body.admin==='admin2002' && req.body.Password==='admin@admin07'){
    res.render('admin/admin_home')
     
  }else{
    res.render('admin/admin_login',{eror:true});
  }
})

module.exports = router;

