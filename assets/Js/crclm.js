const displayButton = document.querySelector('#displaybutton');
displayButton.addEventListener('click' ,displayCourses);
const electiveButton = document.querySelector('#electivebutton');
electiveButton.addEventListener('click', displayElectiveCourses);
function displayCourses() {
 
    var program = document.getElementById("program").value;
    var semester = document.getElementById("semester").value;
    var year = document.getElementById("year").value;
    var coursesDiv = document.getElementById("courses");

    
    
    if ( program==='computer_engineering' && semester ==='fall' && year==='1') {
        var courses = [
            { code: "COE1110745", name: "Calculus 1", credit: 4, ECTS: 6 },
         { code: "COE1110746", name: "Physics 1", credit: 3, ECTS: 5 },
          { code: "COE1110747", name: "Physics I Lab", credit: 3, ECTS: 4 },
          { code: "COE1110748", name: "Introduction to Computer Engineering", credit: 3, ECTS: 4 },
          { code: "COE1113180", name: "Introduction to Programming", credit: 4, ECTS: 6 },
          { code: "COE1110749", name: "Academic Communication Skills I", credit: 2, ECTS: 2 },
          { code: "TDL1110400", name: "Turkish I", credit: 2, ECTS: 2 },
          { code: "ATA1110300", name: "History I", credit: 2, ECTS: 2 }];
         


    }
   else if ( program==='computer_engineering' && semester ==='spring' && year==='1') {
        var courses = [
            { code: "COE1210751", name: "Calculus II", credit: 4, ECTS: 6 },
         { code: "COE1210752", name: "Physics II	", credit: 3, ECTS: 5 },
          { code: "COE1210753", name: "Physics II Lab", credit: 1, ECTS: 2 },
          { code: "COE1210754", name: "Advanced Programming	", credit: 4, ECTS: 5 },
          { code: "COE1210755", name: "Academic Communication Skills II	", credit: 2, ECTS: 2 },
          { code: "TDL1210600", name: "Turkish II	", credit: 2, ECTS: 2 },
          { code: "ATA1210500", name: "History II", credit: 2, ECTS: 2 }];
          var electiveCourses = [ 
             { code: "COE1210111", name: "General Chemistry", credit: 3, ECTS: 5 },
          { code: "COE1210112", name: "Medical Biology", credit: 3, ECTS: 4},
          { code: "COE1210113", name: "Introduction to Material Science", credit: 3, ECTS: 5 },
          ];


    }
    else if ( program==='computer_engineering' && semester ==='fall' && year==='2') {
        var courses = [
            { code: "COE2112504", name: "Digital Logic Design", credit: 4, ECTS: 8},
         { code: "COE2146020", name: "Circuits", credit: 4, ECTS: 8 },
          { code: "COE2133840", name: "Linear Algebra", credit: 3, ECTS: 6 },
          { code: "COE2133840", name: "Differential Equations", credit: 2, ECTS: 4 },
          { code: "COE2113250", name: "Object Oriented Programming", credit: 3, ECTS: 6 },
         ];


    }
    else if ( program==='computer_engineering' && semester ==='spring' && year==='2') {
        var courses = [
            { code: "COE2233850", name: "Data Structures", credit: 4, ECTS: 8},
         { code: "COE2233880", name: "Computer Organization", credit: 4, ECTS: 8 },
          { code: "COE2218970", name: "Discrete Mathematics", credit: 3, ECTS: 5 },
          { code: "COE2249080", name: "Probability and Random Variables", credit: 3, ECTS: 6 },
          
         ];


    }
    else if ( program==='computer_engineering' && semester ==='fall' && year==='3') {
        var courses = [
            { code: "COE3110758", name: "Operating Systems", credit: 4, ECTS: 8},
         { code: "COE3110759", name: "Programming for Engineers", credit: 4, ECTS: 6 },
          { code: "COE3167930", name: "Principles of Programming Languages", credit: 3, ECTS: 6},
          { code: "COE3149190", name: "Innovation and Entrepreneurship", credit: 2, ECTS: 2 },
          { code: "COE3113191", name: "Summer Internship I	", credit: 0, ECTS: 5 }
          
         ];


    }
    else if ( program==='computer_engineering' && semester ==='spring' && year==='3') {
        var courses = [
            { code: "COE3233890", name: "Algorithm Analysis", credit: 3, ECTS: 6},
         { code: "COE3220530", name: "Microprocessors", credit: 4, ECTS: 8 },
          { code: "COE3249650", name: "Databases", credit: 4, ECTS: 8},
          
         ];


    }
    else if ( program==='computer_engineering' && semester ==='fall' && year==='4') {
        var courses = [
            { code: "COE4110764", name: "Engineering Project I", credit: 2, ECTS: 6},
         { code: "İGV4111400", name: "Workplace Health and Safety I", credit: 2, ECTS: 2 },
          { code: "COE4167890", name: "An Introduction to Formal Languages and Automata Theory", credit: 3, ECTS: 6},
          { code: "COE4112505", name: "Software Engineering	", credit: 3, ECTS: 8},
          { code: "COE4110345", name: "Engineering Economics", credit: 3, ECTS: 6},
          { code: "COE4113192", name: "Summer Internship II	", credit: 0, ECTS: 5},
          
         ];


    }
    else if ( program==='computer_engineering' && semester ==='spring' && year==='4') {
        var courses = [
            { code: "COE4210766", name: "Engineering Project II", credit: 2, ECTS: 6},
         { code: "İGV4211500", name: "Workplace Health and Safety II", credit: 2, ECTS: 2 },
          { code: "COE4210767", name: "Technology, Society and Ethics", credit: 2, ECTS: 2},
          { code: "COE4249640", name: "Data Communication and Computer Networks", credit: 4, ECTS: 8},
    
          
         ];


    }
    else {
        var courses =    'hello';
     
    }

    var table = "<table><thead><tr><th>Code</th><th>Name</th><th>credit</th><th>ECTS</th></thead><tbody>";
    for (var i = 0; i < courses.length; i++) {
        table += "<tr><td>" + courses[i].code + "</td><td>" + courses[i].name + "</td><td>" + courses[i].credit + "</td><td>" + courses[i].ECTS + "</td></tr>";
    }
    table += "</tbody></table>";
    

    coursesDiv.innerHTML = table;
   


    
}
let electiveCoursesDisplayed = false;
function displayElectiveCourses() {
   
  if (electiveCoursesDisplayed) {
    const electiveCoursesDiv = document.getElementById('electivecourses');
    electiveCoursesDiv.parentNode.removeChild(electiveCoursesDiv);
    electiveCoursesDisplayed = false;
    return;
  }

  const electiveCourses = [
    { code: "COE1210111", name: "General Chemistry", credit: 3, ECTS: 5 },
    { code: "COE1210112", name: "Medical Biology", credit: 3, ECTS: 4},
    { code: "COE1210113", name: "Introduction to Material Science", credit: 3, ECTS: 5 },
  ];

  const electiveCoursesDiv = document.createElement('div');
  electiveCoursesDiv.id = 'electivecourses';

  electiveCourses.forEach(course => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${course.code}</td><td>${course.name}</td><td>${course.credit}</td><td>${course.ECTS}</td>`;
    electiveCoursesDiv.appendChild(row);
  });

  const coursesDiv = document.getElementById('courses');
  coursesDiv.parentNode.insertBefore(electiveCoursesDiv, coursesDiv.nextSibling);
  electiveCoursesDisplayed = true;
}
function toggleDisplayButton() {
  const electiveCoursesDiv = document.getElementById('electivecourses');
  const displayButtonText = electiveCoursesDisplayed ? 'Hide Elective Courses' : 'Display Elective Courses';
  displayButton.textContent = displayButtonText;
  if (!electiveCoursesDiv) {
    displayButton.disabled = true;
  } else {
    displayButton.disabled = false;
  }
}

function toggleElectiveCourses() {
  const electiveCoursesDiv = document.getElementById('electivecourses');
  if (electiveCoursesDiv) {
    electiveCoursesDiv.style.display = electiveCoursesDiv.style.display === 'none' ? 'block' : 'none';
  }
}

