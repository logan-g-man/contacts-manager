function saveCookie(firstName, lastName, userId) {
  const minutes = 20;
  const date = new Date();
  date.setTime(date.getTime() + minutes * 60 * 1000);
  document.cookie = `firstName=${firstName},lastName=${lastName},userId=${userId};expires=${date.toGMTString()}`;
}

async function doLogin(username, password) {
  userId = 0;
  firstName = "";
  lastName = "";

  //	var hash = md5( password );

  document.getElementById("loginResult").innerHTML = "";

  const tmp = { login: username, password: password };
  const jsonPayload = JSON.stringify(tmp);

  try {
    const response = await fetch(`${URL_BASE}/Login.${EXTENSION}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonPayload,
    });

    //Disable for now
    // const data = await response.json();
    // if (userId < 1) {
    //   document.getElementById("loginResult").innerHTML =
    //     "User/Password combination incorrect";
    //   return;
    // }
    // saveCookie();

    window.location.href = "search.html";
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
