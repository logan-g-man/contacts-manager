import { faker } from "https://esm.sh/@faker-js/faker";
import { URL_BASE, EXTENSION } from "./global.js";
import { searchContact, displayContacts } from "./search.js";

export function createContactCard(contact) {
  console.log(contact);
  const contactCard = document.createElement("div");
  contactCard.className = "contact-card";
  contactCard.dataset.contactId = contact.ID;

  contactCard.innerHTML = `
    <div class="contact-actions">
      <button class="edit-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path fill="currentColor" d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z"/></svg>
      </button>
      <button class="delete-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path fill="currentColor" d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6z"/></svg>
      </button>
    </div>
    <div class="contact-info">
      <h3>${contact.FirstName} ${contact.LastName}</h3>
      <p>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m20 8l-8 5l-8-5V6l8 5l8-5m0-2H4c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2"/></svg>
        ${contact.Email}
      </p>
      <p>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.28-.28.67-.36 1.02-.25c1.12.37 2.32.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57c.11.35.03.74-.25 1.02z"/></svg>
        ${contact.Phone}
      </p>
      <p>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 11.5A2.5 2.5 0 0 1 9.5 9A2.5 2.5 0 0 1 12 6.5A2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7"/></svg>
        ${contact.Address}
      </p>
      <p>
        ${contact.Notes || "No notes available"}
      </p>
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

function openContactDialog(contact) {
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
    form.dataset.mode = "edit"; // Set to edit mode
    form.dataset.contactId = contact.ID; // Store the contact ID for updating
  } else {
    dialogTitle.textContent = "Add New Contact";
    submitBtn.textContent = "Add Contact";
    form.reset();
    form.dataset.mode = "add"; // Reset to add mode
    delete form.dataset.contactId; // Clear any leftover contact ID
  }

  dialog.style.display = "flex";
}

// Utility function to get the user ID from localStorage
function getUserId() {
  const userData = localStorage.getItem("userData");
  return userData ? JSON.parse(userData).userId : null;
}

async function addContact({
  firstName,
  lastName,
  email,
  phone,
  address,
  notes,
}) {
  const userID = getUserId(); // Retrieve user ID from localStorage

  if (!userID) {
    document.getElementById("contactAddResult").innerHTML =
      "User ID not found. Please log in again.";
    return;
  }

  const tmp = {
    firstName,
    lastName,
    email,
    phone,
    address,
    notes,
    userID,
  };
  const jsonPayload = JSON.stringify(tmp);

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

    return data;
  } catch (err) {
    console.error("Error adding contact:", err);
  }
}

async function addFakerContacts(count) {
  const userID = getUserId(); // Retrieve user ID from localStorage

  if (!userID) {
    document.getElementById("contactAddResult").innerHTML =
      "User ID not found. Please log in again.";
    window.location.href = "/";
    return;
  }
  for (let i = 0; i < count; i++) {
    console.log("Adding contact", i);
    const tmp = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      address: faker.location.streetAddress(),
      notes: faker.lorem.sentence(),
    };

    const contact = await addContact(tmp);
    if (contact.status === "success") {
      console.log("Contact successfully added.");
    } else {
      console.error(`Failed to add contact: ${contact.message}`);
    }
  }
  const searchInput = document.getElementById("searchInput");
  const query = searchInput.value.trim();
  const contacts = await searchContact(userID, query);
  displayContacts(contacts);
}

async function updateContact({
  contactId,
  firstName,
  lastName,
  email,
  phone,
  address,
  notes,
}) {
  const userID = getUserId(); // Retrieve user ID from localStorage

  if (!userID) {
    document.getElementById("contactAddResult").innerHTML =
      "User ID not found. Please log in again.";
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

    if (data.status === "success") {
      console.log(`Contact ID ${contactId} successfully updated.`);
    } else {
      console.error(`Failed to update contact: ${data.message}`);
      document.getElementById("contactAddResult").innerHTML = data.message;
    }
  } catch (err) {
    console.error("Error updating contact:", err);
  }
  const searchInput = document.getElementById("searchInput");
  const query = searchInput.value.trim();
  const contacts = await searchContact(userID, query);
  displayContacts(contacts);
}

async function removeContact(contact) {
  const userID = getUserId(); // Retrieve user ID from localStorage

  if (!userID) {
    document.getElementById("contactAddResult").innerHTML =
      "User ID not found. Please log in again.";
    return;
  }

  const contactId = contact.ID; // The contact ID to delete

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
    } else {
      console.error(`Failed to delete contact: ${data.message}`);
    }
  } catch (err) {
    console.error("Error deleting contact:", err);
    alert("An unexpected error occurred while deleting the contact.");
  }
  const searchInput = document.getElementById("searchInput");
  const query = searchInput.value.trim();
  const contacts = searchContact(userID, query);
  displayContacts(contacts);
}

async function handleFormSubmission(e) {
  const userID = getUserId();
  const { firstName, lastName, email, phone, address, notes } = e.target;

  // Validate required fields
  if (!firstName.value || !lastName.value || !email.value || !phone.value) {
    document.getElementById("contactAddResult").innerHTML =
      "All required fields must be filled.";
    return;
  }

  // Set default values for optional fields
  const contact = {
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    phone: phone.value,
    address: address.value || "",
    notes: notes.value || "",
  };

  if (e.target.dataset.mode === "edit") {
    await updateContact({
      contactId: e.target.dataset.contactId,
      ...contact,
    });
  } else {
    const added = await addContact({ ...contact });
    if (added.status === "success") {
      console.log("Contact successfully added.");
    } else {
      console.error(`Failed to add contact: ${added.message}`);
    }

    const searchInput = document.getElementById("searchInput");
    const query = searchInput.value.trim();
    const contacts = await searchContact(userID, query);
    displayContacts(contacts);
  }

  // Close the dialog after submission
  addContactDialog.style.display = "none";

  // Get the current search query
  const searchInput = document.getElementById("searchInput");
  const query = searchInput.value.trim();
  const contacts = await searchContact(userID, query);
  displayContacts(contacts);
}

document.addEventListener("DOMContentLoaded", () => {
  const addContactBtn = document.getElementById("addContactBtn");
  const addContactDialog = document.getElementById("addContactDialog");
  const cancelAddBtn = document.getElementById("cancelAdd");
  const addContactForm = document.getElementById("addContactForm");
  const addFakerBtn = document.getElementById("addFakerBtn");

  // Show add contact dialog
  addContactBtn.addEventListener("click", () => {
    openContactDialog();
  });

  // Hide add contact dialog
  cancelAddBtn.addEventListener("click", () => {
    addContactDialog.style.display = "none";
  });

  addContactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    await handleFormSubmission(e);
  });
  if (addFakerBtn) {
    addFakerBtn.addEventListener("click", async () => {
      console.log("Adding faker contacts");
      await addFakerContacts(10);
    });
  }
});
