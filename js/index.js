function saveCookie() {
  const minutes = 20;
  const date = new Date();
  date.setTime(date.getTime() + minutes * 60 * 1000);
  document.cookie = `firstName=${firstName},lastName=${lastName},userId=${userId};expires=${date.toGMTString()}`;
}

function doLogin(username, password) {
  userId = 0;
  firstName = "";
  lastName = "";

  //	var hash = md5( password );

  document.getElementById("loginResult").innerHTML = "";

  const tmp = { login: username, password: password };
  const jsonPayload = JSON.stringify(tmp);

  const url = `${URL_BASE}/Login.${EXTENSION}`;

  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = () => {
      if (this.readyState === 4 && this.status === 200) {
        const jsonObject = JSON.parse(xhr.responseText);
        userId = jsonObject.id;

        //Disable for now
        // if (userId < 1) {
        //   document.getElementById("loginResult").innerHTML =
        //     "User/Password combination incorrect";
        //   return;
        // }

        firstName = jsonObject.firstName;
        lastName = jsonObject.lastName;

        saveCookie();

        window.location.href = "search.html";
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    console.log("failed!");
    document.getElementById("loginResult").innerHTML = err.message;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  //form submit event
  document.getElementById("loginForm").addEventListener("submit", (e) => {
    console.log("submitted");
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    doLogin(username, password);
  });
});
