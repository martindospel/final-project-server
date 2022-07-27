const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuid } = require('uuid')

const TeacherSchema = new Schema({
    uuid: {
        type: String,
        required: true,
        default: uuid
    },
    teacherName: {
        type: String,
        default: false,
        required: true
    },
    email: {
      type: String,
      required: true,
    }
})

const Teacher = mongoose.model("Teacher", TeacherSchema)

module.exports = Teacher;