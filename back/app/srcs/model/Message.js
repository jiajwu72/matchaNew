var db=require('./index.js')

const list=function(chat){
  return new Promise(function(resolve, reject) {
    const request=`SELECT id,from_user,content,readed
                  FROM message WHERE
                  (from_user=${chat.user1} AND to_user=${chat.user2}) OR
                  (from_user=${chat.user2} AND to_user=${chat.user1})`;
    // console.log(request);
    db.query(request,(err,result)=>{
      if (err){
        console.log("err:",err)
        reject(err);
      }
      else {
        // console.log(result);
        resolve(result);
      }
    });
  });
}

const add=function(notif){
  return new Promise(function(resolve, reject) {
    const request="INSERT INTO message SET ?";
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
    const request= `UPDATE message SET readed=1 WHERE ?`
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
