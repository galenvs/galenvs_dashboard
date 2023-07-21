const express = require('express');
const router = express.Router();
const recordsController = require('../controllers/Records-Controller');


router.get('/download/:path(*)', recordsController.downloadFile );

router.get('/downloadFolder/:path(*)', recordsController.downloadFolder );

router.get('/*', recordsController.getAll);

router.get('/:path*', recordsController.getAll);

router.delete('/delete/:path(*)',recordsController.deleteItem);




module.exports = router;
