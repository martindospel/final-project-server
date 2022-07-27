const { Class, Student } = require("../db");
const express = require("express");
const router = express.Router();

Date.prototype.getWeek = function () {
  var onejan = new Date(this.getFullYear(), 0, 1);
  return Math.ceil(((this - onejan) / 86400000 + onejan.getDay() + 1) / 7);
};

// get one class
router.get("/:uuid", async (req, res) => {
  const theClass = await Class.findOne({ uuid: req.params.uuid });
  if (!theClass) return res.sendStatus(404);
  const students = await Student.find({ classUuid: theClass?.uuid });
  res.send({
    uuid: theClass.uuid,
    className: theClass.className,
    students: students.map((st) => ({ uuid: st.uuid, name: st.studentName })),
  });
});

// create one class
router.post("/add/:uuid", async (req, res) => {
  const className = await Class.create({
    ...req.body,
    teacherUuid: req.params.uuid,
  });
  res.send(className);
});

// get all classes for teacher
router.get("/all/:teacherUuid", async (req, res) => {
  const classNames = await Class.find({ teacherUuid: req.params.teacherUuid });
  res.send(classNames);
});

// add one student to class
router.post("/:uuid", async (req, res) => {
  const className = await Class.findOne({ uuid: req.params.uuid });
  const student = await Student.findOne({ uuid: req.body.uuid });
  className.students.push({ uuid: req.body.uuid, name: student.studentName });
  await className.save();
  res.send(className);
});

router.get("/statistics/:uuid", async (req, res) => {
  const students = await Student.find({ classUuid: req.params.uuid });
  let statistics = {};
  const studentStats = [];
  students.forEach(({ assessments }) => {
    const totalPresentDays = assessments.reduce(
      (acc, cur) => (cur.present ? acc + 1 : acc),
      0
    );
    const presenceRate = totalPresentDays / assessments.length;
    const goodPerfRate =
      assessments.reduce((acc, cur) => (cur.goodPerf ? acc + 1 : acc), 0) /
      assessments.length;
    const goodBehaveRate =
      assessments.reduce((acc, cur) => (cur.goodBehave ? acc + 1 : acc), 0) /
      assessments.length;

    const weeklyStats = {
      presence: {},
      goodPerf: {},
      goodBehave: {},
    };

    assessments.forEach((timelinePoint) => {
      const weekNumber = new Date(timelinePoint.date).getWeek().toString();
      if (timelinePoint.present) {
        if (weeklyStats.presence[weekNumber]) {
          weeklyStats.presence[weekNumber] += 1;
        } else {
          weeklyStats.presence[weekNumber] = 1;
        }
        if (timelinePoint.goodPerf) {
          if (weeklyStats.goodPerf[weekNumber]) {
            weeklyStats.goodPerf[weekNumber] += 1;
          } else {
            weeklyStats.goodPerf[weekNumber] = 1;
          }
        }
        if (timelinePoint.goodBehave) {
          if (weeklyStats.goodBehave[weekNumber]) {
            weeklyStats.goodBehave[weekNumber] += 1;
          } else {
            weeklyStats.goodBehave[weekNumber] = 1;
          }
        }
      }
    });

    studentStats.push({
      presenceRate,
      goodPerfRate,
      goodBehaveRate,
      weeklyStats,
      totalPresentDays,
    });
  });
  statistics.totalStudentCount = students.length;
  statistics.averagePresenceRate = (
    (studentStats.reduce((acc, cur) => acc + cur.presenceRate, 0) /
      students.length) *
    100
  ).toFixed(1);
  statistics.averageGoodPerfRate = (
    (studentStats.reduce((acc, cur) => acc + cur.goodPerfRate, 0) /
      students.length) *
    100
  ).toFixed(1);
  statistics.averageGoodBehaveRate = (
    (studentStats.reduce((acc, cur) => acc + cur.goodBehaveRate, 0) /
      students.length) *
    100
  ).toFixed(1);

  const weeklyPresenceRate = {};
  const weeklyPerfRate = {};
  const weeklyBehaveRate = {};
  studentStats.forEach(({ weeklyStats }) => {
    for (const key in weeklyStats.presence) {
      if (weeklyPresenceRate[key]) {
        weeklyPresenceRate[key] += weeklyStats.presence[key];
      } else {
        weeklyPresenceRate[key] = weeklyStats.presence[key];
      }
    }
    for (const key in weeklyStats.goodPerf) {
      if (weeklyPerfRate[key]) {
        weeklyPerfRate[key] += weeklyStats.goodPerf[key];
      } else {
        weeklyPerfRate[key] = weeklyStats.goodPerf[key];
      }
    }
    for (const key in weeklyStats.goodBehave) {
      if (weeklyBehaveRate[key]) {
        weeklyBehaveRate[key] += weeklyStats.goodBehave[key];
      } else {
        weeklyBehaveRate[key] = weeklyStats.goodBehave[key];
      }
    }
  });
  const totalPresentDaysForAll = studentStats.reduce((acc, curr) => acc + curr.totalPresentDays, 0);
  statistics.presenceRateWeekly = Object.values(weeklyPresenceRate).map((v) =>
    ((v / students.length / 5) * 100).toFixed(1)
  );
  statistics.goodPerfRateWeekly = Object.values(weeklyPerfRate).map((v) =>
    ((v / totalPresentDaysForAll) * 100).toFixed(1)
  );
  statistics.goodBehaveRateWeekly = Object.values(weeklyBehaveRate).map((v) =>
    ((v / totalPresentDaysForAll) * 100).toFixed(1)
  );
  res.send(statistics);
});

module.exports = router;
