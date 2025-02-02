import { URL_BASE, EXTENSION } from "./global.js";

document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = e.target.firstName.value.trim();
    const lastName = e.target.lastName.value.trim();
    const newUsername = e.target.newUsername.value.trim();
    const newPassword = e.target.newPassword.value.trim();
    const confirmPassword = e.target.confirmPassword.value.trim();

    // Validation
    if (!firstName || !lastName || !newUsername || !newPassword || !confirmPassword) {
      alert("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Payload for the request
    const payload = {
      firstName,
      lastName,
      login: newUsername,
      password: newPassword,
    };

    try {
      const response = await fetch(`${URL_BASE}/register.${EXTENSION}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.status === "success") {
        alert("User successfully registered. Please log in.");
        window.location.href = "index.html";  // Redirect to login page
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (err) {
      console.error("Error registering user:", err);
      alert("An unexpected error occurred. Please try again later.");
    }
  });
});
