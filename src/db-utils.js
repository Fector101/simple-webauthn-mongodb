const Student = require('./models/Student');

async function getAllStudents() {
    const users = await Student.find();
    return users.map(user => ({ name: user.student_name, matric_no: user.matric_no }));
}


async function getUserByMatricNo(matric_no) {
    return await Student.findOne({ matric_no });
}


async function createUser(id, matric_no, student_name, aaguid, passKey) {
    const user = new Student({ id, matric_no, student_name, aaguid, passKey });
    await user.save();
}

async function getUserById(id) {
    return await Student.findOne({ id });
}

module.exports = {
    getUserByMatricNo,
    getAllStudents,
    createUser,
    getUserById
};
