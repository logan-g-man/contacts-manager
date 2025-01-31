import { URL_BASE, EXTENSION } from "./global.js";

export function createContactCard(contact) {
  console.log(contact);
  const contactCard = document.createElement("div");
  contactCard.className = "contact-card";
  contactCard.dataset.contactId = contact.ID;

  contactCard.innerHTML = `
    <div class="contact-info">
      <h3>Name: ${contact.FirstName} ${contact.LastName}</h3>
      <p>Email: ${contact.Email}</p>
      <p>Phone: ${contact.Phone}</p>
      <p>Address: ${contact.Address}</p>
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
    form.dataset.mode = "edit";
    form.dataset.contactId = contact.ID;
  } else {
    dialogTitle.textContent = "Add New Contact";
    submitBtn.textContent = "Add Contact";
    form.reset();
    form.dataset.mode = "add";
    delete form.dataset.contactId;
  }

  dialog.style.display = "block";
}

async function addContact(contact) {
  const jsonPayload = JSON.stringify(contact);
  const url = `${URL_BASE}/add_contact.${EXTENSION}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonPayload,
    });

    const data = await response.json();
    const status = data.status;

    if (status !== "success") {
      throw new Error(data.message);
    }

    // Add the new contact card to the list
    const contactList = document.getElementById("contactList");
    contactList.appendChild(createContactCard(contact));

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function updateContact(contact) {
  console.log(contact);
  const jsonPayload = JSON.stringify(contact);
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
    const status = data.status;
    if (status !== "success") {
      throw new Error(data.message);
    }

    // Find and update the specific contact card
    const existingCard = document.querySelector(
      `.contact-card[data-contact-id="${contact.contactID}"]`,
    );

    if (existingCard) {
      const newCard = createContactCard(contact);
      existingCard.replaceWith(newCard);
    }
  } catch (err) {
    console.error(err);
  }
}

function removeContact(contact) {
  const jsonPayload = JSON.stringify(contact);
  const url = `${URL_BASE}/update_contact.${EXTENSION}`;
  // Implement removeContact or reference existing remove logic
  // ...existing code...
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
    const { firstName, lastName, email, phone } = e.target;

    console.log(e.target.dataset);
    try {
      if (e.target.dataset.mode === "edit") {
        await updateContact({
          id: 6,
          firstName: firstName.value,
          lastName: lastName.value,
          email: email.value,
          phone: phone.value,
          contactID: e.target.dataset.contactId,
        });
      } else {
        const newContact = {
          userID: JSON.parse(localStorage.getItem("user")).id, // Get userID from logged in user
          firstName: firstName.value,
          lastName: lastName.value,
          email: email.value,
          phone: phone.value,
          address: "", // Optional field
          notes: "", // Optional field
        };
        await addContact(newContact);
      }

      addContactDialog.style.display = "none";
      e.target.reset();
    } catch (err) {
      document.getElementById("contactAddResult").innerHTML = err.message;
    }
  });
});
