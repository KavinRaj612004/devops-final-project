const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    batch: {
        type: String,
        required: true
    },
    roll_number: {
        type: String,
        required: true
    },
    cgpa: {
        type: Number,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    blood_group: {
        type: String,
        required: true
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = Student = mongoose.model("Student", StudentSchema);
