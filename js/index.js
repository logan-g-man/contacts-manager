function saveCookie() {
  const minutes = 20;
  const date = new Date();
  date.setTime(date.getTime() + minutes * 60 * 1000);
  document.cookie = `firstName=${firstName},lastName=${lastName},userId=${userId};expires=${date.toGMTString()}`;
}

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

  const url = `${URL_BASE}/Login.${EXTENSION}`;

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
