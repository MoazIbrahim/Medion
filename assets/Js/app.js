
function postAnnouncement() {
    var title = document.getElementById("announcement-title").value;
    var content = document.getElementById("announcement-content").value;
    alert("Announcement posted!");
}
$(document).ready(function() {

  $("#submit-btn").click(function() {

    var userInput = $("#input-box").val();
    

    var newPost = ' <div class="coloor3 "><div class="flex-row d-flex"><img src="anon.jpg" width="40" class="rounded-circle" /><div class="d-flex flex-column justify-content-start ml-2"><span class="d-block font-weight-bold name">Prof. Reda Alhajj</span><span class="date text-black-50">' + getCurrentDate() + '</span></div></div><div class="mt-3"><p class="comment-text">' + userInput + '</p></div></div>';
    

    $("#wow").append('  <div class="d-flex flex-column mb-3" id="comment-container">   <div class="">  <div class="d-flex flex-column ">' + newPost + '</div>');
    

    $("#input-box").val("");
  });
});

function getCurrentDate() {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var formattedDate = day + '/' + month + '/' + year;
  return formattedDate;
}

const languageButtons = document.querySelectorAll(".lang-button");
const content = document.querySelectorAll("[data-i18n]");
let language = localStorage.getItem("language") || "en";

function changeLanguage(lang) {
  language = lang;
  fetch(`/translations/${lang}.json`)
    .then((response) => response.json())
    .then((data) => {
      content.forEach((element) => {
        const key = element.dataset.i18n;
        if (element.tagName.toLowerCase() === "button") {
          element.setAttribute("value", data[key]);
        } else {
          element.innerHTML = data[key];
        }
      });
    });
    localStorage.setItem("language", lang);
}
languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const lang = button.id;
    changeLanguage(lang);
  });
});

// initialize language on page load
changeLanguage(language);

