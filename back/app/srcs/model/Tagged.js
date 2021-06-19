var db=require('./index.js')

const listTagged=function(){
  return new Promise(function(resolve, reject) {
    const request=`SELECT * FROM tagged`;
    db.query(request,(err,result)=>{
      if (err){
        console.log(err)
        resolve(null);
      }
      else resolve(result);
    })
  });
}


module.exports={listTagged}
