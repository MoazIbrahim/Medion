const courses = require('./courses');
const Course = require('./models/courses'); 
const assignments = require('./assignments');
const Assignment = require('./models/assignments');
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/newSenior');




async function saveCourses() {
  try {
    await Course.insertMany(courses);
    console.log('Courses saved successfully.');
  } catch (error) {
    console.error('Error saving courses:', error.message);
  } finally {
    mongoose.connection.close();
  }
}
// async function saveAssignments() {
//   try {
//     await Assignment.insertMany(assignments);
//     console.log('Assignments saved successfully.');
//   } catch (error) {
//     console.error('Error saving assignments:', error.message);
//   } finally {
//     mongoose.connection.close();
//   }
// }
// saveAssignments();

saveCourses();