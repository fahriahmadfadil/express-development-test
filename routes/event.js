const express = require("express");
const router = express.Router();
const materialController = require("../controllers/event")

/* Router of materials module. */
router.get('/events',materialController.showAllData)
router.get('/events/:id',materialController.showOneData)
router.post('/events',materialController.insertData)
router.put('/events/:id',materialController.updateData)
router.delete('/events/:id',materialController.deleteData)

module.exports = router;
