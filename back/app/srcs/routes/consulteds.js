var express=require('express');
var router=express.Router();
const controller=require('../controller/Consulted');

router.post("/",controller.addConsulted);

module.exports = router;
