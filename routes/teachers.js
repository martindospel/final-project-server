const { Teacher } = require('../db');
const express = require('express');
const router = express.Router();
const { v4: uuid } = require('uuid');

// get one teacher
router.get('/:uuid', async (req, res) => {
  const teacher = await Teacher.findOne({ uuid: req.params.uuid });
  res.send(teacher);
})

module.exports = router;
