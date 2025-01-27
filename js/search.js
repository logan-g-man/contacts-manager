const urlBase = "http://localhost:8000/LAMPAPI";
const extension = "php";

let userId = 0;
let firstName = "";
let lastName = "";

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

function addContact() {
  const newcontact = document.getElementById("colorText").value;
  document.getElementById("contactAddResult").innerHTML = "";

  const tmp = { contact: newContact, userId };
  const jsonPayload = JSON.stringify(tmp);

  const url = `${urlBase}/AddUser.${extension}`;

  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        document.getElementById("contactAddResult").innerHTML =
          "contact has been added";
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("contactAddResult").innerHTML = err.message;
  }
}

function searchContact() {
  const srch = document.getElementById("searchText").value;
  document.getElementById("contactSearchResult").innerHTML = "";

  let contactList = "";

  const tmp = { search: srch, userId: userId };
  const jsonPayload = JSON.stringify(tmp);

  const url = `${urlBase}/SearchContacts.${extension}`;

  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        document.getElementById("contactSearchResult").innerHTML =
          "Contacts(s) has been retrieved";
        const jsonObject = JSON.parse(xhr.responseText);

        for (let i = 0; i < jsonObject.results.length; i++) {
          contactList += jsonObject.results[i];
          if (i < jsonObject.results.length - 1) {
            contactList += "<br />\r\n";
          }
        }

        document.getElementsByTagName("p")[0].innerHTML = contactList;
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("contactSearchResult").innerHTML = err.message;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const addContactBtn = document.getElementById("addContactBtn");
  const addContactDialog = document.getElementById("addContactDialog");
  const cancelAddBtn = document.getElementById("cancelAdd");
  const addContactForm = document.getElementById("addContactForm");
  const contactList = document.getElementById("contactList");
  const searchInput = document.getElementById("searchInput");
  const logoutBtn = document.getElementById("logoutBtn");

  // Show add contact dialog
  addContactBtn.addEventListener("click", () => {
    addContactDialog.style.display = "block";
  });

  // Hide add contact dialog
  cancelAddBtn.addEventListener("click", () => {
    addContactDialog.style.display = "none";
  });

  // Handle form submission (just prevent default for now)
  addContactForm.addEventListener("submit", (e) => {
    e.preventDefault();
  });

  readCookie();
});
