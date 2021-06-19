const MessageModel=require('../model/Message');
const UserModel=require('../model/User');
var express = require('express');


// console.log(server.getIO());
class MessageController {

  list(req,res){
    const user1=req.params.id;
    const user2=req.body.chat_with_user;
    MessageModel.list({user1:user1,user2:user2})
    .then((result)=>{
      UserModel.searchBy({id:user2})
      .then((resp)=>{
        const from_user_profil=resp.selectImg;
        res.send({res:result,from_user_profil:from_user_profil,name:resp.identif})
      })

    })
    .catch((e)=>{
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
      MessageModel.add(notif)
      .then((result)=>{
        res.send({res:result})
      })
    })
  }

  readed(req,res){
    //console.log("readed");
    //console.log(req.body);
    var notif={"id":req.body.id}
    MessageModel.readed(notif)
    .then((result)=>{
      res.send({res:result})
    })
  }


}

module.exports=new MessageController();
