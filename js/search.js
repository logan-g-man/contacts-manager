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
  }
  hideSpinner();
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
    return data;
  } catch (err) {
    console.error("Error searching contacts:", err);
  }
}

const PAGE_SIZE = 21;

const updateAllPaginationContainers = (currentPage, totalPages, contacts) => {
  const containers = document.querySelectorAll('[id^="paginationContainer-"]');
  for (const container of containers) {
    container.innerHTML = `
      <button id="prevBtn" class="prevBtn" ${currentPage === 1 ? "disabled" : ""}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M15.41 16.58L10.83 12l4.58-4.59L14 6l-6 6l6 6z"/></svg>  
      </button>
      <p>Page ${currentPage} of ${totalPages}</p>
      <button id="nextBtn" class="nextBtn" ${currentPage === totalPages ? "disabled" : ""}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M8.59 16.58L13.17 12L8.59 7.41L10 6l6 6l-6 6z"/></svg>  
      </button>
    `;
    const prevBtn = container.querySelector(".prevBtn");
    prevBtn.addEventListener("click", () => {
      console.log("contacts", contacts);
      const contactSlice = getContactSlice(contacts, currentPage - 1);
      renderContactList(contactSlice);
      updateAllPaginationContainers(currentPage - 1, totalPages, contacts);
    });
    const nextBtn = container.querySelector(".nextBtn");
    nextBtn.addEventListener("click", () => {
      const contactSlice = getContactSlice(contacts, currentPage + 1);
      renderContactList(contactSlice);
      updateAllPaginationContainers(currentPage + 1, totalPages, contacts);
    });
  }
};

//pass all contacts
const renderContactList = (contactSlice) => {
  console.log("contactSlice", contactSlice);
  const contactList = document.getElementById("contactList");
  contactList.innerHTML = "";
  for (const contact of contactSlice) {
    const newContactCard = createContactCard(contact);
    contactList.appendChild(newContactCard);
  }
};

const getContactSlice = (contacts, currentPage) => {
  console.log("contacts", contacts);
  const start = (currentPage - 1) * PAGE_SIZE;
  return contacts.slice(start, start + PAGE_SIZE);
};

// Display contacts on the page with pagination if needed
function displayContacts(contacts) {
  const contactList = document.getElementById("contactList");

  if (contacts.length === 0) {
    contactList.innerHTML = "No contact found!";
    const containers = document.querySelectorAll(
      "[id^='paginationContainer-']",
    );
    for (const container of containers) {
      container.remove();
    }
    return;
  }

  const currentPage = 1;
  const totalPages = Math.ceil(contacts.length / PAGE_SIZE);

  renderContactList(getContactSlice(contacts, currentPage));

  // Handle multiple pagination containers
  if (totalPages > 1) {
    updateAllPaginationContainers(currentPage, totalPages, contacts);
  } else {
    const containers = document.querySelectorAll(
      '[id^="paginationContainer-"]',
    );
    for (const container of containers) {
      container.remove();
    }
  }
}

async function handleSearch() {
  console.log("Handling search...");
  const searchInput = document.getElementById("searchInput");
  const searchTerm = searchInput.value.trim();
  const emptySearch = document.querySelector(".empty-search");
  const loadingSpinner = document.getElementById("loadingSpinner");

  // Hide empty search message when searching

  // Show loading spinner
  loadingSpinner.style.display = "block";
  emptySearch.style.display = "none";

  // Perform search
  const userData = readCookie();
  const contacts = await searchContact(userData.userId, searchTerm);

  loadingSpinner.style.display = "none";
  displayContacts(contacts);
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
});
