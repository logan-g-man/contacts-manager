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
  }
}

const PAGE_SIZE = 20; // New constant for pagination

// Display contacts on the page with pagination if needed
function displayContacts(contacts) {
  const contactList = document.getElementById("contactList");
  // Ensure contacts is an array
  const safeContacts = Array.isArray(contacts) ? contacts : [];

  // If no contacts, show message and remove pagination if present
  if (safeContacts.length === 0) {
    contactList.innerHTML = "No contact found!";
    const paginationContainer = document.getElementById("paginationContainer");
    if (paginationContainer) paginationContainer.remove();
    return;
  }

  let currentPage = 1;
  const totalPages = Math.ceil(safeContacts.length / PAGE_SIZE);

  // Helper to render a given page of contacts
  const renderPage = (page) => {
    contactList.innerHTML = "";
    const startIndex = (page - 1) * PAGE_SIZE;
    const pageContacts = safeContacts.slice(startIndex, startIndex + PAGE_SIZE);
    for (const contact of pageContacts) {
      const newContactCard = createContactCard(contact);
      contactList.appendChild(newContactCard);
    }
  };

  renderPage(currentPage);

  // Create or update pagination controls if needed
  let paginationContainer = document.getElementById("paginationContainer");
  if (totalPages > 1) {
    if (!paginationContainer) {
      paginationContainer = document.createElement("div");
      paginationContainer.id = "paginationContainer";
      // Append pagination container after contactList
      contactList.parentNode.insertBefore(paginationContainer, contactList.nextSibling);
    }
    paginationContainer.innerHTML = "";
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "Previous";
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderPage(currentPage);
        updatePagination();
      }
    });
    paginationContainer.appendChild(prevBtn);

    const pageIndicator = document.createElement("span");
    pageIndicator.textContent = ` Page ${currentPage} of ${totalPages} `;
    paginationContainer.appendChild(pageIndicator);

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderPage(currentPage);
        updatePagination();
      }
    });
    paginationContainer.appendChild(nextBtn);

    function updatePagination() {
      pageIndicator.textContent = ` Page ${currentPage} of ${totalPages} `;
      prevBtn.disabled = currentPage === 1;
      nextBtn.disabled = currentPage === totalPages;
    }
  } else {
    // Remove pagination container if contacts are fewer than or equal to PAGE_SIZE
    if (paginationContainer) paginationContainer.remove();
  }
}

async function handleSearch() {
  console.log("Handling search...");
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
  await searchContact(userData.userId, searchTerm);
  loadingSpinner.style.display = 'none';
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

  handleSearch()
});
