let loginEmail = document.querySelector("#inputEmail1");
let loginPassword = document.querySelector("#inputPassword1");
let loginButton = document.querySelector("#loginButton");

function tomorrow() {
    let ms = new Date().getTime() + 86400000;
    let tomorrow = new Date(ms)
    return tomorrow;
}

//Keys of users
let keys = ["id", "name", "email", "password"];

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
//Get server datas and check the user validity
function startGetUsers() {
    getServerData("http://localhost:3000/users").then(
        data => userCheck(data)
    );
}

loginButton.addEventListener("click", startGetUsers);

function userCheck(data) {
    
    for (row of data) {
        
        if (row.email == loginEmail.value) {
            if (row.password == loginPassword.value) {
                //setCookie 
                //document.cookie = `id=${row.id}; expires=${tomorrow()}; path=/`;
                openPage();
            } else {
                return (console.log("Az e-mail cím vagy a Jelszó hibás!"));
            }
        }
    }
    return (console.log("Az E-mail cím vagy a jelszó hibás!"));

}

function openPage() {
    window.open("message_wall.html", "_self");
}

//Sign up new user
function startAddUser(params) {

}