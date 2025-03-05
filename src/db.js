const mongoose = require('mongoose')

let cachedDB
const uri = process.env.MONGODB_URI
if (!uri){
    throw new Error('Please add URI to env vars')
}

async function connectToDatabase() {
    if(cachedDB){
        return cachedDB
    }
    console.log('Creating new DB connection')
    cachedDB = mongoose.connect( uri )
    
    return cachedDB
}


module.exports = connectToDatabase

// const USERS = []


// function getAllStudents(){
//   return USERS.map(user => ({name:user.student_name, matric_no:user.matric_no}))
// }
// function getUserByMatricNo(matric_no) {
//   return USERS.find(user => user.matric_no === matric_no)
// }

// function createUser(id, matric_no,student_name,aaguid, passKey) {
//   USERS.push({ id, matric_no,aaguid,student_name, passKey })
// }



// module.exports = {
//   getUserByMatricNo,
//   getAllStudents,
//   createUser,
// }
