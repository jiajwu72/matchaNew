var express=require('express');
var router=express.Router();
const controller=require('../controller/Action');


router.post("/addAction",controller.addAction);
router.post("/deleteAction",controller.deleteAction);
router.post("/listUserAction",controller.listUserAction);
router.post("/listActionArray",controller.listActionArray);
// router.post("/addReport",controller.addReport);
// router.post("/addLike",controller.addLike);
// router.post("/deleteLike",controller.deleteLike);
// router.get("/listAction",controller.listAction);
// router.post("/",controller.addAction);

module.exports = router;
