if (process.env.NODE_ENV !== 'production') {
   require('dotenv').config()
}

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const {v4 : uuidV4} = require('uuid');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const User = require('./models/user');
const Course = require('./models/courses');
const Assignment = require('./models/assignments');
const Submission = require('./models/submissions');
const Announcement = require('./models/announcements');
const Post = require('./models/post');
const Message = require('./models/messages');
const Payment = require('./models/payments');
const methodOverride = require('method-override');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const passportLocal = require('passport-local');
const ExpressError = require('./utils/ExpressError');
const asyncCatch = require('./utils/catchAsync');
const bodyParser = require('body-parser');
const passportLocalMongoose = require('passport-local-mongoose');
const { isLoggedIn, isPaidUp } = require('./middleware');
const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const Middleware = require('i18next-http-middleware');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const {storage} = require('./cloudinary/index');
const { extractTextFromPDF , checkPlagiarism } = require('./utils/pdf');
const courses = require('./models/courses');
const upload = multer({storage});




mongoose.connect('mongodb://127.0.0.1:27017/newSenior')
.then(function(e) { 
    console.log('CONNECTION TO MONGOOSE OPEN !')

})
.catch(function(e) {
    console.log('CONNECTION TO MONGOOOSE FAILED :(');
    console.log(e);
});



app.use(express.static(__dirname + '/assets'));
app.engine('ejs', ejsMate );
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');
app.use('/socket.io', express.static(__dirname + '/node_modules/socket.io/client-dist'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const sessionConfig = {
   secret: 'thisismedionwhichisistanbulmedipoluniversitywebsiteapplication',
   resave: false,
   saveUninitialized : true,
   cookies: {
       httpOnly : true,
       expires: Date.now() + 1000*60*60*24*7,
       maxAge : 1000*60*60*24*7
   }

}


app.use(passport.initialize());
app.use(session(sessionConfig));
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash());
app.use((req,res,next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();

});

i18next.use(Backend).use(Middleware.LanguageDetector)
 .init({
  fallbackLng:'en',
  resources: {
    en : {
      translation : require('./assets/translations/en.json')
    },
    ar : {
      translation: require('./assets/translations/ar.json')
    },
    tr : {
      translation : require('./assets/translations/tr.json')
    }
  }
 });
 app.use(Middleware.handle(i18next));



app.get('/' , function(req,res,next) { 
   res.render('loginscreen')
});
app.get('/registerscreen' , function(req,res,next) { 
   res.render('registerscreen')
});
app.post('/registerscreen' , asyncCatch( async function(req,res,next) { 
   try {
   const {first,last,type ,department,semester,year,email,username,password} = req.body;
  const user = new User({first,last,type ,department,semester,year,email,username});
  const registeredUser = await User.register(user,password);
  req.login(registeredUser,err =>{
   if(err) return next(err);
   req.flash('success','Welcome to Medion !');
   res.redirect('home');
  })
} catch(e) {
  req.flash('error' , e.message)
   res.redirect('registerscreen')
}
}));

app.get('/loginscreen' , function(req,res,next) { 
   res.render('loginscreen');
});

app.post('/loginscreen' , passport.authenticate('local' , { failureFlash: true , failureRedirect:'/loginscreen'}) , function(req,res) { 


   req.flash('success',`Welcome Back !`);
   res.redirect('home');

});
app.get('/logout' , function(req,res,next){
   req.logout(function(err){
       if(err){
           return next(err);
       }

 
   req.flash( 'success' , 'Goodbye!');
   res.redirect('loginscreen');
}) ;
});


app.get('/home', isLoggedIn, asyncCatch(async function(req, res) {
   const userId = req.user._id;
   const user = await User.findById(userId).populate('courses');
   const courses = await Course.find().lean();
   const now = new Date();
   const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000); 
   const announcements = await Announcement.find({timeCreated:{$gte:twentyFourHoursAgo}}).populate('author');
   const enrollmentIds = user.courses.map(course => course._id);
   const enrolledCourses = [];
   for (enid of enrollmentIds) {
      const enrolledCourse = await Course.findById(enid);
      enrolledCourses.push(enrolledCourse);
   };
  
const completedCourses = await Course.find({ _id: { $in: user.completedCourses } }).exec();
let totalWeightedGradePoints = 0;
let totalCreditHours = 0;
let totalQualityPoints = 0;
for (const course of completedCourses) {
  const courseId = course._id; 
  const creditHours = course.credit; 
  const weightedPoint = user.totalWeightedPoints.find(wp => wp.course.toString() === courseId.toString());
  
  if (weightedPoint) {
    const points = weightedPoint.points;
    console.log(points);
    qualityPoints =   creditHours * ((points / 100) * 4); 
    totalCreditHours += creditHours;
    totalQualityPoints += qualityPoints;
   
    
  }
}
console.log(totalCreditHours);
console.log(totalQualityPoints);
let gpa = 0;
if (totalCreditHours !== 0) {
  gpa = totalQualityPoints/totalCreditHours
  
}
if (isNaN(gpa) || totalCreditHours === 0) {
  gpa = 2; 
}
user.gpa = gpa;
await user.save();
   res.render('home', { user, courses, enrolledCourses, announcements });
}));

 app.post('/home' , isLoggedIn , upload.single('profilePicture'), asyncCatch(async function(req,res) { 
   const user = await User.findById(req.user._id);
   const { content } = req.body;
   const announcement = new Announcement({
      content : content,
      author : user._id
   })

   await announcement.save();
   req.flash('success' , 'Successfully added your announcement!')
   console.log(announcement);
   res.redirect('/home');

 }));
 app.get('/admin/users' , isLoggedIn , asyncCatch(async function(req,res) { 
  const user = await User.findById(req.user._id);
  const users = await User.find({});

  res.render('users' , {user , users});

}));
app.get('/edit/:id' , isLoggedIn , asyncCatch(async function(req,res) { 
  const {id} = req.params;
  const user = await User.findById(req.user._id);
  const userEdit = await User.findById(id);
  res.render('editUser' , {user , userEdit });

}));
app.put('/edit/:id', isLoggedIn, asyncCatch(async function(req, res) {
  const userId = req.params.id; // Corrected line
  const { first, last, username, type, year, semester, department } = req.body;
  
  const updatedUser = await User.findByIdAndUpdate(userId, {
    first,
    last,
    username,
    type,
    year,
    semester,
    department
  });
  await updatedUser.save();

  req.flash('success', 'Modified user successfully');
  res.redirect('/admin/users');
}));


 app.put('/profilesidebar' , isLoggedIn , upload.single('profilePicture'), asyncCatch(async function(req,res) { 
   const user = await User.findByIdAndUpdate(req.user._id,req.file);
   user.profilePicture = req.file.path;
   await user.save();
   req.flash('success' , 'Successfully updated your profile picture !')
   res.redirect('/home')
 }));

 app.get('/calendar' , isLoggedIn , asyncCatch(async function(req,res){
  const user = await User.findById(req.user._id);
  res.render('calendar' , {user})
   
 }));

 app.get('/payment', isLoggedIn, asyncCatch(async function (req, res) {
  const user = await User.findById(req.user._id);


  const payments = await Payment.find({ $or: [{ user: req.user._id }, { user: null }] }).exec();

  res.render('payment', { user, payments });
}));


app.post('/payments/addPayment', isLoggedIn, asyncCatch(async function (req, res) {
  const users = await User.find({}); 

  const paymentData = {
      description: req.body.description,
      year: req.body.year,
      requiredPayment: req.body.requiredPayment,
      remainingPayment: req.body.requiredPayment,
      paidPayment: 0,
  };

  for (const user of users) {
      paymentData.user = user._id; 
      const payment = new Payment(paymentData);
      await payment.save();
  }

  req.flash('success', 'Payments were added successfully!');
  res.redirect('/payment');
}));

app.put('/payment/:id' , isLoggedIn , asyncCatch(async function(req,res) {
  const {id} = req.params;
  const payment1 = await Payment.findById(id)
  if ( payment1.paidPayment + req.body.amount < payment1.requiredPayment) {
  const payment = await Payment.findByIdAndUpdate(
    id,
    { $inc: { paidPayment: req.body.amount } },
    { new: true } 
  );
  await payment.save();
  req.flash('success','Thanks for your payment !')
} else { 
  req.flash('error','You cannot pay over the required total.')
}
 
  res.redirect('/payment')
   }));

 app.get('/mycourses', isLoggedIn, asyncCatch(async function(req, res) {
  const user = await User.findById(req.user._id).populate('courses', 'name startDate endDate');
  for (let course of user.courses) {
    const currentDate = Date.now();
    const startDate = course.startDate;
    const endDate = course.endDate;
    let progression = 0;
    if (currentDate >= endDate) {
      progression = 100;
    } else if (currentDate >= startDate) {
      progression = Math.round((currentDate - startDate) / (endDate - startDate) * 100);
    }
    course.progression = progression;
    await course.save();
  }

  res.render('mycourses', { user });
}));
app.get('/coursecurriculum', isLoggedIn, asyncCatch(async function(req, res) {
  const graduationEcts = 240;
  const user = await User.findById(req.user._id);
  const completedCourses = user.completedCourses;
  const studentEcts = user.studentEcts;
  const remainingEcts = graduationEcts - studentEcts;
  const suggestedCourses = await Course.find({
    $or: [
      { prereq: { $in: completedCourses } },
      { mainCourse: true, $nor: [{ prereq: { $exists: true, $ne: [] } }] }
    ],
    ects: { $lte: remainingEcts }
  });


  const availableCourses = await Course.find({ semester: user.semester });
  const filteredCourses = availableCourses.filter(course => {
    for (let i = 0; i < suggestedCourses.length; i++) {
      if (course._id.toString() === suggestedCourses[i]._id.toString()) {
        return true;
      }
    }
    return false;
  });

  res.render('coursecurriculum', { user, suggestedCourses, filteredCourses, availableCourses });
}));
 app.get('/loginscreen' , function(req,res) {
    res.render('loginscreen')
 });
 app.get('/registerscreen' , asyncCatch( async function(req,res) {
   const user = await User.findById(req.user._id);
    res.render('registerscreen' , {user})
 }));


 app.get('/messages' , isLoggedIn ,  asyncCatch(async function(req,res){
   const users = await User.find({});
   const user = await User.findById(req.user._id);
  const recUser = user._id;
   res.redirect(`/messages/${user._id}`)
}));

app.get('/messages/:recId' , isLoggedIn ,  asyncCatch(async function(req,res){
   const users = await User.find({});
   const user = await User.findById(req.user._id);
   const recUser = await User.findById(req.params.recId);
   if (!recUser) {
     
      req.flash('error', 'recipient not found ');
      return;
    }
   const messages = await Message.find({
      $or: [
         {sender: user._id, recipient: recUser._id},
         {sender: recUser._id, recipient: user._id}
      ]
   }).sort({timestamp: 1}).populate('sender recipient');

   res.render('messages', {user , users , recUser , messages })
}));
app.get('/messages/:userId/:recUserId', isLoggedIn, asyncCatch(async function(req, res) {
  const user = await User.findById(req.user._id);
  const recUser = await User.findById(req.params.recUserId);

 
  const userIds = [user._id, recUser._id];
  userIds.sort();

  const roomId = `${userIds[0]}+${userIds[1]}`;

  res.render('room', { user, roomId });
}));
app.post('/messages/:recId' , isLoggedIn ,  asyncCatch(async function(req,res){
   const user = await User.findById(req.user._id);
   const recUser = await User.findById(req.params.recId);
   const message = req.body.message;
   console.log(message)
   const newMessage = new Message({
      sender : user._id,
      recipient : recUser._id,
      message : message,
      timestamp: Date.now()
   });
   await newMessage.save();
   res.redirect(`/messages/${recUser._id}`)
}));
app.delete('/messages/:recId' , isLoggedIn ,  asyncCatch(async function(req,res){
   const user = await User.findById(req.user._id);
   const recUser = await User.findById(req.params.recId);
   const message = req.body.messageId;
   await Message.findByIdAndDelete(message);
   res.redirect(`/messages/${recUser._id}`)
}));

const roomLink = uuidV4();
app.get('/coursepage/:id', isLoggedIn, asyncCatch(async function(req, res) {
   const { id } = req.params;
   const course = await Course.findById(id).populate({
      path: 'posts',
      populate: {
        path: 'author',
        model: 'User'
      }
    })
   const user = await User.findById(req.user._id).populate('totalWeightedPoints.points');
   const users = await User.find({});
   const assignments = await Assignment.find({ course: id }).populate({
     path: 'submissions',
     model: 'Submission',
     match: { student: req.user._id },
     select: 'points'
   });
 
   for (const assignment of assignments) {
     for (const submission of assignment.submissions) {
       if (submission.student === user._id) {
         assignment.points = submission.points;
       }
     }
   }

   const submissions = await Submission.find({ assignment: { $in: assignments.map(a => a._id) }, student: user._id }).populate('assignment');
   res.render(`coursepage`, { user, course, assignments, submissions , users , uuidV4 , roomLink  });
 }));




 app.get('/coursepage/:id/:room', isLoggedIn, asyncCatch(async function(req, res) {
  const user = await User.findById(req.user._id);
  const userName = `${user.first} ${user.last}`;

  res.render('room' , {roomId : req.params.room , courseId : req.params.id , userName })
  
}));


app.post('/coursepage/:id' , isLoggedIn , asyncCatch(async function(req,res){
   const {id} = req.params;
   const course = await Course.findById(id);
   const post = new Post(req.body);
   console.log(req.body)
    post.author = req.user._id;
    course.posts.push(post);
    await post.save();
    await course.save();
    req.flash('success', 'Your post has been posted !');
    res.redirect(`/coursepage/${course._id}`);
}));
app.put('/coursepage/:courseId/:userId/pass', asyncCatch(async (req, res) => {
  const { courseId, userId } = req.params;

    const user = await User.findById(userId);
    const course = await Course.findByIdAndUpdate(
      courseId, 
      { $addToSet: { completedByUser: user._id } }, 
      { new: true }
    );

    
    if (!user.completedCourses.includes(course._id)) {
      user.completedCourses.push(course._id);
      user.studentEcts += course.ects;
      await user.save();
    }
    await course.save();
    
    req.flash('success', 'Student selected has been marked as passed!');
    res.redirect(`/coursepage/${courseId}`);
}));
app.put('/coursepage/:courseId/:userId/undo', asyncCatch(async (req, res) => {
  const { courseId, userId } = req.params;

  const user = await User.findById(userId);
  const course = await Course.findByIdAndUpdate(
    courseId,
    { $pull: { completedByUser: user._id } },
    { new: true }
  );

  if (user.completedCourses.includes(course._id)) {
    user.completedCourses.pull(course._id);
    user.studentEcts -= course.ects;
    await user.save();
  }
  await course.save();

  req.flash('success', 'Student selected has been marked as not passed!');
  res.redirect(`/coursepage/${courseId}`);
}));
app.put('/coursepage/:courseId/:userId/ta', asyncCatch(async (req, res) => {
  const { courseId, userId } = req.params;

  const user = await User.findById(userId);
  if (user) {
    user.type = "Teaching Assistant";
    await user.save();
  }
  
  req.flash('success', `Successfully assigned ${user.first , user.last} as a teacher assistant for this course ! `);
  res.redirect(`/coursepage/${courseId}`);
}));
app.put('/coursepage/:courseId/:userId/tau', asyncCatch(async (req, res) => {
  const { courseId, userId } = req.params;

  const user = await User.findById(userId);
  if (user) {
    user.type = "Student";
    await user.save();
  }
  
  req.flash('success', `Successfully reverted ${user.first , user.last} to a student ! `);
  res.redirect(`/coursepage/${courseId}`);
}));
app.delete('/coursepage/:id', isLoggedIn, asyncCatch(async function(req, res) {
   const {id} = req.params;
   const course = await Course.findById(id);
   const user = await User.findById(req.user._id);
   await User.findByIdAndUpdate(user, {
      $pull: { courses: course._id }
   });
   req.flash('success', 'Successfully Unenrolled from the course.');
   res.redirect(`/mycourses`);
 }));
app.delete('/coursepage/:id/post/:postId', isLoggedIn, asyncCatch(async function(req, res) {
   const { id, postId } = req.params;
   await Course.findByIdAndUpdate(id, { $pull: { posts: postId } });
   await Post.findByIdAndDelete(postId);
   req.flash('success', 'Your post has been deleted.');
   res.redirect(`/coursepage/${id}`);
 }));
app.get('/courseselect' , isLoggedIn , asyncCatch(async function(req,res) { 
   const courses = await Course.find({}).populate('prereq');
   const user = await User.findById(req.user._id);
   res.render('courseselect', {courses , user })
}));

app.post('/courseselect' , isLoggedIn , asyncCatch (async function(req,res){
   const user = await User.findById(req.user._id);
   const course = await Course.findById(req.body.courseId);
   user.courses.push(course);
   await user.save();
   req.flash('success' , 'Successfully added the course !')
   res.redirect('/courseselect' );
}));
app.post('/courseselect/add' , isLoggedIn , asyncCatch (async function(req,res){
  const {code , name , credit , mainCourse, ects,semester, year ,department,startDate,endDate} = req.body;
  const syllabus = {midterm : req.body.midterm , final : req.body.final , project : req.body.project , assignments : req.body.assignments , labs : req.body.labs , quizzes : req.body.quizzes , attendance : req.body.attendace , bonus : req.body.bonus } ; 
  const time = { day: req.body.day, time: req.body.time };
   const course = new Course({
      code : code,
      name : name ,
      mainCourse : mainCourse,
      credit : credit ,
      ects : ects ,
      semester : semester,
      year : year ,
      department : department ,
      startDate : startDate,
      endDate : endDate ,
      time : time,
      syllabus : syllabus
   });
   await course.save();
   req.flash('success' , 'Successfully Added the course !')
   res.redirect('/courseselect' );
}));

app.put('/courseselect/:id' , isLoggedIn , asyncCatch (async function(req,res){
   const {id} = req.params;
   const course = await Course.findById(id);
   course.name = req.body.name;
   course.mainCourse = req.body.mainCourse;
   course.credit = req.body.credit;
   course.ects = req.body.ects;
   course.semester = req.body.semester;
   course.year = req.body.year;
   course.department = req.body.department;
   course.startDate = req.body.startDate;
   course.endDate = req.body.endDate;
   course.time = { day: req.body.day, time: req.body.time };
   course.syllabus = {midterm : req.body.midterm , final : req.body.final , project : req.body.project , assignments : req.body.assignments , labs : req.body.labs , quizzes : req.body.quizzes , attendance : req.body.attendace , bonus : req.body.bonus } ; 
   await course.save();
   req.flash('success' , 'Successfully Updated the course !')
   res.redirect('/courseselect' );
}));
app.put('/courseselect/:id/prereq', isLoggedIn, asyncCatch(async function(req, res) {
   const { id } = req.params;
   const currentCourse = await Course.findById(id).populate('prereq');
   const prereqCourse = await Course.findById(req.body.prereq);
   const existingPrerequisites = new Set(currentCourse.prereq.map(p => p._id.toString()));
   const stack = [prereqCourse._id];
   while (stack.length > 0) {
     const courseId = stack.pop();
     const course = await Course.findById(courseId).populate('prereq');
     const prerequisites = course.prereq.map(p => p._id.toString());
     if (prerequisites.includes(currentCourse._id.toString())) {
       req.flash('error', `Circular prerequisite: ${currentCourse.name} is already a prerequisite for ${course.name}`);
       return res.redirect('back');
     }
     if (prerequisites.includes(prereqCourse._id.toString())) {
       req.flash('error', `Circular prerequisite: ${prereqCourse.name} is already a prerequisite for ${course.name}`);
       return res.redirect('back');
     }
     for (const p of prerequisites) {
       if (!existingPrerequisites.has(p)) {
         stack.push(p);
       }
     }
   }
   await Course.findByIdAndUpdate(id, {
     $addToSet: { prereq: prereqCourse }
   });
 
   req.flash('success', 'Successfully added course prerequisite!');
   res.redirect('/courseselect');
 }));
app.delete('/courseselect/:id/prereq', isLoggedIn, asyncCatch(async function(req, res) {
   const { id } = req.params;
   const prereqCourse = await Course.findById(req.body.prereqId);
   const course = await Course.findByIdAndUpdate(
     id,
     { $pull: { prereq: prereqCourse._id } },
     { new: true }
   );
   await course.save();
   req.flash('success', 'Successfully Deleted Course Prereq !');
   res.redirect('/courseselect');
 }));





app.get('/assignments' , isLoggedIn , asyncCatch( async function (req,res){
   
   const courses = await Course.find({}).populate();
   const user = await User.findById(req.user._id).populate('courses');
   const userCourses = user.courses.map(course => course._id);
   const currentDate = new Date();
   const assignments = await Assignment.find({
    course: { $in: userCourses },
    dueDate: { $gt: currentDate.toISOString().slice(0, 16) }
  });


   const pastAssignments = await Assignment.find({
    course: { $in: userCourses },
    dueDate: { $lt: currentDate.toISOString().slice(0, 16) }
  });
  console.log(pastAssignments)
   res.render('assignments',{pastAssignments,assignments,user, courses});
}));

app.post('/assignments' , isLoggedIn , upload.array('assignmentfiles' , 10) , asyncCatch(async function (req,res) {
   const  assignmentfiles  = req.files.map( f=> ({url : f.path , filename: f.filename}))
   const { type , title , description , dueDate } = req.body;
   const courseId = req.body.course;
   const formattedDate = dueDate.toLocaleString().replace('T',' ')
   const assignment = new Assignment({
      type : type ,
      title : title ,
      description : description ,
      assignmentfiles : assignmentfiles,
      dueDate : formattedDate ,
      course : courseId
   });
 
   
      await assignment.save();
      res.redirect('/assignments');
  
}));
app.post('/assignments/:id/survey', isLoggedIn, asyncCatch(async function (req, res) {
   const { id } = req.params;
   const user = await User.findById(req.user._id);
   console.log(id);
   const course = await Course.findById(id);
   if ( course.surveyUser && course.surveyUser.includes(req.user._id)) {
     req.flash('error', 'You have already submitted the survey');
     return res.redirect('/assignments');
   } else {
   const surveyScore = (parseInt(req.body.q1) + parseInt(req.body.q2) + parseInt(req.body.q3) + parseInt(req.body.q4)) * (user.gpa/4);
   course.surveyPoints += surveyScore;
   if ( course.surveyUser ) {
   course.surveyUser.push(req.user._id);
   }
   await course.save();
   req.flash('success', 'Successfully submitted your survey score!');
   res.redirect('/assignments');
 }}));

app.get('/assignments/:id' , isLoggedIn, asyncCatch(async function(req,res,next) {
   const {id} = req.params;
   const user = await User.findById(req.user._id);
   const assignment = await Assignment.findById(id).populate('course');
   const submissions = await Submission.find({ assignment: id }).populate('student');
   res.render('turnedassignments' , {user,assignment,submissions })
}));


app.put('/assignments/:id' , isLoggedIn , upload.array('assignmentfiles', 10) , asyncCatch(async function(req,res) {
   const { id } = req.params;
   const assignment = await Assignment.findByIdAndUpdate(id,{...req.body});
   const files =  req.files.map( f=> ({url : f.path , filename: f.filename}));
   assignment.assignmentfiles.push(...files);
   await assignment.save();
  
   req.flash('success' , 'Successfully updated your assignment !')
   res.redirect('/assignments')
}));

app.delete('/assignments/:id' , isLoggedIn , asyncCatch(async function(req,res){
   const {id} = req.params;
   await Assignment.findByIdAndDelete(id);
   req.flash('success' , 'Successfully deleted the assignment !')
   res.redirect('/assignments')

}));



app.post('/assignments/:id/submit', isLoggedIn, upload.array('solutionFiles', 10), asyncCatch(async function (req, res) {
  if (!req.files || req.files.length === 0) {
    req.flash('error', 'Please upload at least one file.');
    return res.redirect('/assignments');
  }
  const solutionFiles = req.files.map(f => ({ url: f.path, filename: f.filename }));
   const assignmentId = req.params.id;
   const studentId = req.user._id;
   const assignment = await Assignment.findById(assignmentId);
   const submission = new Submission({
     assignment: assignmentId,
     student: studentId,
     solutionFiles: solutionFiles,
   });
 
   const studentFileUrl = submission.solutionFiles[0].url; 
   const studentText = await extractTextFromPDF(studentFileUrl);
   const otherSubmissions = await Submission.find({ assignment: assignmentId, student: { $ne: studentId } });
   let plagiarismPercentage = 0;
   let numValidSubmissions = 0; 
 
   for (const otherSubmission of otherSubmissions) {
     const otherFileUrl = otherSubmission.solutionFiles[0].url; 
     const otherText = await extractTextFromPDF(otherFileUrl);
     const percentage = checkPlagiarism(studentText, otherText);
     if (!isNaN(percentage)) { 
       plagiarismPercentage += percentage;
       numValidSubmissions++;
     }
   }
 
   if (numValidSubmissions > 0) {
     plagiarismPercentage = (plagiarismPercentage / numValidSubmissions).toFixed(2);
   } else {
     plagiarismPercentage = 0;
   }
 
   console.log(`Plagiarism percentage for ${submission.student}: ${plagiarismPercentage}%`);
   submission.plagiarismPercentage = isNaN(plagiarismPercentage) ? 0 : Number(plagiarismPercentage);
 
   await submission.save();
   assignment.submissions.push(submission._id);
   await assignment.save();
   req.flash('success','Your submission has been submitted successfully !')
   res.redirect('/assignments');
 }));


 app.post('/assignments/:id/submissions/:submissionId/points', isLoggedIn, asyncCatch(async function(req, res) {
  const { id, submissionId } = req.params;
  const { points } = req.body;
  const submission = await Submission.findById(submissionId).populate('assignment').populate('student');
  const assignment = submission.assignment;
  const course = await Course.findById(assignment.course);

  const syllabus = course.syllabus;
  let grade = 0;
  if (assignment.type === 'Midterm') {
    grade = syllabus.midterm / 100;
  } else if (assignment.type === 'Final') {
    grade = syllabus.final / 100;
  } else if (assignment.type === 'Assignment') {
    grade = syllabus.assignments / 100;
  } else if (assignment.type === 'Quiz') {
    grade = syllabus.quizzes / 100;
  } else if (assignment.type === 'Lab Assignment') {
    grade = syllabus.labs / 100;
  } else if (assignment.type === 'Project') {
    grade = syllabus.projects / 100;
  }

  const numberOfQuizzes = await Assignment.countDocuments({ course: course._id, type: 'Quiz' });
  const numberOfAssignments = await Assignment.countDocuments({ course: course._id, type: 'Assignment' });
  const numberOfLabs = await Assignment.countDocuments({ course: course._id, type: 'Lab Assignment' });
  const numberOfProjects = await Assignment.countDocuments({ course: course._id, type: 'Project' });

  const submissionPoints = points;
  let weightedPoints = 0;
  if (assignment.type ==='Quiz') {
    weightedPoints = points * (grade  / numberOfQuizzes);
  } else if (assignment.type ==='Assignment') {
   weightedPoints = points * (grade  / numberOfAssignments);
  } else if ( assignment.type ==='Lab Assignment') {
   weightedPoints = points * (grade  / numberOfLabs);
  } else if (assignment.type === 'Project'){
   weightedPoints = points * (grade  / numberOfProjects);
  } else {
   weightedPoints = points * grade
  }

  await Submission.findByIdAndUpdate(submissionId, { points: submissionPoints, weightedPoints: weightedPoints });

  const studentId = submission.student._id;
  const courseId = assignment.course._id;
  const user = await User.findById(studentId);
  if (user) {
    if (!user.totalWeightedPoints) {
      user.totalWeightedPoints = [];
    }
    const courseIndex = user.totalWeightedPoints.findIndex(obj => obj.course.toString() === courseId.toString());
    if (courseIndex === -1) {
      user.totalWeightedPoints.push({
        course: courseId,
        points: weightedPoints
      });
    } else {
      const oldPoints = user.totalWeightedPoints[courseIndex].points;
      user.totalWeightedPoints[courseIndex].points = oldPoints - submission.weightedPoints + weightedPoints;
    }
    console.log(user.totalWeightedPoints)
    await user.save();
  }

  req.flash('success', 'Successfully updated points for submission!');
   res.redirect(`/assignments/${id}`);
 }));




 app.use(async function(err, req, res, next) {
  const { statusCode = 500 } = err;
  const user = req.user ? await User.findById(req.user._id) : null;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!'
  res.status(statusCode).render('error', { err , user })
});

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId)
    })
  })
})

server.listen(3000 , function(e) { 
    console.log('Listening on Port 3000!')
});



