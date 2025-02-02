import { URL_BASE, EXTENSION } from "./global.js";

function registerUser() {
  console.log("registerUser function called");
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const username = document.getElementById("newUsername").value;
  const password = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  const data = {
    firstName: firstName,
    lastName: lastName,
    login: username,
    password: password,
  };

  console.log("Sending data:", data);

  fetch(`${URL_BASE}/register.${EXTENSION}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      console.log("Response received:", response);
      return response.json();
    })
    .then((data) => {
      console.log("Response data:", data);
      if (data.status === "success") {
        alert("Registration successful");
        window.location.href = "/";
      } else {
        alert("Registration failed: " + data.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred during registration");
    });
}

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded and parsed");
  document
    .getElementById("signupForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      console.log("Form submitted");
      registerUser();
    });
});

