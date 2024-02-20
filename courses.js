
const courses = [
    { code: "COE1110745",name: "Calculus I", credit: 4,ects: 6,semester: 1,department: "Computer Engineering" , prereq: []},
    { code: "COE1110746", name: "Physics 1", credit: 3, ects: 5 ,semester: 1, department: "Computer Engineering" , prereq: [] },
    { code: "COE1110747", name: "Physics I Lab", credit: 3, ects: 4 , semester : 1 , department : 'Computer Engineering' , prereq: []},
    { code: "COE1110748", name: "Introduction to Computer Engineering", credit: 3, ects: 4 , semester : 1 , department : 'Computer Engineering' , prereq: []},
    { code: "COE1110749", name: "Academic Communication Skills I", credit: 2, ects: 2 , semester : 1 , department: 'Computer Engineering' , prereq: []},
    { code: "TDL1110400", name: "Turkish I", credit: 2, ects: 2 , semester : 1 , department : 'Computer Engineering' , prereq: []},
    { code: "ATA1110300", name: "History I", credit: 2, ects: 2 , semester : 1 , deparment : 'Computer Engineering', prereq: [] },
    { code: "COE1210751", name: "Calculus II", credit: 4, ects: 6 , semester : 2 , department : 'Computer Engineering', prereq: [] },
    { code: "COE1210752", name: "Physics II	", credit: 3, ects: 5, semester : 2 , department : 'Computer Engineering' , prereq: []},
     { code: "COE1210753", name: "Physics II Lab", credit: 1, ects: 2, semester : 2 , department : 'Computer Engineering' , prereq :[] },
     { code: "COE1210754", name: "Advanced Programming	", credit: 4, ects: 5, semester : 2 , department : 'Computer Engineering', prereq: []},
     { code: "COE1210755", name: "Academic Communication Skills II	", credit: 2, ects: 2, semester : 2 , department : 'Computer Engineering', prereq: [] },
     { code: "TDL1210600", name: "Turkish II	", credit: 2, ects: 2, semester : 2 , department : 'Computer Engineering', prereq: [] },
     { code: "ATA1210500", name: "History II", credit: 2, ects: 2 , semester : 2 , department : 'Computer Engineering', prereq: []},
     { code: "COE2112504", name: "Digital Logic Design", credit: 4, ects: 8 , semester : 3 , department : 'Computer Engineering', prereq: []} ,
     { code: "COE2146020", name: "Circuits", credit: 4, ects: 8, semester : 3 , department : 'Computer Engineering', prereq: [] },
      { code: "COE2133840", name: "Linear Algebra", credit: 3, ects: 6 , semester : 3 , department : 'Computer Engineering', prereq: []},
      { code: "COE2133840", name: "Differential Equations", credit: 2, ects: 4, semester : 3 , department : 'Computer Engineering', prereq: [] },
      { code: "COE2113250", name: "Object Oriented Programming", credit: 3, ects: 6, semester : 3 , department : 'Computer Engineering', prereq: [] },
      { code: "COE2233850", name: "Data Structures", credit: 4, ects: 8 , semester :4 , department :'Computer Engineering', prereq: []},
         { code: "COE2233880", name: "Computer Organization", credit: 4, ects: 8 , semester :4 , department :'Computer Engineering', prereq: []},
          { code: "COE2218970", name: "Discrete Mathematics", credit: 3, ects: 5 , semester :4 , department :'Computer Engineering', prereq: []},
          { code: "COE2249080", name: "Probability and Random Variables", credit: 3, ects: 6 , semester :4 , department :'Computer Engineering', prereq: []},
          { code: "COE3110758", name: "Operating Systems", credit: 4, ects: 8 , semester : 5 , department: 'Computer Engineering', prereq: []},
         { code: "COE3110759", name: "Programming for Engineers", credit: 4, ects: 6, semester : 5 , department: 'Computer Engineering', prereq: [] },
          { code: "COE3167930", name: "Principles of Programming Languages", credit: 3, ects: 6, semester : 5 , department: 'Computer Engineering', prereq: []},
          { code: "COE3149190", name: "Innovation and Entrepreneurship", credit: 2, ects: 2 , semester : 5 , department: 'Computer Engineering', prereq: []},
          { code: "COE3113191", name: "Summer Internship I	", credit: 0, ects: 5 , semester : 5 , department: 'Computer Engineering', prereq: []},
          { code: "COE3233890", name: "Algorithm Analysis", credit: 3, ects: 6 , semester :6 , deparment :'Computer Engineering', prereq: []},
          { code: "COE3220530", name: "Microprocessors", credit: 4, ects: 8 , semester :6 , deparment :'Computer Engineering', prereq: []},
           { code: "COE3249650", name: "Databases", credit: 4, ects: 8, semester : 6 , deparment : 'Computer Engineering', prereq: []},
           { code: "COE4110764", name: "Engineering Project I", credit: 2, ects: 6 , semester : 7 , department :'Computer Engineering', prereq: []},
         { code: "İGV4111400", name: "Workplace Health and Safety I", credit: 2, ects: 2, semester : 7 , department :'Computer Engineering', prereq: [] },
          { code: "COE4167890", name: "An Introduction to Formal Languages and Automata Theory", credit: 3, ects: 6, semester : 7 , department :'Computer Engineering', prereq: []},
          { code: "COE4112505", name: "Software Engineering	", credit: 3, ects: 8, semester : 7 , department :'Computer Engineering', prereq: []},
          { code: "COE4110345", name: "Engineering Economics", credit: 3, ects: 6, semester : 7 , department :'Computer Engineering', prereq: []},
          { code: "COE4113192", name: "Summer Internship II	", credit: 0, ects: 5, semester: 7 , department :'Computer Engineering', prereq: []},
          { code: "COE4210766", name: "Engineering Project II", credit: 2, ects: 6 , semester : 8 , department : 'Computer Engineering', prereq: []},
         { code: "İGV4211500", name: "Workplace Health and Safety II", credit: 2, ects: 2, semester : 8 , department : 'Computer Engineering' , prereq: [] },
          { code: "COE4210767", name: "Technology, Society and Ethics", credit: 2, ects: 2, semester : 8 , department : 'Computer Engineering', prereq: []},
          { code: "COE4249640", name: "Data Communication and Computer Networks", credit: 4, ects: 8, semester : 8 , department : 'Computer Engineering', prereq: []},


    ];

  
    
  
  
 
  
  module.exports = courses;