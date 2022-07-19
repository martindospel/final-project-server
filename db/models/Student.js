const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuid } = require('uuid')

const StudentSchema = new Schema({
    uuid: {
        type: String,
        default: uuid
    },
    studentName: {
        type: String,
        default: false,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    classUuid: {
        type: String,
        required: true
    },
    assessments: {
        type: [Object],
        default: []
    },
    gender: {
        type: String,
        required: false
    },
})

const Student = mongoose.model("Student", StudentSchema)

module.exports = Student;