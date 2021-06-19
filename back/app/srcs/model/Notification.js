var db=require('./index.js')

const list=function(notif){
  return new Promise(function(resolve, reject) {
    const request="SELECT id,from_user,from_user_profil,content,readed FROM notification WHERE ?";
    db.query(request,notif,(err,result)=>{
      if (err){
        console.log("err:",err)
        reject(err);
      }
      else resolve(result);
    });
  });
}

const add=function(notif){
  return new Promise(function(resolve, reject) {
    const request="INSERT INTO notification SET ?";
    db.query(request,notif,(err,result)=>{
      if (err){
        console.log(err)
        reject(err);
      }
      else resolve(result);
    });
  });
}

const readed=function(notif){
  return new Promise(function(resolve, reject) {
    const request= `UPDATE notification SET readed=1 WHERE ?`
    db.query(request,notif,(err,result)=>{
      if (err){
        console.log(err)
        reject(err);
      }
      else resolve(result);
    })
  });
}

module.exports={list,add,readed};
