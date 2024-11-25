
const LoadingTripRegisterController = require('../controllers/LoadingTripRegisterController')
 

 
const router =require('express').Router()
router.get('/getlslistforreportbydate/:branch', LoadingTripRegisterController.getlslistforreportbydate);
router.get('/getlslistforreportbydatesearch/:branch', LoadingTripRegisterController.getlslistforreportbydatesearch);
module.exports=router