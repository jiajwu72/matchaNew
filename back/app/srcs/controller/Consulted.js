
const ConsultedModel=require('../model/Consulted');

class ConsultedController {

  listConsulted(req,res){
    console.log("listConsulted");
    ConsultedModel.listConsulted()
    .then((result)=>{
      res.send({res:result})
      // console.log(result);
    })
    .catch((e)=>{
      console.log(e);
    })
  }


  addConsulted(req,res){
    console.log("addConsulted");
    ConsultedModel.addConsulted(req.body)
    .then((result)=>{
      res.send({res:result})
      // console.log(result);
    })
    .catch((e)=>{
      console.log(e);
    })
  }



}

module.exports=new ConsultedController()
