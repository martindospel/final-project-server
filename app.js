require('dotenv').config();
const cors = require('cors')
const express = require('express');
const app = express();
const { studentRouter, teacherRouter, classRouter } = require('./routes');

app.use(express.json());
app.use(cors());

app.use('/api/students', studentRouter);
app.use('/api/teachers', teacherRouter);
app.use('/api/classes', classRouter);

if (!module.parent) {
  app.listen(4321, () => console.log('server running on port: 4321'));
};

module.exports = app;
