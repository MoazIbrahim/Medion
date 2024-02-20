
const modal = document.getElementById("myModal");


const span = document.getElementsByClassName("close")[0];
const notesSpan = document.getElementsByClassName('notes-close')[0];


const cards = document.querySelectorAll(".sch-card");




for (var i = 0; i < cards.length; i++) {
  cards[i].addEventListener("click", function() {
    var courseName = this.textContent;
    var notes = "This is the notes for this course week , please enter the notes you want the students enrolled in this course to see ..";
	document.getElementById("modal-heading").textContent = courseName;
	document.getElementById("modal-notes").textContent = notes;
	modal.style.display = "block";
});
}




span.onclick = function() {
modal.style.display = "none";
};

notesSpan.onclick = function() {
  notesModal.style.display = "none";
  };

window.onclick = function(event) {
if (event.target == modal) {
modal.style.display = "none";
}
}
const notesButton = document.getElementById("notes-button");
const notesModal = document.getElementById("notes-modal");
const myModal = document.getElementById("myModal");
const closeButton = document.querySelector(".close");

notesButton.addEventListener("click", () => {
  notesModal.style.display = "block";
});


closeButton.addEventListener("click", () => {
  notesModal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target == notesModal) {
    notesModal.style.display = "none";
  }
});
const saveButton = document.getElementById("notes-save-button");
const notesTextarea = document.getElementById("notes-textarea");

saveButton.addEventListener("click", () => {
  const notes = notesTextarea.value;

  notesModal.style.display = "none";
});
span.onclick = function() {
  myModal.style.display = "none";
  }
  


  const colorMap = {};
  const colors = ['#b9fbc0', '#98f5e1', '#8eecf5', '#a3c4f3', '#fbf8cc', '#ffcfd2', '#f1c0e8' , '#fec89a' ,'#cdb4db' , '#ccd5ae'];
  
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
  
    if (card.innerHTML.trim() !== "") {
      const inputString = card.innerHTML.trim();
  
      if (colorMap[inputString]) {
  
        card.style.backgroundColor = colorMap[inputString];
      } else {
  
        const randomIndex = Math.floor(Math.random() * colors.length);
        const color = colors[randomIndex];
  
        colorMap[inputString] = color;
  
        card.style.backgroundColor = color;
      }
    }
  }