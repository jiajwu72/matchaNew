var db=require('./index.js')
const bcrypt=require("bcrypt");
var salt = bcrypt.genSaltSync(10);
var jwt = require('jsonwebtoken');
const crypto=require("crypto");
const async=require("async");
const nodemailer=require('nodemailer')

const calculePopulaireBase=function(user){
  // return new Promise(function(resolve, reject) {
  // });
  var val=0;
  if(user.first_name)
    val+=1
  if(user.last_name)
    val+=1
  if(user.biographe)
    val+=4
  if(user.location || user.code_postal || user.latitude || user.longitude)
    val+=4
  if (user.selectImg)
    val+=4
  if (user.img1)
    val+=3
  if (user.img2)
    val+=3
  if (user.img3)
    val+=3
  if (user.img4)
    val+=3
  if (user.img5)
    val+=3
  user.pop_score_base=val;
  user.pop_score = user.pop_score_base+user.pop_score_optional
  return user;
}

const searchQuery=function(user){
  return new Promise((resolve,reject)=>{
    console.log("searchQuery");
    console.log(user);
    const request="SELECT id,identif,first_name,last_name,sex,locality,code_postal,latitude,age,"+
                  "longitude,online,selectImg,pop_score FROM user WHERE id != "+user.id +
                  " AND longitude IS NOT NULL AND latitude IS NOT NULL "+
                  "AND selectImg IS NOT NULL "+
                  "AND id not IN (SELECT to_user FROM blocked WHERE from_user = "+user.id+")";
    db.query(request,(err,result)=>{
      if (err) {
        return reject(err)
      }
      console.log(result);
      return resolve({res:result})
    })

  })
}

const searchBy=function(user){
  return new Promise((resolve,reject)=>{
    // console.log(user);
    const request=`SELECT * FROM user WHERE ?`;
    db.query(request,user,(err,result)=>{
      if (err){
        // console.log(err)
        resolve(null);
      }
      else resolve(result[0]);
    })
  })
}

const addUser=function(user){
  return new Promise((resolve,reject)=>{
    const request=`SELECT * FROM user WHERE identif='${user.identif}' OR email='${user.email}'`;
    console.log(request);
    const values={identif:user.identif};
    db.query(request,(err,results)=>{
      console.log("err:",err);
      console.log(results);
      if (results && results[0])
      {
        reject("Identifiant ou email est déjas utilisé, veuillez en choisir une autre!");
      }
      else {
        console.log("crypt psw");
        bcrypt.hash(user.password, salt, function(err, hash) {

            const request="INSERT INTO user SET ?";
            var registedUser={identif:user.identif,email:user.email,password:hash,sex:0}
              db.query(request,values,(err,results)=>{
                console.log("resultss:",results);
                if (err) reject(err);
                else{
                  generateJWT(user)
                  .then((resp)=>{
                      resp="Bearer "+resp
                      // var user={}
                      registedUser.online=1
                      registedUser.access_token=resp
                      registedUser.id=results.insertId
                      async.waterfall([
                        function(callback){
                          crypto.randomBytes(20, function(err, buf) {
                            var token = buf.toString('hex');
                            console.log(token)
                            callback(err, token);
                          });
                        },
                        function(token,callback){
                          registedUser.confirmed_token=token
                          save(registedUser)
                          .then((res)=>{

                            // resolve(registedUser)
                            callback(err,token)
                          })
                        },
                        async function(token,callback){
                          var smtpTrans = await nodemailer.createTransport({
                             host: "smtp.mailtrap.io",
                             auth: {
                              user: process.env.MAILTRAP_USER,
                              pass: process.env.MAILTRAP_PASSWORD
                             }
                          });

                          var mailOptions = {

                            to: registedUser.email,
                            // from: 'myemail@mailtrap.com',
                            from: 'sajid@artisansweb.net',
                            subject: 'MATCHA Confirmer votre email',
                            text: 'Confirmer votre email.\n\n' +
                               process.env.FRONT_HOST +'confirmMail/' + token + '\n\n'
                          };
                           smtpTrans.sendMail(mailOptions, function(err,info) {
                            if(err) console.log("err:",err)
                            else{
                              console.log("here")
                              // res.send({success: 'Un email a été envoyé à ' + registedUser.email +
                              //  ', veuillez confirmer votre email.'});
                               resolve('Un email a été envoyé à ' + registedUser.email +
                                ', veuillez confirmer votre email.')
                            }
                          })
                        }
                      ]);

                  })
                }
                // resolve(results);
              })
        });
      }

    })

  })
}

const updateInfo=function(user){
  return new Promise((resolve,reject)=>{
    const request= `UPDATE user SET ? WHERE id=${user.id}`
    const values={first_name:user.first_name,last_name:user.lastname,locality:user.locality,
                  code_postal:user.code_postal,latitude:user.latitude,longitude:user.longitude,
                  pop_score:user.pop_score,img1:user.img1,img2:user.img2,img3:user.img3,img4:user.img4,
                  img5:user.img5,selectImg:user.selectImg,orientation:user.orientation,biographe:user.biographe,
                  updated_at:new Date()};
    db.query(request, values,(err,result) => {
          if (err) reject(err);
          //callback(result);
          else resolve(result)
    });
  })
}

const save=function(user){
  console.log("start save,request:",user);
  return new Promise((resolve,reject)=>{
    // user.created_at="NOW()";
    // user.updated_at="NOW()";
    const request= `UPDATE user SET ? WHERE id=${user.id}`
    const values=user;
    // console.log(user)
    db.query(request, values,(err,result) => {
          // if (err) reject(err);
          // //callback(result);
          // else resolve(result)
          if(err) reject(err)
          else resolve(result)
    });
  })
}


const auth=function(user){
  return new Promise((resolve,reject)=>{
    const request=`SELECT * FROM user WHERE ?`;
    const values={identif:user.identif}
    console.log(user)
    db.query(request,values, (err,result) => {
          if (err) reject("Connexion erreur!");
          else {
            var password=user.password
            console.log(result)
            if(result[0])
            {
              bcrypt.compare(password, result[0].password, function(err, resultBcrypt) {
                  if (err) reject(err);
                  else {
                    if(resultBcrypt)
                    {

                      generateJWT(result)
                      .then((resp)=>{
                          resp="Bearer "+resp
                          console.log("jihao:",user);
                          user.online=1
                          user.access_token=resp
                          user.id=result[0].id
                          user.password=result[0].password
                          // updateInfo(user);
                          save(user)
                          .then((res)=>{
                            resolve({confirmed_email:result[0].confirmed_email,userId:user.id,token:resp});
                          })
                      })
                    }
                    else
                      reject("Mot de passe est incorrecte!")
                  }
               });
            }
            else {
              reject("Identifiant n'existe pas!")
            }
          }
    });
  })
}

const generateJWT=function(user){
  return new Promise((resolve,reject)=>{
    console.log(user)
    const token=jwt.sign
    (
                      {

                      	identif:user.identif
                      },
                      'RANDOM_TOKEN_SECRET',
                      {expiresIn:"1h"}
    );
    resolve(token);
  })
}

const searchToken=function(token){
  return new Promise((resolve,reject)=>{
    console.log(token);
    const request="SELECT * FROM user WHERE reset_token = ? AND reset_at > NOW()";
    db.query(request,[token],(err,result)=>{
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log("searchToken success:",result);
        resolve(result);
      }
    })
  })
}

const searchMailToken=function(token){
  return new Promise((resolve,reject)=>{
    console.log(token);
    const request="SELECT * FROM user WHERE confirmed_token = ?";
    db.query(request,[token],(err,result)=>{
      if (err) {
        console.log(err);
        reject(err);
      }
      else {
        console.log("searchToken success:",result);
        resolve(result);
      }
    })
  })
}

const changePassword=function(list){
  return new Promise(function(resolve, reject) {
    const user={id:list.id};
    // const user={id:list.id,password:list.oldPassword}
    searchBy(user)
    .then((result)=>{
      // console.log(result)
      if(result)
      {
        bcrypt.compare(list.oldPassword, result.password, function(err, result) {
          // resolve(result)
          if (result) {
            bcrypt.hash(list.newPassword,salt,function(err,hash) {
              user.password=hash;
              user.reset_token=null;
              user.reset_at=null;
              save(user)
              .then((res)=>{
                resolve("Le mot de passe a bien été changé")
              })
            })
          }else {
            reject("Le mot de passe est incorrecte")
          }
        });
      }else {
        reject("Le mot de passe est incorrecte")
      }
    });
  });
}
const setNewPassword=function(user){
  return new Promise(function(resolve,reject) {
    console.log("setNewPassword");
    console.log(user);
    const request= `UPDATE user SET ? WHERE id=${user.id}`;
    bcrypt.hash(user.password,salt,function(err,hash) {
      if(err)
        console.log(err);
      console.log("start hash");
      user.password=hash;
      user.reset_token=null;
      user.reset_at=null;
      save(user)
      .then((res)=>{

        resolve("Le mot de passe a bien été changé")
      })
    })
  })
}

const confirmMail=function(user){
  return new Promise(function(resolve,reject) {
    console.log("confirmMail");
    console.log(user);
    const request= `UPDATE user SET ? WHERE id=${user.id}`;
    user.confirmed_token=null;
    user.confirmed_email=1;
    save(user)
    .then((res)=>{
      console.log(res);
      resolve("Email a bien été confirmé!")
    })
    .catch((e)=>{
      console.log(e);
      reject(e)
    })

  })
}



// const calculePopScore

module.exports={addUser,updateInfo,auth,searchBy,save,searchToken,searchMailToken,changePassword,setNewPassword,searchQuery,confirmMail,calculePopulaireBase};
