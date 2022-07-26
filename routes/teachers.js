const { Teacher } = require('../db');
const express = require('express');
const router = express.Router();

// get one teacher
router.get('/:uuid', async (req, res) => {
  const teacher = await Teacher.findOne({ uuid: req.params.uuid });
  res.send(teacher);
})

router.post('/signin', async (req, res) => {
  const teacher = await Teacher.findOne({ fullName: req.body.fullName, email: req.body.email });
  if (teacher) {
    res.send(teacher)
  } else {
    const newTeacher = await Teacher.create({ fullName: req.body.fullName, email: req.body.email });
    res.send(newTeacher)
  }
})

module.exports = router;
