function createContactCard(contact) {
  const contactCard = document.createElement("div");
  contactCard.className = "contact-card";

  contactCard.innerHTML = `
    <div class="contact-info">
      <h3>Name: ${contact.name}</h3>
      <p>Email: ${contact.email}</p>
      <p>Phone: ${contact.phone}</p>
    </div>
    <div class="contact-actions">
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>
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
    form.name.value = contact.name;
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

async function addContact(name, email, phone) {
  const tmp = { name: name, email: email, phone: phone, userId: userId };
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

async function updateContact(contactId, name, email, phone) {
  const tmp = { id: contactId, name, email, phone, userId };
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
    const { name, email, phone } = e.target;

    if (e.target.dataset.mode === "edit") {
      await updateContact(
        e.target.dataset.contactId,
        name.value,
        email.value,
        phone.value
      );
    } else {
      await addContact(name.value, email.value, phone.value);
    }

    addContactDialog.style.display = "none";
    searchContact(""); // Refresh contact list
  });
});