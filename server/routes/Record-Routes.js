const express = require('express');
const router = express.Router();
const recordsController = require('../controllers/Records-Controller');

/**
 * @desc Route for downloading a file from the records directory
 * @route GET /api/records/download/:path(*)
 * @access Public
 */
router.get('/download/:path(*)', recordsController.downloadFile);

/**
 * @desc Route for downloading a folder from the records directory
 * @route GET /api/records/downloadFolder/:path(*)
 * @access Public
 */
router.get('/downloadFolder/:path(*)', recordsController.downloadFolder);

/**
 * @desc Route for getting all records from the records directory
 * @route GET /api/records/*
 * @access Public
 */
router.get('/*', recordsController.getAll);

/**
 * @desc Route for getting all records from the records directory using a path parameter
 * @route GET /api/records/:path*
 * @access Public
 */
router.get('/:path*', recordsController.getAll);

/**
 * @desc Route for deleting a file or folder from the records directory
 * @route DELETE /api/records/delete/:path(*)
 * @access Public
 */
router.delete('/delete/:path(*)', recordsController.deleteItem);

module.exports = router;
