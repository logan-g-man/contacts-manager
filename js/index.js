import { URL_BASE, EXTENSION } from "./global.js";

function saveCookie(firstName, lastName, userId) {
  const userData = {
    firstName,
    lastName,
    userId,
    expiresAt: new Date().getTime() + (20 * 60 * 1000) // 20 minutes
  };
  localStorage.setItem('userData', JSON.stringify(userData));
}

async function doLogin(username, password) {
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
