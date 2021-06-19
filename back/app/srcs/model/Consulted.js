var db=require('./index.js')



const listConsulted=function(){
  return new Promise(function(resolve, reject) {
    const request=`SELECT * FROM consulted`;
    db.query(request,(err,result)=>{
      if (err){
        console.log(err)
        resolve(null);
      }
      else resolve(result);
    })
  });
}

const save=function(consulted){
  console.log("start save,request:",consulted);
  return new Promise((resolve,reject)=>{
    // consulted.updated_at="NOW()";
    const decTime=3600000;
    consulted.updated_at=(new Date(Date.now()+decTime+3600000)).toISOString().slice(0, 19).replace('T', ' ');
    const request= `UPDATE consulted SET ? WHERE id=${consulted.id}`
    const values=consulted;

    db.query(request, values,(err,result) => {
          if(err) reject(err)
          else resolve(result)
    });
  })
}

const addConsulted=function(consulted){
  return new Promise(function(resolve, reject) {
    const q1=[consulted.from_user,consulted.to_user]
    const request=`SELECT * FROM consulted where from_user = ? AND to_user = ?`;
    db.query(request,q1,(err,result)=>{
      if (err){
        console.log(err)
        return reject(null);
      }

      if (result[0]) {
          consulted.id=result[0].id
          save(consulted)
          .then((result)=>{
            return resolve(result)
          })
      }else {
        const request="INSERT INTO consulted SET ?";
        db.query(request,consulted,(err,result)=>{
          if (err){
            console.log(err)
            return reject(null);
          }
          return resolve(result);
        })
      }

    })
  });
}


module.exports={listConsulted,addConsulted}
