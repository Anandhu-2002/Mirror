var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session=require('express-session');
var logger = require('morgan');
const http=require('http');
var socketio=require('socket.io');

var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
const hbs=require('express-handlebars');
var db=require('./dbconnection/connection');

var fileUpload=require('express-fileupload');
const userHelpers = require('./helpers/user-helpers');
var app = express();

const server=http.createServer(app)
const io=socketio(server)


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',hbs.engine({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layouts/',partialsDir:__dirname+'/views/partials/'}))
app.use(fileUpload());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret:"Key",saveUninitialized:false,resave:false,cookie:{maxAge:(3600 * 1000)}}))
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', userRouter);
app.use('/admin', adminRouter);

io.on('connection',(socket)=>{

  socket.on('message',(data)=>{
      reciverid=data.reciver
      senderid=data.sender
      var msgto=reciverid.concat(senderid)
      socket.broadcast.emit(msgto,{senderid,msg:data.msg});
      userHelpers.Message(data,senderid)
  })
  socket.on('fetchmessage',async(data)=>{
   
    reciverid=data.uname
    senderid=data.user
    let msg=await userHelpers.Messagehistory(senderid,reciverid)
     if(msg.chat!=false){
     for(let i=0;i<msg.length;i++){
        socket.emit('chathistory',{msg:msg[i]})
       
      }
    }
    
})

})




db.connect((err)=>{
  if(err)
  console.log("Dbconnection Error"+err);
  else
  console.log("Dbconnection success")
});//db connect

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
  
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
   
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = {app:app,server:server};
