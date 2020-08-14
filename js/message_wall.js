function logout() {
    document.cookie = "id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    console.log(document.cookie)
}

document.getElementById("logout").addEventListener("click", logout)

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
        let showMessage = document.querySelector(".message")
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

}

function createMessageTable() {
    let messageWallDiv = document.querySelector("#messageWallDiv");
    let message_logDiv = createAnyElement("div", { class: "message_log" });
    let table = createAnyElement("table");
    let tr1 = createAnyElement("tr");
    let tr2 = createAnyElement("tr");
    let tr3 = createAnyElement("tr");
    let tr4 = createAnyElement("tr");
    //name
    let tdName = createAnyElement("td", { class: "name" })
    //buttons
    let tdButtons = createAnyElement("td", { class: "buttonTd", rowspan: 2 })
    let buttonMod = createAnyElement("button", { class: "btn btn-info btn-sm" })
    buttonMod.innerHTML = "Mod"
    let buttonDel = createAnyElement("button", { class: "btn btn-danger btn-sm" })
    buttonDel.innerHTML = "Del"

    tdButtons.appendChild(buttonMod)
    tdButtons.appendChild(buttonDel)
    
    tr1.appendChild(tdName)
    tr1.appendChild(tdButtons)
    table.appendChild(tr1)
    //dateTime
    let tdDate = createAnyElement("td", { class: "date" })
    tr2.appendChild(tdDate);
    table.appendChild(tr2);
    //message
    let tdMessage = createAnyElement("td", { class: "message", colspan: 2 })
    tr3.appendChild(tdMessage)
    table.appendChild(tr3)
    //image
    let tdImage = createAnyElement("td", { class: "wall_image", colspan: 2 })
    tr4.appendChild(tdImage)
    table.appendChild(tr4)

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