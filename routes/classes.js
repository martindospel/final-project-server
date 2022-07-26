const { Class, Student } = require('../db');
const express = require('express');
const router = express.Router();

// get one class
router.get('/:uuid', async (req, res) => {
  const className = await Class.findOne({ uuid: req.params.uuid });
  res.send(className);
})

// create one class
router.post('/add/:uuid', async (req, res) => {
  const className = await Class.create({...req.body, teacherUuid: req.params.uuid});
  res.send(className);
})

// get all classes for teacher
router.get('/all/:teacherUuid', async (req, res) => {
  const classNames = await Class.find({teacherUuid : req.params.teacherUuid});
  res.send(classNames);
})

// add one student to class
router.post('/:uuid', async (req, res) => {
  const className = await Class.findOne({ uuid: req.params.uuid });
  const student = await Student.findOne({ uuid: req.body.uuid })
  className.students.push({ uuid: req.body.uuid, name: student.studentName });
  await className.save();
  res.send(className);
})

module.exports = router;
