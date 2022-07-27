require("dotenv").config();
const { v4: uuid } = require("uuid");

const { uniqueNamesGenerator, names } = require("unique-names-generator");

const config = {
  dictionaries: [names],
};

const generateName = () => uniqueNamesGenerator(config);

const { Student } = require("./db");

const createStudents = async () => {
  const classUuid = process.argv[2];
  const students = [];

  // add 20 students
  for (let i = 0; i < 20; i++) {
    // for each student add 60 timeline status
    const student = {
      uuid: uuid(),
      studentName: generateName(),
      dob: new Date().toISOString(),
      classUuid,
      assessments: [],
      gender: Math.random() > 0.49 ? "male" : "female",
    };
    const date = new Date();
    let j = 0;
    while (j < 90) {
      student.assessments.push({
        uuid: uuid(),
        date: date.toISOString(),
        present: Math.random() > 0.06,
        goodPerf: Math.random() > 0.09,
        goodBehave: Math.random() > 0.12,
        perfComment: "A random performance comment",
        behaveComment: "A random behaviour comment",
      });
      j++;
      if (j % 5 === 0) {
        date.setDate(date.getDate() + 3);
      } else {
        date.setDate(date.getDate() + 1);
      }
    }
    students.push(student);
  }
  Student.insertMany(students)
    .then(() => console.log("done, students added!"))
    .catch(() => console.log("an error occured"));
};

createStudents();
