
const ArticalController = require('../controllers/ArticalController')
 

 
const router =require('express').Router()
router.get('/getArtical', ArticalController.getArtical);
router.get('/getEmail', ArticalController.getEmail);
router.get('/getArticals', ArticalController.getArticals);
router.get('/getArticalbyid/:id', ArticalController.getArticalbyid);
router.get('/getEmailbyid/:id', ArticalController.getEmailbyid);
router.put('/UpadteArtical/:id', ArticalController.UpadteArtical);
router.put('/UpadteEmail/:id', ArticalController.UpadteEmail);
router.post('/addArtical', ArticalController.AddArtical);
router.post('/addemail', ArticalController.AddEmail);
router.delete('/deleteArtical/:id', ArticalController.deleteArtical);
router.delete('/deleteEmail/:id', ArticalController.deleteEmail);


module.exports=router