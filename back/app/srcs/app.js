var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser=require("body-parser")
var indexRouter = require('./routes/index');
var userRouter = require('./routes/users');
var uploadRouter = require('./routes/upload');
var tagRouter = require('./routes/tags');
var taggedRouter = require('./routes/taggeds');
var consultedRouter = require('./routes/consulteds');
var actionRouter = require('./routes/actions');
var notificationRouter = require('./routes/notifications');

const NotificationModel=require('./model/Notification');
const MessageModel=require('./model/Message');
const UserModel=require('./model/User');



var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
        extended: false
}));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

io.on('connect',socket=>{

  socket.on("sendNotif",req=>{
    console.log("sendNotif");
    console.log("socketId:",socket.id);
    const from_user=req.from_user;
    const to_user=req.to_user;
    const content=req.content;
    UserModel.searchBy({id:from_user})
    .then((result)=>{
      console.log(result);
      // const from_user_profil=result.selectImg;
      const readed=0;
      const notif={from_user,to_user,content,readed};
      var io=req.io;
      socket.broadcast.emit("notifReceived",notif);
      NotificationModel.add(notif)
      .then((result)=>{
        // res.send({res:result})

      })
    })
  })

  socket.on("sendMessage",req=>{
    console.log("sendMessage");
    console.log("socketId:",socket.id);
    const from_user=req.from_user;
    const to_user=req.to_user;
    const content=req.content;
    UserModel.searchBy({id:from_user})
    .then((result)=>{
      // console.log(result);
      // const from_user_profil=result.selectImg;
      const readed=0;
      const message={from_user,to_user,content,readed};
      var io=req.io;
      socket.broadcast.emit("messageReceived",message);
      MessageModel.add(message)
      .then((result)=>{
        // res.send({res:result})

      })
    })
  })
})


app.use(function(req,res,next){
 req.io = io
 next();
});

app.use('/', indexRouter);
app.use('/upload', uploadRouter);
app.use('/user', userRouter);
app.use('/tag', tagRouter);
app.use('/tagged', taggedRouter);
app.use('/consulted', consultedRouter);
app.use('/action', actionRouter);
const controller=require('./controller/Notification');
app.get("/:userId/notification/",controller.list);
app.post("/:userId/notification/",controller.add);

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

// console.log(app.get("io"));

module.exports.app=app
module.exports.server=server

// module.exports = {app,server,io};
