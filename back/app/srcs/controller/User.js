const UserModel = require('../model/User');
const crypto=require("crypto");
const async=require("async");
const nodemailer=require('nodemailer')
// var io = require('socket.io')(http);
// io.on('connection', () =>{
//   console.log('a user is connected')
// })

class UserController {

  list(req,res){

    UserModel.searchQuery(req.body)
    .then((result)=>{
      res.send(result)
    })
  }

  getInfo(req,res){

      const user=req.params
      // console.log(user)
      UserModel.searchBy(user)
      .then((result)=>{
        // console.log(result)
        if(result){
          res.send({res:result})
        }
        else {
          res.send({error:"userId n'est pas correcte"})
        }
      })
      .catch((e)=>{
        // console.log(err)
        res.send({error:e})
      })
      // UserModel.getInfo(userId)
    }

  addUser(req,res){
      UserModel.addUser(req.body)
      .then((result)=>{
        res.send({res:result})
      })
      .catch((e)=>{
        res.send({error:e})
      })
  }

  updateInfo(req,res){
      var user=req.body
      console.log("updateInfo");

      UserModel.save(user);

      UserModel.searchBy({id:user.id})
      .then((result)=>{
        console.log(result);
        user=UserModel.calculePopulaireBase(result)
        UserModel.save(user)
        .then((result)=>{
          // res.status(200).json({res:result})
          res.send({user:user,msg:"Vos informations ont bien été mise à jours"})
        })
        .catch((e)=>{
          // res.status(500).json({error:e})
          res.send({error:e})
        })
      })

      // UserModel.save(user)
      // .then((result)=>{
      //   // res.status(200).json({res:result})
      //   res.send("Vos informations ont bien été mise à jours")
      // })
      // .catch((e)=>{
      //   // res.status(500).json({error:e})
      //   res.send({error:e})
      // })
    }

  updateEmail(req,res){
      const user=req.body
      console.log("updateInfo");
      console.log(user);
      UserModel.save(user)
      .then((result)=>{
        // res.status(200).json({res:result})
        res.send("Vos informations ont bien été mise à jours")
      })
      .catch((e)=>{
        // res.status(500).json({error:e})
        res.send({error:e})
      })
    }

  auth(req,res){
      UserModel.auth(req.body)
      .then((result)=>{
        console.log(result)
        res.status(200).json(result)
      })
      .catch((e)=>{
        // res.send({error:e})
        console.log(e)
        console.log("here")
        // res.status(500).json({error:e})
        res.send({error:e})
      })
    }

  logout(req,res){
    console.log("logout");
    const user=req.body;
    user.access_token=null;
    user.online=0;
    console.log(user);
    UserModel.save(user)
    .then((result)=>{
      res.send({res:true})
    })
    .catch((e)=>{
      res.send({res:false})
    })
  }

  forgot(req,res){
      console.log("forgot")

      const user=req.body;
      // console.log(user);
      UserModel.searchBy(user)
      .then((result)=>{
        //console.log(result)
        if(!result){
          res.send({error:"Email n'existe pas"})
        }else{
          async.waterfall([
            function(callback){
              crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                console.log(token)
                callback(err, token);
              });
            },
            function(token,callback){
              // console.log(result)
              user.id=result.id;
              user.reset_token=token;
              const decTime=3600000*2;
              user.reset_at=(new Date(Date.now()+decTime+3600000)).toISOString().slice(0, 19).replace('T', ' ');
              console.log(user.reset_at)
              UserModel.save(user).then((result)=>{
                console.log("save token");
                callback(null,token)
              })
              .catch((e)=>{
                // console.log(e);
                callback(e,null)
              })
            },
            async function(token,callback){
              console.log("createTransport");
              var smtpTrans = await nodemailer.createTransport({
                 host: "smtp.mailtrap.io",
                 auth: {
                  user: process.env.MAILTRAP_USER,
                  pass: process.env.MAILTRAP_PASSWORD
                 }
              });

              var mailOptions = {

                to: user.email,
                from: 'myemail@mailtrap.com',
                subject: 'MATCHA réinitialiser votre mot de passe',
                text: 'Vous avez reçu cet e-mail car vous avez demandé un nouveau mot de passe.\n\n' +
                   process.env.FRONT_HOST + 'reset/' + token + '\n\n'
              };
               smtpTrans.sendMail(mailOptions, function(err,info) {
                if(err) console.log("err:",err)
                else{
                  console.log("here")
                  res.send({success: 'Un email a été envoyé à ' + user.email + '.'});
                }
              })
              console.log("fin");
              // res.send({success: 'Un email a été envoyé à ' + user.email + '.'});
            }
          ],function(err){
            // res.send({"error":err})
            console.log("err:",err);
          })
        }
      })
    }

    confirm(req,res){

    }

  resetCheck(req,res){
    console.log("resetCheck")
    const token=req.params.token;
    UserModel.searchToken(token)
    .then((result)=>{
      // res.send(result[0])
      if(result && result[0])
        res.send({res:true})
      else {
        res.send({error:"Le token n'est pas valide ou expiré"})
      }
    })
    .catch((e)=>{
      res.send({error:"Le token n'est pas valide ou expiré"})
    })
  }

  reset(req,res){
    console.log("reset");
    const token=req.params.token;
    const user=req.body
    console.log("user:",user);
    UserModel.searchToken(token)
    .then((result)=>{
      if(result && result[0])
      {
          console.log("reset searchToken success");
          const user=req.body;
          user.id=result[0].id

          UserModel.setNewPassword(user)
          .then((resp)=>{
            console.log(resp);
            res.send({res:resp})
          })
          .catch((e)=>{
            res.send({error:e})
          })
      }
      else {
        console.log("Le token n'est pas valide ou expiré");
        res.send({error:"Le token n'est pas valide ou expiré"})
      }
    })
    .catch((e)=>{
      // console.log("here");
      res.send({error:"Le token n'est pas valide ou expiré"})
    })
  }

  confirmMailCheck(req,res){
    console.log("confirmMailCheck")
    const token=req.params.token;
    UserModel.searchMailToken(token)
    .then((result)=>{
      // res.send(result[0])
      if(result && result[0])
        res.send({res:true})
      else {
        res.send({error:"Le token n'est pas valide"})
      }
    })
    .catch((e)=>{
      res.send({error:"Le token n'est pas valide"})
    })
  }

  confirmMail(req,res){
    console.log("confirm");
    const token=req.params.token;
    const user=req.body
    console.log("user:",user);
    UserModel.searchMailToken(token)
    .then((result)=>{
      if(result && result[0])
      {
          console.log("confirmMail success!");
          const user=req.body;
          user.id=result[0].id

          console.log("here0");
          UserModel.confirmMail(user)
          .then((resp)=>{
            console.log(resp);
            res.send({res:resp})
          })
          .catch((e)=>{
            console.log(e);
            res.send({error:e})
          })
          console.log("here");
      }
      else {
        console.log("Le token n'est pas valide");
        res.send({error:"Le token n'est pas valide"})
      }
    })
    .catch((e)=>{
      // console.log("here");
      console.log(e);
      res.send({error:"Le token n'est pas valide ou expiré"})
    })
  }

  defineProfil(req,res){
    console.log("defineProfil")
    const user=req.body;
    console.log(user);
    UserModel.save(user)
    .then((result)=>{
      res.send({msg:"success"})
    })
    .catch((e)=>{
      res.send({error:"error"})
    })
  }

  searchQuery(req,res){

    UserController.searchQuery(res.body)
    .then((result)=>{
      // console.log(result);
      res.send(result)
    })
  }
}
module.exports = new UserController();
