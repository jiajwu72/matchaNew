const NotificationModel=require('../model/Notification');
const UserModel=require('../model/User');
var express = require('express');


// console.log(server.getIO());
class NotificationController {

  list(req,res){
    // console.log(req.io);
    // var io=req.io
    const userId=req.params.userId;
    NotificationModel.list({to_user:userId})
    .then((result)=>{
      res.send({res:result})
    })
    .catch((e)=>{
      // console.log(err)
      res.send({error:e})
    })

  }

  add(req,res){
    const from_user=req.from_user;
    const to_user=req.body.to_user;
    const content=req.body.content;
    UserModel.searchBy({id:from_user})
    .then((result)=>{
      const from_user_profil=result.selectImg;
      const notif={from_user,to_user,from_user_profil,content};
      var io=req.io;
      io.emit("notifReceived",notif);
      NotificationModel.add(notif)
      .then((result)=>{
        res.send({res:result})
      })
    })
  }

  readed(req,res){
    console.log("readed");
    console.log(req.body);
    var notif={"id":req.body.id}
    NotificationModel.readed(notif)
    .then((result)=>{
      res.send({res:result})
    })
  }


}

module.exports=new NotificationController();
