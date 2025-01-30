import { faker } from "https://esm.sh/@faker-js/faker";
import { URL_BASE, EXTENSION } from "./global.js";
import { createContactCard } from "./contact.js";

function readCookie() {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  if (!userData.expiresAt || userData.expiresAt < new Date().getTime()) {
    localStorage.removeItem("userData");
    window.location.href = "index.html";
    return;
  }

  window.firstName = userData.firstName;
  window.lastName = userData.lastName;
  window.userId = userData.userId;


}

function doLogout() {
  localStorage.removeItem("userData");
  window.location.href = "index.html";
}

// Fetch and display all contacts for the logged-in user
export async function getAllContacts(userId) {
  // const url = `${URL_BASE}/get_contacts.${EXTENSION}`;
  // const jsonPayload = JSON.stringify({ userID: userId });

  // console.log("Fetching contacts for user:", userId);
  // try {
  //   const response = await fetch(url, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: jsonPayload,
  //   });

  //   const data = (await response.json()).data;
  //   displayContacts(data);
  // } catch (err) {
  //   console.error("Error fetching all contacts:", err);
  // }
  const contactList = document.getElementById("contactList");
  contactList.innerHTML = "<strong>Please use the search box to find your contacts.</strong>";
}

// Search contacts based on the query
export async function searchContact(userId, query) {
  const url = `${URL_BASE}/search_contacts.${EXTENSION}`;
  const jsonPayload = JSON.stringify({ userID: userId, query });

  console.log("Searching contacts for user:", userId, "Query:", query);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonPayload,
    });

    const data = (await response.json()).data;
    displayContacts(data);
  } catch (err) {
    console.error("Error searching contacts:", err);
  }
}
// Display contacts on the page
function displayContacts(contacts) {
  const contactList = document.getElementById("contactList");

  // Ensure contacts is an array even if the API returns null/undefined
  const safeContacts = Array.isArray(contacts) ? contacts : [];

  contactList.innerHTML = safeContacts.length ? "" : "No contact found!";

  for (const contact of safeContacts) {
    const newContactCard = createContactCard(contact);
    contactList.appendChild(newContactCard);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  readCookie();
  console.log("User ID after reading cookie:", window.userId);
  // Ensure userId is available
  if (window.userId) {
    getAllContacts(window.userId);

    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");

    searchBtn.addEventListener("click", () => {
      const query = searchInput.value.trim();
      if (query === "") {
        getAllContacts(window.userId);
      } else {
        searchContact(window.userId, query);
      }
    });
  } else {
    console.error("User ID not found, redirecting to login.");
    window.location.href = "index.html";
  }
});

