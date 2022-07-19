const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuid } = require('uuid')

const ClassSchema = new Schema({
    uuid: {
        type: String,
        required: true,
        default: uuid
    },
    className: {
        type: String,
        default: false,
        required: true
    },
    students: {
        type: [Object],
        default: []
    }
})

const Class = mongoose.model("Class", ClassSchema)

module.exports = Class;