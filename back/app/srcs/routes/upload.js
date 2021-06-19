var express=require('express');
var router=express.Router();
var fs=require("fs-extra")
var multer=require("multer")
var path=require("path")
const UserModel = require('../model/User');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("req.body storage:",req.body)

    const host=process.env.HOST
    var dir='public/images/user/'+req.body.userId;
    // var dir=host;
    fs.exists(dir,exist=>{
      if(!exist){
        console.log(dir+" not exist");
        fs.mkdir(dir,error=>cb(error,dir))
      }
      else {
        console.log(dir+" is exist");
      }
      dir=dir+"/"+req.body.imgIndex

      fs.exists(dir,exist=>{
        if (!exist)
        {
          console.log(dir+" not exist");
          fs.mkdir(dir,error=>cb(error,dir))
        }
      })
      dir='public/images/user/'+req.body.userId+"/"+req.body.imgIndex;
      fs.readdir(dir, function(err, files) {
          if(files)
          {
            var i=files.length;
            console.log(files[0]);
            while (i >0) {
              fs.unlink(dir+'/'+files[--i])
            }
          }

      });
      return cb(null, dir);
    })
  },
  filename: function (req, file, cb) {
    const host=process.env.HOST
    const filename=file.fieldname+Date.now()+path.extname(file.originalname);
    console.log("create filename");
    const dirPath=host+'images/user/'+req.body.userId+"/"+req.body.imgIndex+"/"+filename;

    if(req.body.imgIndex=='1')
    {
      user={id:req.body.userId,img1:dirPath}
      console.log("index==1");
      UserModel.save(user)
      .then((result)=>{
        console.log(result);
      })
      .catch((e)=>{
        console.log(e);
      })
    }
    else if(req.body.imgIndex=='2')
    {
      user={id:req.body.userId,img2:dirPath}
      console.log("index==2");
      UserModel.save(user)
      .then((result)=>{
        console.log(result);
      })
      .catch((e)=>{
        console.log(e);
      })
    }
    else if(req.body.imgIndex=='3')
    {
      user={id:req.body.userId,img3:dirPath}
      console.log("index==3");
      UserModel.save(user)
      .then((result)=>{
        console.log(result);
      })
      .catch((e)=>{
        console.log(e);
      })
    }
    else if(req.body.imgIndex=='4')
    {
      user={id:req.body.userId,img4:dirPath}
      console.log("index==4");
      UserModel.save(user)
      .then((result)=>{
        console.log(result);
      })
      .catch((e)=>{
        console.log(e);
      })
    }
    else if(req.body.imgIndex=='5')
    {
      user={id:req.body.userId,img5:dirPath}
      console.log("index==5");
      UserModel.save(user)
      .then((result)=>{
        console.log(result);
      })
      .catch((e)=>{
        console.log(e);
      })
    }

    cb(null, filename)
  }
})

var upload = multer({ storage: storage }).single("image");

router.post("/",function(req,res){
  // console.log("update,req.body",req.body)
  upload(req, res, function (err) {
    res.redirect(process.env.FRONT_HOST+"myProfile")
  })


  // res.redirect("back")

})

module.exports = router;
