const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    spd: {
        type: Date,
        required: true
    },
    name: {
        type: String,
        required: true
    },

    role: {
        type: String,
        required: true
    },
    salary: {
        type: String,
        required: true
    },
    exp: {
        type: String,
        required: true
    },
    leave: {
        type: String,
        required: true
    },

});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;