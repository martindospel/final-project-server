require("dotenv").config();

const { uniqueNamesGenerator, names } = require("unique-names-generator");

const config = {
  dictionaries: [names],
};

const generateName = () => uniqueNamesGenerator(config);

const { Student } = require("./db");

const createStudents = async () => {
  const classUuid = "1";
  const students = [];

  // add 20 students
  for (let i = 0; i < 20; i++) {
    // for each student add 60 timeline status
    const student = {
      uuid: i + 1,
      studentName: generateName(),
      dob: new Date().toLocaleString(),
      classUuid,
      assessments: [],
      gender: Math.random() > 0.49 ? "male" : "female",
    };
    for (let j = 0; j < 60; j++) {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      student.assessments.push({
        uuid: j,
        date: date.toISOString(),
        present: Math.random() > 0.06,
        goodPerf: Math.random() > 0.09,
        goodBehave: Math.random() > 0.12,
        perfComment: "A random performance comment",
        behaveComment: "A random behaviour comment",
      });
    }
    students.push(student);
  }
  Student.insertMany(students).then(console.log).catch(console.log);
};

createStudents();
