
var express=require('express');
var router=express.Router();
const controller=require('../controller/Notification');

router.get("/:userId/notification/",controller.list);
// router.post("/",controller.add);

module.exports = router;
