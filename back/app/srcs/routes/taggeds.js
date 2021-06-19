var express=require('express');
var router=express.Router();
const controller=require('../controller/Tagged');

router.get("/listTagged",controller.listTagged);
// router.post("/",controller.addTagged);

module.exports = router;
