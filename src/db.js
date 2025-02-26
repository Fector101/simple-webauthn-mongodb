// const mongoose = require('mongoose')

// let cachedDB
// const uri = process.env.MONGO_URI

// if (!uri){
//     throw new Error('Please add URI to env vars')
// }

// async function connectToDatabase() {
//     if(cachedDB){
//         return cachedDB
//     }
//     console.log('Creating new DB connection')
//     cachedDB = mongoose.connect( uri, {useNewUrlParser: true} )
    
//     return cachedDB
// }

// module.exports = connectToDatabase

const USERS = []

function getUserByMatricNo(matric_no) {
  return USERS.find(user => user.matric_no === matric_no)
}

function getUserById(id) {
  return USERS.find(user => user.id === id)
}

function getUserByaaguid(aaguid) {
  console.log(USERS,'<--------- USERS')
  return USERS.find(user => user.aaguid === aaguid)
}

function createUser(id, matric_no,student_name,aaguid, passKey) {
  USERS.push({ id, matric_no,aaguid,student_name, passKey })
}

function updateUserCounter(id, counter) {
  const user = USERS.find(user => user.id === id)
  user.passKey.counter = counter
}

module.exports = {
  getUserByMatricNo,
  getUserById,
  getUserByaaguid,
  createUser,
  updateUserCounter,
}
