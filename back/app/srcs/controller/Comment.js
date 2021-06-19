// const commentModel = require('../model/Comment');
//
// class CommentController {
//
//
//
//   findAll(req, res) {
//     commentModel.find({}, function(err,docs){
//       res.send(docs);
//       res.status(200).json(docs);
//     });
//   }
//
//   findOne(req,res){
//     const search=req.params.commentId;
//     console.log("request:"+search)
//     commentModel.findOne({"_id":search}, function(err,docs){
//       res.send(docs);
//     });
//   }
//
//   register(req, res) {
//     const comment=req.body;
//     console.log(comment)
//     commentModel.create(comment, function (err, doc) {
//       if (err) {
//         console.log(err)
//         res.status(401).json({"msg":"create comment error"});
//       } else {
//         res.status(200).json({"comment":doc});
//       }
//     });
//   }
//
//
// }
//
//
// module.exports = new CommentController();
