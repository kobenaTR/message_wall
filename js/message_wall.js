function logout() {
    document.cookie = "id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    console.log(document.cookie)
}

document.getElementById("logout").addEventListener("click", logout)

//identify user


/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */

let dropdownButton = document.getElementsByClassName("dropbtn")

function dropDownMenuFunction() {
    let showDropdownFunction = function (ev) {
      this.parentElement.querySelector("div").classList.toggle("show")
    }
    for (let i = 0; i < dropdownButton.length; i++) {
      dropdownButton[i].addEventListener("click", showDropdownFunction);
    }
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

//dataBases
//users
//published_messages

function getServerData(url) {
    let fetchOptions = {
        method: "GET",
        mode: "cors",
        cache: "no-cache"
    };

    return fetch(url, fetchOptions).then(
        response => response.json(),
        err => console.error(err)
    );
};

function startGetMessages() {
    getServerData(`http://localhost:3000/published_messages`).then(
        dataBase => fillTheWall(dataBase)
    );
}

// keys of dataBase
let keysOfMessage = ["id", "userId", "postTime", "modified", "message", "image"];
let keysOfUsers = ["id", "name", "email", "password"];

// Load and fill the wall with content
function fillTheWall(messages) {
    for (let i = 0; i < messages.length; i++) {
        let messageSender;

        createMessageTable();

        let showName = document.querySelector(".name");
        let showDate = document.querySelector(".date")
        let showMessage = document.querySelector(".message div")
        let showImage = document.querySelector(".wall_image")


        //identify the message's sender
        function getUserName(userId) {
            getServerData("http://localhost:3000/users").then(
                dataBase => user(dataBase, userId)
            );
        }

        function user(dataBase, userId) {
            for (let n = 0; n < dataBase.length; n++) {
                if (messages[i].userId == dataBase[n].id) {
                    messageSender = dataBase[n].name;
                    //a dátum div-je elé kell betűzni ---insertBefore?
                    showName.innerHTML = messageSender;
                    break;
                }
            }
        }

        getUserName(messages[i].userId);

        showDate.innerHTML = messages[i].postTime;
        showMessage.innerHTML = messages[i].message;
        let image = createAnyElement("img", {src: messages[i].image})
        showImage.appendChild(image);
    }
    dropDownMenuFunction()
}

function createMessageTable() {
    let messageWallDiv = document.querySelector("#messageWallDiv");
    let message_logDiv = createAnyElement("div", { class: "message_log" });
    let table = createAnyElement("table");
    let tr1 = createAnyElement("tr");
    let tr2 = createAnyElement("tr");
    let tr3 = createAnyElement("tr");
    let tr4 = createAnyElement("tr");
    let tr5 = createAnyElement("tr", {class: "buttonGroupRow"});
    //name
    let tdName = createAnyElement("td", { class: "name" })
    //Dropdown
    let aDelete = createAnyElement("a", {class: "deleteBtn", href: "#"})
    aDelete.innerHTML = "Delete"
    let aModify = createAnyElement("a", {class: "modifyBtn", href: "#", onclick: "startModification(this)"})
    aModify.innerHTML = "Modify"
    let dropdownContentDiv = createAnyElement("div", {class: "dropdown-content"})
    let iTag = createAnyElement("i", {class: "fas fa-align-justify"})
    let dropButton = createAnyElement("button", {class: "dropbtn"})
    dropButton.appendChild(iTag)
    let dropdownDiv = createAnyElement("div", {class: "dropdown"})
    let tdDropdown = createAnyElement("td", {rowspan: "2"})
    dropdownContentDiv.appendChild(aModify)
    dropdownContentDiv.appendChild(aDelete)
    dropdownDiv.appendChild(dropButton)
    dropdownDiv.appendChild(dropdownContentDiv)
    tdDropdown.appendChild(dropdownDiv)
    
    tr1.appendChild(tdName)
    tr1.appendChild(tdDropdown)
    let tbody = createAnyElement("tbody")
    tbody.appendChild(tr1)
    //dateTime
    let tdDate = createAnyElement("td", { class: "date" })
    tr2.appendChild(tdDate);
    tbody.appendChild(tr2);
    //message
    let tdMessage = createAnyElement("td", { class: "message", colspan: 2 })
    let messageDiv = createAnyElement("div")
    let textArea = createAnyElement("textarea", {cols: "45", rows: "5"})
    let input = createAnyElement("input", {type: "text", class: "form-control"})
    tdMessage.appendChild(messageDiv)
    tdMessage.appendChild(textArea)
    tdMessage.appendChild(input)
    tr3.appendChild(tdMessage)
    tbody.appendChild(tr3)
    //image
    let tdImage = createAnyElement("td", { class: "wall_image", colspan: 2 })
    tr4.appendChild(tdImage)
    tbody.appendChild(tr4)
    //Modify and Cancel buttons
    let modifyButton = createAnyElement("button", {class: "btn btn-info", onclick: "updateContent()"})
    modifyButton.innerHTML = "Modify"
    let cancelButton = createAnyElement("button", {class: "btn btn-outline-secondary", onclick: "exitEditView()"})
    cancelButton.innerHTML = "Cancel"
    let buttonGroupDiv = createAnyElement("div", {class: "btn-group btn-block"})
    buttonGroupDiv.appendChild(modifyButton)
    buttonGroupDiv.appendChild(cancelButton)
    let tdButtonGroup = createAnyElement("td", {colspan: "2"})
    tdButtonGroup.appendChild(buttonGroupDiv);
    tr5.appendChild(tdButtonGroup);
    tbody.appendChild(tr5);
    table.appendChild(tbody)
    message_logDiv.appendChild(table)
    //insertBefore
    messageWallDiv.insertBefore(message_logDiv, messageWallDiv.firstChild)
}

//download the wall content database from server
window.addEventListener("load", startGetMessages);

let name = document.getElementById("name");
let message = document.getElementById("message");

//document.getElementById("submit").addEventListener("click", createWallContent);

function getMessage(name, message, wall_image = "") {
    let date = getPostTime();
    let inputs = { name, date, message, wall_image }

    console.log(inputs);
    return inputs;
}

//upload new element to the wall
function createWallContent() {
    let data = getMessage(name.value, message.value);

    let fetchOptions = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };


    fetch(`http://localhost:3000/published_messages`, fetchOptions).then(
        resp => resp.json(),
        err => console.error(err)
    ).then(
        data => console.log(data),
        alert("Üzenet elküldve!")
    );


}

function getPostTime() {
    let postTime = new Date();

    let year = postTime.getFullYear();
    let month = postTime.getMonth() + 1;
    let dayOfTheMonth = postTime.getDate();
    let hour = postTime.getHours();
    let minute = postTime.getMinutes();

    if (month < 10) {
        month = "0" + month;
    }

    if (dayOfTheMonth < 10) {
        dayOfTheMonth = "0" + dayOfTheMonth;
    }

    if (hour < 10) {
        hour = "0" + hour;
    }

    if (minute < 10) {
        minute = "0" + minute;
    }

    return (year + "." + month + "." + dayOfTheMonth + " " + hour + ":" + minute);
}

// Ezzel a függvénnyel bármilyen HTML elemet le lehet gyártani!!!
function createAnyElement(name, attributes) {
    let element = document.createElement(name);
    for (let k in attributes) {
        element.setAttribute(k, attributes[k]);
    }
    return element;
}

function delMessage(btn) {

    // Szerepelnie kell az ID-nek a táblázatban, hogy hivatkozhassak rá!!!!!!!!!!!

    let fetchOptions = {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache"
    };

    fetch(`http://localhost:3000/published_messages/${id}`, fetchOptions).then( // Az url vége: hányas id!
        resp => resp.json(),
        err => console.error(err)
    ).then(
        database => {
            fillTheWall(); // Ezzel frissítjük az oldalt!
        }
    );
}