
const LRController = require('../controllers/LRController')
 

 
const router =require('express').Router()
router.get('/getallLr/:branch', LRController.getallLr);
router.get('/getallLrsearch/:branch', LRController.getallLrsearch);
router.get('/getlrbyid/:id', LRController.getlrbyid);
router.get('/checklrforupdate/:id', LRController.checklrforupdate);
 router.post('/addlrmaster', LRController.addlrmaster);
 router.post('/sendMail', LRController.sendMail);
 router.get('/getLRByIdPdfmail/:id', LRController.getLRByIdPdfmail);
 router.get('/getConsignor/:id', LRController.getConsignor);
 router.put('/upadtelrmaster/:id', LRController.upadtelrmaster);
router.delete('/deletelrmaster/:id', LRController.delete_lr_master);
router.get('/getLRByIdPdf/:id', LRController.getLRByIdPdf);
router.get('/generatelrno/:branch', LRController.generatelrno);
router.get('/getLRByIdPdfForPrint/:id', LRController.getLRByIdPdfForPrint);
router.get('/getemail', LRController.getemail);

module.exports=router























