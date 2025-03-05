
async function getAllStudents() {
    const users = await User.find();
    return users.map(user => ({ name: user.student_name, matric_no: user.matric_no }));
}


async function getUserByMatricNo(matric_no) {
    return await User.findOne({ matric_no });
}


async function createUser(id, matric_no, student_name, aaguid, passKey) {
    const user = new User({ id, matric_no, student_name, aaguid, passKey });
    await user.save();
}

async function getUserById(id) {
    return await User.findOne({ id });
}

module.exports = {
    getUserByMatricNo,
    getAllStudents,
    createUser,
    getUserById
};
