/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */

let dropdownButton = document.getElementsByClassName("dropbtn")

let showDropdownFunction = function (ev) {
  this.parentElement.querySelector("div").classList.toggle("show")
}
for (let i = 0; i < dropdownButton.length; i++) {
  dropdownButton[i].addEventListener("click", showDropdownFunction);
}


// Close the dropdown menu if the user clicks outside of it
window.onclick = function (event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

//Modify button and event handle
function startModification(button) {
  let parentTable = button.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement
  if(document.getElementById("edit") == null) {
    openEditView(parentTable)
  }
}

function openEditView(table) {
  if (table.id == "") {
    table.id = "edit"
    let messageDiv = table.querySelector(".message div")
    let messageTextArea = table.getElementsByTagName("textarea")[0]
    messageTextArea.value = messageDiv.innerHTML
    let showImagePath = table.querySelector(".form-control")
    showImagePath.value = table.querySelector(".wall_image img").src
  }
}

function exitEditView(table = document.getElementById("edit")) {
  if (table.id == "edit") {
    table.id = ""
  }
}

function updateContent(table = document.getElementById("edit")) {
  let messageDiv = table.querySelector(".message div")
  let messageTextArea = table.getElementsByTagName("textarea")[0]
  messageDiv.innerHTML = messageTextArea.value
  let showImagePath = table.querySelector(".form-control")
  table.querySelector(".wall_image img").src = showImagePath.value

  exitEditView()
}


function deleteMessage(button) {

}