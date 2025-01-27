const urlBase = "http://localhost:8000/LAMPAPI";
const extension = "php";

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin() {
  userId = 0;
  firstName = "";
  lastName = "";

  const login = document.getElementById("loginName").value;
  const password = document.getElementById("loginPassword").value;
  //	var hash = md5( password );

  document.getElementById("loginResult").innerHTML = "";

  const tmp = { login: login, password: password };
  //	var tmp = {login:login,password:hash};
  const jsonPayload = JSON.stringify(tmp);

  const url = `${urlBase}/Login.${extension}`;

  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        const jsonObject = JSON.parse(xhr.responseText);
        userId = jsonObject.id;

        if (userId < 1) {
          document.getElementById("loginResult").innerHTML =
            "User/Password combination incorrect";
          return;
        }

        firstName = jsonObject.firstName;
        lastName = jsonObject.lastName;

        saveCookie();

        window.location.href = "color.html";
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("loginResult").innerHTML = err.message;
  }
}

function saveCookie() {
  const minutes = 20;
  const date = new Date();
  date.setTime(date.getTime() + minutes * 60 * 1000);
  document.cookie = `firstName=${firstName},lastName=${lastName},userId=${userId};expires=${date.toGMTString()}`;
}

function readCookie() {
  userId = -1;
  const data = document.cookie;
  const splits = data.split(",");
  for (let i = 0; i < splits.length; i++) {
    const thisOne = splits[i].trim();
    const tokens = thisOne.split("=");
    if (tokens[0] === "firstName") {
      firstName = tokens[1];
    } else if (tokens[0] === "lastName") {
      lastName = tokens[1];
    } else if (tokens[0] === "userId") {
      userId = Number.parseInt(tokens[1].trim());
    }
  }

  if (userId < 0) {
    window.location.href = "index.html";
  } else {
    document.getElementById("userName").innerHTML =
      `Logged in as ${firstName} ${lastName}`;
  }
}

function doLogout() {
  userId = 0;
  firstName = "";
  lastName = "";
  document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
  window.location.href = "index.html";
}

function addColor() {
  const newColor = document.getElementById("colorText").value;
  document.getElementById("colorAddResult").innerHTML = "";

  const tmp = { color: newColor, userId };
  const jsonPayload = JSON.stringify(tmp);

  const url = `${urlBase}/AddColor.${extension}`;

  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        document.getElementById("colorAddResult").innerHTML =
          "Color has been added";
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("colorAddResult").innerHTML = err.message;
  }
}

function searchColor() {
  const srch = document.getElementById("searchText").value;
  document.getElementById("colorSearchResult").innerHTML = "";

  let colorList = "";

  const tmp = { search: srch, userId: userId };
  const jsonPayload = JSON.stringify(tmp);

  const url = `${urlBase}/SearchColors.${extension}`;

  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        document.getElementById("colorSearchResult").innerHTML =
          "Color(s) has been retrieved";
        const jsonObject = JSON.parse(xhr.responseText);

        for (let i = 0; i < jsonObject.results.length; i++) {
          colorList += jsonObject.results[i];
          if (i < jsonObject.results.length - 1) {
            colorList += "<br />\r\n";
          }
        }

        document.getElementsByTagName("p")[0].innerHTML = colorList;
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("colorSearchResult").innerHTML = err.message;
  }
}
