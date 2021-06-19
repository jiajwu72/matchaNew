var db=require('./index.js')

const listUserAction=function(req){
  return new Promise(function(resolve, reject) {
    const action=req.action
    const table=req.table
    const q1={from_user:action.from_user,to_user:action.to_user}
    const request=`SELECT * FROM ${table} WHERE from_user=${q1.from_user} AND to_user=${q1.to_user}`;
    // console.log(request);
    db.query(request,(err,result)=>{
      if (err){
        console.log(err)
        resolve(err);
      }
      else {
        resolve(result);
      }
    })
  });
}

const listActionArray=function(req){
  return new Promise(function(resolve, reject) {
    // const action=req.action
    const table=req.table
    // const q1={to_user:req.to_user}
    const request=`SELECT id,selectImg,updated_at FROM user WHERE id IN(SELECT from_user FROM ${table} WHERE to_user=${req.to_user})`;
    // console.log(request);
    db.query(request,(err,result)=>{
      if (err){
        console.log(err)
        reject(err);
      }
      else {
        resolve(result);
      }
    })
  });
}

const save=function(consulted,table){
  console.log("start save,request:",consulted);
  return new Promise((resolve,reject)=>{
    const decTime=3600000;
    consulted.updated_at=(new Date(Date.now()+decTime+3600000)).toISOString().slice(0, 19).replace('T', ' ');
    const request= `UPDATE ${table} SET ? WHERE id=${consulted.id}`
    const values=consulted;

    db.query(request, values,(err,result) => {
          if(err) reject(err)
          else resolve(result)
    });
  })
}

const addAction=function(req){
  return new Promise(function(resolve, reject) {
    const action=req.action
    const table=req.table
    const q1=[action.from_user,action.to_user]
    const request=`SELECT * FROM ${table} where from_user = ? AND to_user = ?`;
    db.query(request,q1,(err,result)=>{
      if (err){
        console.log(err)
        return reject(null);
      }

      if (result[0]) {
          action.id=result[0].id
          save(action,table)
          .then((result)=>{
            return resolve(result)
          })
      }else {
        const request=`INSERT INTO ${table} SET ?`;
        const decTime=3600000;
        action.updated_at=(new Date(Date.now()+decTime+3600000)).toISOString().slice(0, 19).replace('T', ' ');
        db.query(request,action,(err,result)=>{
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

const deleteAction=function(req){
    return new Promise(function(resolve, reject) {
      const action=req.action
      const table=req.table
      const q1=[action.from_user,action.to_user]
      const request=`DELETE FROM ${table} where from_user = ? AND to_user = ?`;
      db.query(request,q1,(err,result)=>{
        if (err){
          console.log(err)
          return reject(null);
        }
        return resolve(result);

      });
    });
}


module.exports={addAction,deleteAction,listUserAction,listActionArray}
