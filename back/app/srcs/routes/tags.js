var express=require('express');
var router=express.Router();
const controller=require('../controller/Tag');

router.get("/listTag",controller.listTag);
router.get("/addTag",controller.addTag);
router.get("/getMatch/:id",controller.getMatch);
router.post("/matchUser",controller.matchUser);
router.delete("/deleteMatch",controller.deleteMatch);

// router.post("/add",controller.addNewTag);
// router.post("/matchUser",controller.matchUser);
// router.post("/dismatchUser",controller.dismatchUser);

module.exports = router;
