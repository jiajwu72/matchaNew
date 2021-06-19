
var express=require('express');
var router=express.Router();
const controller=require('../controller/User');
const notificationController=require('../controller/Notification');
const messageController=require('../controller/Message');



router.get('/:id/get',controller.getInfo) //get user information
router.post('/:id/notification/readed',notificationController.readed)
router.post('/:id/message/chatWith',messageController.list)
router.post('/add',controller.addUser)  //add users
router.post('/searchQuery',controller.searchQuery)  //search users with some conditions
router.post('/list',controller.list)  //list all users
router.post('/:id/update',controller.updateInfo)  //update users
router.post('/:id/updateEmail',controller.updateEmail)  //update users
router.post('/:id/defineProfil',controller.defineProfil)  //update users
router.post('/auth',controller.auth)  //connect users
router.post('/logout',controller.logout)  //logout users
router.post('/forgot',controller.forgot)  //forgot password/verrif user email
router.get('/reset/:token',controller.resetCheck)  //verrif forgot token
router.post('/reset/:token',controller.reset)  //list users
router.get('/confirmMail/:token',controller.confirmMailCheck)  //verrif forgot token
router.post('/confirmMail/:token',controller.confirmMail)  //list users



module.exports = router;
