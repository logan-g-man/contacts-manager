// import { URL_BASE, EXTENSION } from "./global.js";

// function saveCookie(firstName, lastName, userId) {
//   const userData = {
//     firstName,
//     lastName,
//     userId,
//     expiresAt: new Date().getTime() + (20 * 60 * 1000) // 20 minutes
//   };
//   localStorage.setItem('userData', JSON.stringify(userData));
// }

// async function doLogin(username, password) {
//   document.getElementById("loginResult").innerHTML = "";

//   const tmp = { login: username, password: password };
//   const jsonPayload = JSON.stringify(tmp);

//   try {
//     const response = await fetch(`${URL_BASE}/Login.${EXTENSION}`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: jsonPayload,
//     });

//     //Disable for now
//     // const data = await response.json();
//     // if (userId < 1) {
//     //   document.getElementById("loginResult").innerHTML =
//     //     "User/Password combination incorrect";
//     //   return;
//     // }
//     // saveCookie();

//     window.location.href = "search.html";
//   } catch (err) {
//     console.log("failed!");
//     document.getElementById("loginResult").innerHTML = err.message;
//   }
// }

// document.addEventListener("DOMContentLoaded", () => {
//   //form submit event
//   document.getElementById("loginForm").addEventListener("submit", (e) => {
//     console.log("submitted");
//     e.preventDefault();
//     const username = e.target.username.value;
//     const password = e.target.password.value;
//     doLogin(username, password);
//   });
// });


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
    const response = await fetch(`${URL_BASE}/login.${EXTENSION}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonPayload,
    });

    const data = await response.json();

    // Handle response and validate user login
    if (response.ok && data.status === 'success') {
      const { firstName, lastName, id: userId } = data.data;
      saveCookie(firstName, lastName, userId); // Save user data
      document.getElementById("loginResult").innerHTML = "Login successful!";
      window.location.href = "search.html"; // Redirect to dashboard
    } else {
      document.getElementById("loginResult").innerHTML = data.message || "User/Password combination incorrect";
    }

  } catch (err) {
    console.error("Failed to log in:", err);
    document.getElementById("loginResult").innerHTML = "An error occurred. Please try again.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Form submit event
  document.getElementById("loginForm").addEventListener("submit", (e) => {
    console.log("submitted");
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    doLogin(username, password);
  });
});
