const ActionModel=require('../model/Action');

class ActionController {

  addAction(req,res){
    console.log("addAction");
    ActionModel.addAction(req.body)
    .then((result)=>{
      res.send({res:result})
      // console.log(result);
    })
    .catch((e)=>{
      console.log(e);
    })
  }

  deleteAction(req,res){
    console.log("deleteAction");
    ActionModel.deleteAction(req.body)
    .then((result)=>{
      //console.log(result);
      res.send({res:result})
      // console.log(result);
    })
    .catch((e)=>{
      console.log(e);
    })
  }

  listUserAction(req,res){
    console.log("listUserAction");
    ActionModel.listUserAction(req.body)
    .then((result)=>{
      res.send({res:result})
    })
    .catch((e)=>{
      console.log(e);
    })
  }

  listActionArray(req,res){
    console.log("listActionArray");
    ActionModel.listActionArray(req.body)
    .then((result)=>{
      res.send({res:result})
    })
    .catch((e)=>{
      console.log(e);
    })
  }



}

module.exports=new ActionController()
