
const ProfileController = require('../controllers/ProfileController')
 

 
const router =require('express').Router()
router.get('/getprofile', ProfileController.getprofile);
router.get('/getprofilebyid/:id', ProfileController.getprofilebyid);
router.put('/UpadteProfile/:id', ProfileController.UpadteProfile);
module.exports=router