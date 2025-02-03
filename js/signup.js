// import { URL_BASE, EXTENSION } from "./global.js";

// document.addEventListener("DOMContentLoaded", () => {
//   const signupForm = document.getElementById("signupForm");
//   const signupError = document.getElementById("signupError");  // Reference to the error display

//   signupForm.addEventListener("submit", async (e) => {
//     e.preventDefault();
//     signupError.textContent = "";  // Clear previous errors

//     const firstName = e.target.firstName.value.trim();
//     const lastName = e.target.lastName.value.trim();
//     const newUsername = e.target.newUsername.value.trim();
//     const newPassword = e.target.newPassword.value.trim();
//     const confirmPassword = e.target.confirmPassword.value.trim();

//     // Validation
//     if (!firstName || !lastName || !newUsername || !newPassword || !confirmPassword) {
//       signupError.textContent = "All fields are required.";
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       signupError.textContent = "Passwords do not match.";
//       return;
//     }

//     // Payload for the request
//     const payload = {
//       firstName,
//       lastName,
//       login: newUsername,
//       password: newPassword,
//     };

//     try {
//       const response = await fetch(`${URL_BASE}/register.${EXTENSION}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       const result = await response.json();

//       if (result.status === "success") {
//         // Redirect on success
//         window.location.href = "index.html";
//       } else {
//         signupError.textContent = `Error: ${result.message}`;
//       }
//     } catch (err) {
//       console.error("Error registering user:", err);
//       signupError.textContent = "An unexpected error occurred. Please try again later.";
//     }
//   });
// });

import { URL_BASE, EXTENSION } from "./global.js";

function registerUser() {
  console.log("registerUser function called");
  const signupError = document.getElementById("signupError");
  signupError.textContent = "";

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const username = document.getElementById("newUsername").value.trim();
  const password = document.getElementById("newPassword").value.trim();
  const confirmPassword = document
    .getElementById("confirmPassword")
    .value.trim();

  if (!firstName || !lastName || !username || !password || !confirmPassword) {
    signupError.textContent = "All fields are required.";
    return;
  }

  if (password !== confirmPassword) {
    signupError.textContent = "Passwords do not match.";
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
        signupError.style.color = "green";
        signupError.textContent =
          "Registration successful. Redirecting to login...";
        setTimeout(() => {
          window.location.href = "/";
        }, 2000); // Redirect after 2 seconds
      } else {
        signupError.textContent = "Registration failed: " + data.message;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      signupError.textContent =
        "An error occurred during registration. Please try again.";
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
