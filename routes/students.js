const { Student } = require("../db");
const express = require("express");
const router = express.Router();
const { v4: uuid } = require("uuid");

const timeline = [
  { date: "07/25/2022", name: "shit1" },
  { date: "07/23/2022", name: "shit2" },
  { date: "07/25/2022", name: "shit3" },
  { date: "07/21/2022", name: "shit4" },
  { date: "07/27/2022", name: "shit5" },
  { date: "07/10/2022", name: "shit6" },
  { date: "07/11/2022", name: "shit7" },
  { date: "07/20/2022", name: "shit8" },
];

// get one student
router.get("/:uuid", async (req, res) => {
  const student = await Student.findOne({ uuid: req.params.uuid });
  student?.assessments?.sort((a, b) => new Date(a.date) - new Date(b.date));
  res.send(student);
});

// add one student to the class
router.post("/", async (req, res) => {
  const student = await Student.create(req.body);
  student.save();
  res.send(student);
});

// add one student timeline
router.post("/:uuid", async (req, res) => {
  const student = await Student.findOne({ uuid: req.params.uuid });
  student.assessments.push({ ...req.body, uuid: uuid() });
  student.save();
  res.send(student);
});

// update one student timeline
router.patch("/:studentUuid/:timelineUuid", async (req, res) => {
  const student = await Student.findOne({ uuid: req.params.studentUuid });
  const timelineIndex = student.assessments.findIndex(
    (timeline) => timeline.uuid === req.params.timelineUuid
  );
  student.assessments[timelineIndex] = {
    ...req.body,
    uuid: req.params.timelineUuid,
  };
  student.save();
  res.send(student);
});

// delete one student from the class
router.delete("/:uuid", async (req, res) => {
  await Student.deleteOne({ uuid: req.params.uuid });
  res.sendStatus(200);
});



module.exports = router;
