
const TagModel=require('../model/Tag');

class TagController {

  listTag(req,res){
    // const tag=req.params
    // console.log(req.params);
    console.log("listTag");
    TagModel.listTag()
    .then((result)=>{
      res.send({res:result})
      // console.log(result);
    })
    .catch((e)=>{
      console.log(e);
    })
  }

  addTag(req,res){
    console.log("addTag");
    TagModel.addTag(req.body)
    .then((result)=>{
      res.send({res:result})
    })
    .catch((e)=>{
      res.send({error:e})
    })
  }

  getMatch(req,res){
    var user=req.params
    TagModel.getMatch(user)
    .then((result)=>{
      res.send({res:result})
    })
    .catch((e)=>{
      res.send({error:e})
    })
  }

  matchUser(req,res){
    var tagged=req.body
    TagModel.matchUser(tagged)
    .then((result)=>{
      res.send({res:result})
    })
    .catch((e)=>{
      res.send({error:e})
    })
  }

  deleteMatch(req,res){
    var tagged=req.body
    console.log("deleteMatch tagged:",tagged);
    // console.log("deleteMatch tagged:",req.params);
    TagModel.deleteMatch(tagged)
    .then((result)=>{
      res.send({res:result})
    })
    .catch((e)=>{
      res.send({error:e})
    })
  }

}

module.exports=new TagController()
