const express = require('express');
const multer  = require('multer');
const router = express.Router();
const upload = multer({ dest: 'uploads/' });
const filterController = require('../controllers/Filter-Controller');


router.post('/filter-csv', upload.single('file'), filterController.filterVariant  );
router.post('/filter-cnv', upload.single('file'), filterController.filterCNV);

router.get('/download/:filename', filterController.download );


module.exports = router;
