import { URL_BASE, EXTENSION } from "./global.js";
import { searchContact, getAllContacts } from "./search.js";

export function createContactCard(contact) {
  const contactCard = document.createElement("div");
  contactCard.className = "contact-card";

  contactCard.innerHTML = `
    <div class="contact-info">
      <h3>Name: ${contact.FirstName} ${contact.LastName}</h3>
      <p>Email: ${contact.Email}</p>
      <p>Phone: ${contact.Phone}</p>
      <p>Address: ${contact.Address}</p>
      <p><strong>Notes:</strong> ${contact.Notes || "No notes available"}</p>
    </div>
    <div class="contact-actions">
      <button class="edit-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path fill="currentColor" d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z"/></svg>
        Edit
      </button>
      <button class="delete-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path fill="currentColor" d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6z"/></svg>
        Delete
      </button>
    </div>
  `;

  contactCard.querySelector(".delete-btn").addEventListener("click", () => {
    removeContact(contact);
  });

  contactCard.querySelector(".edit-btn").addEventListener("click", () => {
    openContactDialog(contact);
    console.log(contact.ID);
  });

  return contactCard;
}

function openContactDialog(contact = null) {
  const dialog = document.getElementById("addContactDialog");
  const form = document.getElementById("addContactForm");
  const dialogTitle = dialog.querySelector("h2");
  const submitBtn = form.querySelector("button[type='submit']");

  if (contact) {
    dialogTitle.textContent = "Edit Contact";
    submitBtn.textContent = "Update Contact";
    form.firstName.value = contact.FirstName;
    form.lastName.value = contact.LastName;
    form.email.value = contact.Email;
    form.phone.value = contact.Phone;
    form.address.value = contact.Address || "";
    form.notes.value = contact.Notes || "";
    form.dataset.mode = "edit";
    form.dataset.contactId = contact.ID;
  } else {
    dialogTitle.textContent = "Add New Contact";
    submitBtn.textContent = "Add Contact";
    form.reset();
    delete form.dataset.contactId;
  }

  dialog.style.display = "block";
}

// Utility function to get the user ID from localStorage
function getUserId() {
  const userData = localStorage.getItem("userData");
  return userData ? JSON.parse(userData).userId : null;
}

async function addContact(firstName, lastName, email, phone, address, notes) {

  const userID = getUserId(); // Retrieve user ID from localStorage

  if (!userID) {
    document.getElementById("contactAddResult").innerHTML = "User ID not found. Please log in again.";
    return;
  }
  const tmp = {
    firstName,
    lastName,
    email,
    phone,
    address,
    notes,
    userID, // Ensure this is set properly.
  };
  const jsonPayload = JSON.stringify(tmp);
  console.log(jsonPayload);
  const url = `${URL_BASE}/create_contact.${EXTENSION}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonPayload,
    });

    const data = await response.json();
    console.log(data.message);
    if (data.status !== "success") {
      console.log("It was actually a success");
      document.getElementById("contactAddResult").innerHTML = data.message || "Error adding contact.";
    }
  } catch (err) {
    document.getElementById("contactAddResult").innerHTML = err.message;
  }
}


async function updateContact(contactId, firstName, lastName, email, phone, address, notes) {

  const userID = getUserId(); // Retrieve user ID from localStorage

  if (!userID) {
    document.getElementById("contactAddResult").innerHTML = "User ID not found. Please log in again.";
    return;
  }

  const tmp = {
    contactID: contactId,
    firstName,
    lastName,
    email,
    phone,
    address,
    notes,
    userID,
  };
  const jsonPayload = JSON.stringify(tmp);

  const url = `${URL_BASE}/update_contact.${EXTENSION}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonPayload,
    });

    const data = await response.json();
    // Refresh contact list after update
    searchContact("");
  } catch (err) {
    document.getElementById("contactAddResult").innerHTML = err.message;
  }
}


async function removeContact(contact) {
  const userID = getUserId(); // Retrieve user ID from localStorage

  if (!userID) {
    document.getElementById("contactAddResult").innerHTML = "User ID not found. Please log in again.";
    return;
  }

  const contactId = contact.ID;  // The contact ID to delete

  const url = `${URL_BASE}/delete_contact.${EXTENSION}`;
  const jsonPayload = JSON.stringify({ userID: userID, contactID: contactId });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonPayload,
    });

    const data = await response.json();

    if (data.status === "success") {
      console.log(`Contact ID ${contactId} successfully deleted.`);

      // Get the current query from the search input
      const searchInput = document.getElementById("searchInput");
      const query = searchInput.value.trim();

      // Refresh the contact list based on the current query
      if (query === "") {
        getAllContacts(userID);  // If no search query, load all contacts
      } else {
        searchContact(userID, query);  // Otherwise, refresh based on search query
      }

    } else {
      console.error(`Failed to delete contact: ${data.message}`);
      alert(`Error: ${data.message}`);
    }
  } catch (err) {
    console.error("Error deleting contact:", err);
    alert("An unexpected error occurred while deleting the contact.");
  }
}



document.addEventListener("DOMContentLoaded", () => {
  const addContactBtn = document.getElementById("addContactBtn");
  const addContactDialog = document.getElementById("addContactDialog");
  const cancelAddBtn = document.getElementById("cancelAdd");
  const addContactForm = document.getElementById("addContactForm");

  // Show add contact dialog
  addContactBtn.addEventListener("click", () => {
    openContactDialog();
  });

  // Hide add contact dialog
  cancelAddBtn.addEventListener("click", () => {
    addContactDialog.style.display = "none";
  });

  // Handle form submission
  addContactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userID = getUserId();
    const { firstName, lastName, email, phone, address, notes } = e.target;

    // Validate required fields
    if (!firstName.value || !lastName.value || !email.value || !phone.value) {
      document.getElementById("contactAddResult").innerHTML = "All required fields must be filled.";
      return;
    }

    // Set default values for optional fields
    const addressValue = address.value || '';
    const notesValue = notes.value || '';

    if (e.target.dataset.mode === "edit") {
      await updateContact(
        e.target.dataset.contactId,
        firstName.value,
        lastName.value,
        email.value,
        phone.value,
        addressValue,
        notesValue
      );
    } else {
      await addContact(
        firstName.value,
        lastName.value,
        email.value,
        phone.value,
        addressValue,
        notesValue
      );
    }

    addContactDialog.style.display = "none";  // Close dialog after submission
    searchContact(userID, "");  // Refresh contact list
  });



});
