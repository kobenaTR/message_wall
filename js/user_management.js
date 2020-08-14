//Keys of users
let keys = ["id", "name", "email", "password"];

// Ezzel a függvénnyel bármilyen HTML elemet le lehet gyártani!!!
function createAnyElement(name, attributes) {
    let element = document.createElement(name);
    for (let k in attributes) {
        element.setAttribute(k, attributes[k]);
    }
    return element;
}

//Get database from server
//Server datas
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
}
//Get server datas and fill the table ----------this is the start
function startGetUsers() {
    getServerData("http://localhost:3000/users").then(
        data => fillDataTable(data, "usersTable")
    );
}

let getUsersButton = document.getElementById("btnGetUsers");
getUsersButton.addEventListener("click", startGetUsers)

//Fill the table with server data
function fillDataTable(data, tableID) {
    let table = document.getElementById(tableID);
    if (!table) {
        console.error(`Table "${tableID}" is not found.`);
        return;
    }

    let tbody = table.querySelector("tbody");
    newUserRow(tbody);
    for (row of data) {
        let tr = createAnyElement("tr");
        tbody.appendChild(tr);
        for (k of keys) {
            if (k == "id") {
                let td = createAnyElement("td");
                let input = createAnyElement("input", {
                    class: "form-control",
                    type: "text",
                    name: k,
                    value: row[k],
                    readonly: true
                })
                td.appendChild(input);
                tr.appendChild(td);
            } else {
                let td = createAnyElement("td");
                let input = createAnyElement("input", {
                    class: "form-control",
                    type: "text",
                    name: k,
                    value: row[k]
                })
                td.appendChild(input);
                tr.appendChild(td);
            }
        }
        let td = createAnyElement("td");
        let btnGroup = createButtonGroup();
        td.appendChild(btnGroup);
        tr.appendChild(td);
    }
}

//This creates the empty new user row
function newUserRow(tbody) {
    let tr = createAnyElement("tr");
    tbody.appendChild(tr);
    for (k of keys) {
        let td = createAnyElement("td");
        let input = createAnyElement("input", {
            class: "form-control",
            name: k
        })
        td.appendChild(input);
        tr.appendChild(td);
    }
    let addButton = createAnyElement("button", { class: "btn btn-success", onclick: "createUser(this)" });
    addButton.innerHTML = "Add";
    let td = createAnyElement("td");
    td.appendChild(addButton);
    tr.appendChild(td);
    tbody.appendChild(tr)
}

//Modify and Delete button group
function createButtonGroup() {
    let divButtonGroup = createAnyElement("div", {class: "btn-group", onclick: "setRow(this)"});
    let modifyButton = createAnyElement("button", {class: "btn btn-info"});
    modifyButton.innerHTML = "Modify"
    let deleteButton = createAnyElement("button", {class: "btn btn-danger", onclick: "delRow(this)"});
    deleteButton.innerHTML = "Delete"
    divButtonGroup.appendChild(modifyButton);
    divButtonGroup.appendChild(deleteButton);
    return (divButtonGroup);
}

function delRow(btn) {
    let tr = btn.parentElement.parentElement.parentElement;
    let td = tr.querySelector("td:first-child").querySelector("input.form-control");
    let id = td.value;

    let fetchOptions = {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache"
    };
    if(confirm("Do you want to delete this user?")){
        fetch(`http://localhost:3000/users/${id}`, fetchOptions).then( // Az url vége: hányas id!
            resp => resp.json(),
            err => console.error(err)
        ).then(
            data => {
                startGetUsers(); // Ezzel frissítjük az oldalt!
            }
        );
    }
}

//Row td values read out
function getRowData(tr) {
    console.log(tr);
    let inputs = tr.querySelectorAll("input.form-control");
    let data = {};
    for (let i = 0; i < inputs.length; i++) {
        data[inputs[i].name] = inputs[i].value;   
    }
    console.log(data);
    return data;
}

function createUser(btn) {
    let tr = btn.parentElement.parentElement;
    let data = getRowData(tr);
    delete data.id;
    let fetchOptions = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    fetch(`http://localhost:3000/users`, fetchOptions).then(
        resp => resp.json(),
        err => console.error(err)
    ).then(
        data => console.log(data)
    );
}

function setRow(btn) {
    let tr = btn.parentElement.parentElement;
    let data = getRowData(tr);
    console.log(data);
    let fetchOptions = {
        method: "PUT",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
    fetch(`http://localhost:3000/users/${data.id}`, fetchOptions).then(
        resp => {resp.json(), console.log(data) },
        err => console.error(err)
    ).then(
        data => startGetUsers()
    );
}