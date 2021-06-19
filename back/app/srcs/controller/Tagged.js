
const TaggedModel=require('../model/Tagged');

class TaggedController {

  listTagged(req,res){
    console.log("listTagged");
    TaggedModel.listTagged()
    .then((result)=>{
      res.send({res:result})
      // console.log(result);
    })
    .catch((e)=>{
      console.log(e);
    })
  }

  // addTagged(req,res){
  //   console.log("addTagged");
  //   TaggedModel.addTagged(req.body)
  //   .then((result)=>{
  //     res.send({res:result})
  //   })
  //   .catch((e)=>{
  //     res.send({error:e})
  //   })
  // }


}

module.exports=new TaggedController()
