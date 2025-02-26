// Contains Scheme For DB

const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    id: { type: String, required: true },
    matric_no: { type: String, required: true, unique: true },
    student_name: { type: String, required: true},
    passKey: { type: Object, required: true },

    // public_key: { type: String, required: true },
    // counter: { type: Number, required: true, default: 0 },
    // deviceType: { type: String, required: true },
    // backedUp: { type: Boolean, required: true },
    // transports: { type: Array, required: true },
    }, { timestamps: true }
)


module.exports = mongoose.model('Student', StudentSchema);
