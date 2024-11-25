
const userController = require('../controllers/UserController')
 

 
const router =require('express').Router()
router.get('/getAlluser', userController.getUser);
router.get('/getNewUser/:branch', userController.getNewUser);

module.exports=router

