var db=require('./index.js')

const listTag=function(){
  return new Promise(function(resolve, reject) {
    const request=`SELECT * FROM tag`;
    db.query(request,(err,result)=>{
      if (err){
        console.log(err)
        resolve(null);
      }
      else resolve(result);
    })
  });
}

const addTag=function(tag){
  const dec=+2*60*60*1000;
  tag.created_at=(new Date(Date.now()+dec)).toISOString().slice(0, 19).replace('T', ' ');
  tag.updated_at=(new Date(Date.now()+dec)).toISOString().slice(0, 19).replace('T', ' ');
  // console.log("2:",tag);
  return new Promise(function(resolve, reject) {
    const request="INSERT INTO tag SET ?";
    db.query(request,tag,(err,result)=>{
      if (err)
      {
        return resolve({error:err})
      }
      return resolve({res:result})
    })
  });
}

const getMatch=function(user){
  return new Promise(function(resolve, reject) {
    const tagged={user_id:user.id}
    var request="SELECT * FROM tagged WHERE ?"

    db.query(request,tagged,async (err,result)=>{
      if (err) {
        return reject(err)
      }
      var final=[]
      var i=-1
      if(result[0]){
        // console.log("result:",result);
        while (result[++i]) {
          final.push(result[i].tag_id)
        }
        // console.log(final);
        request="SELECT * FROM tag WHERE id IN ("+final+")"
        db.query(request,(err,result)=>{
          if(err)
            reject(err)
          // console.log("result:",result);
          return resolve(result)
        })
        // console.log("final:",final);
        // return resolve(final)
      }else {
        return resolve([])
      }


    })

  });
}

const matchUser=function(tagged){
  return new Promise(function(resolve, reject) {
    var request="INSERT INTO tagged SET ?";

    db.query(request,tagged,(err,result)=>{
      if (err) {
        return reject(err)
      }
      return resolve(result)
    })
  });
}

const deleteMatch=function(tagged){
  return new Promise(function(resolve, reject) {
    var request=`DELETE FROM tagged WHERE tag_id=${tagged.tag_id} AND user_id=${tagged.user_id}`;

    db.query(request,(err,result)=>{
      if (err) {
        return reject(err)
      }
      return resolve(result)
    })
  });
}

module.exports={listTag,addTag,getMatch,matchUser,deleteMatch}
