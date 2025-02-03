import { URL_BASE, EXTENSION } from "./global.js";
import { createContactCard } from "./contact.js";

// Add spinner helper functions
function showSpinner() {
  const spinner = document.getElementById("loadingSpinner");
  if (spinner) spinner.style.display = "block";
}

function hideSpinner() {
  const spinner = document.getElementById("loadingSpinner");
  if (spinner) spinner.style.display = "none";
}

function readCookie() {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  if (!userData.expiresAt || userData.expiresAt < new Date().getTime()) {
    localStorage.removeItem("userData");
    window.location.href = "index.html";
    return;
  }
  return userData;
}

function doLogout() {
  localStorage.removeItem("userData");
  window.location.href = "index.html";
}

// Fetch and display all contacts for the logged-in user
export async function getAllContacts(userId) {
  const url = `${URL_BASE}/get_contacts.${EXTENSION}`;
  const jsonPayload = JSON.stringify({ userID: userId });

  console.log("Fetching contacts for user:", userId);
  showSpinner();
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
    console.error("Error fetching all contacts:", err);
  } finally {
    hideSpinner();
  }
}

// Search contacts based on the query
export async function searchContact(userId, query) {
  const url = `${URL_BASE}/search_contacts.${EXTENSION}`;
  const jsonPayload = JSON.stringify({ userID: userId, query });

  console.log("Searching contacts for user:", userId, "Query:", query);
  showSpinner();
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
  } finally {
    hideSpinner();
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

function handleSearch() {
  const searchInput = document.getElementById("searchInput");
  const searchTerm = searchInput.value.trim();
  const emptySearch = document.querySelector('.empty-search');
  const loadingSpinner = document.getElementById("loadingSpinner");

  // Hide empty search message when searching

  // Show loading spinner
  loadingSpinner.style.display = 'block';
  emptySearch.style.display = 'none';

  // Perform search
  const userData = readCookie();
  searchContact(userData.userId, searchTerm);
}

document.addEventListener("DOMContentLoaded", () => {
  const userData = readCookie();
  console.log("User ID after reading cookie:", userData.userId);
  if (!userData.userId) {
    console.error("User ID not found, redirecting to login.");
    userData.location.href = "index.html";
  }

  const searchBtn = document.getElementById("searchBtn");
  searchBtn.addEventListener("click", handleSearch);
  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn.addEventListener("click", doLogout);
  if (!searched) {
    loadingSpinner.style.display = 'none';
    emptySearch.style.display = 'block';
    return;
  }

  handleSearch();
  // Call handleSearch on page load
});
