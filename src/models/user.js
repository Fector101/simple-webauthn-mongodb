// Contains Scheme For DB

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    student_name: { type: String, required: true},
    matric_no: { type: String, required: true, unique: true }
    }, { timestamps: true }
)


module.exports = mongoose.model('User', UserSchema);
