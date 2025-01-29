export function createContactCard(contact) {
  const contactCard = document.createElement("div");
  contactCard.className = "contact-card";

  contactCard.innerHTML = `
    <div class="contact-info">
      <h3>Name: ${contact.firstName} ${contact.lastName}</h3>
      <p>Email: ${contact.email}</p>
      <p>Phone: ${contact.phone}</p>
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

function openContactDialog(contact = null) {
  const dialog = document.getElementById("addContactDialog");
  const form = document.getElementById("addContactForm");
  const dialogTitle = dialog.querySelector("h2");
  const submitBtn = form.querySelector("button[type='submit']");

  if (contact) {
    dialogTitle.textContent = "Edit Contact";
    submitBtn.textContent = "Update Contact";
    form.firstName.value = contact.firstName;
    form.lastName.value = contact.lastName;
    form.email.value = contact.email;
    form.phone.value = contact.phone;
    form.dataset.mode = "edit";
    form.dataset.contactId = contact.id;
  } else {
    dialogTitle.textContent = "Add New Contact";
    submitBtn.textContent = "Add Contact";
    form.reset();
    form.dataset.mode = "add";
    delete form.dataset.contactId;
  }

  dialog.style.display = "block";
}

async function addContact(firstName, lastName, email, phone) {
  const tmp = {
    firstName,
    lastName,
    email,
    phone,
    userId,
  };
  const jsonPayload = JSON.stringify(tmp);

  const url = `${URL_BASE}/AddUser.${EXTENSION}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonPayload,
    });

    const data = await response.json();
  } catch (err) {
    document.getElementById("contactAddResult").innerHTML = err.message;
  }
}

async function updateContact(contactId, firstName, lastName, email, phone) {
  const tmp = {
    id: contactId,
    firstName,
    lastName,
    email,
    phone,
    userId,
  };
  const jsonPayload = JSON.stringify(tmp);

  const url = `${URL_BASE}/UpdateContact.${EXTENSION}`;

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

function removeContact(contact) {
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

    if (e.target.dataset.mode === "edit") {
      await updateContact(
        e.target.dataset.contactId,
        firstName.value,
        lastName.value,
        email.value,
        phone.value,
      );
    } else {
      await addContact(
        firstName.value,
        lastName.value,
        email.value,
        phone.value,
      );
    }

    addContactDialog.style.display = "none";
    searchContact(""); // Refresh contact list
  });
});
