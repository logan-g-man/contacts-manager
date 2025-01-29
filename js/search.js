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

  firstName = userData.firstName;
  lastName = userData.lastName;
  userId = userData.userId;

  if (userId < 0) {
    window.location.href = "index.html";
  } else {
    document.getElementById("userName").innerHTML =
      `Logged in as ${firstName} ${lastName}`;
  }
}

function doLogout() {
  localStorage.removeItem("userData");
  window.location.href = "index.html";
}

async function searchContact(queryParam) {
  const jsonPayload = JSON.stringify(queryParam);
  const url = `${URL_BASE}/search_contacts.${EXTENSION}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonPayload,
    });

    const data = (await response.json()).data;
    console.log(data);

    // const data = Array.from({ length: 5 }, () => ({
    //   firstName: faker.person.firstName(),
    //   lastName: faker.person.lastName(),
    //   email: faker.internet.email(),
    //   phone: faker.phone.number("###-###-####"),
    // }));

    const contactList = document.getElementById("contactList");
    contactList.innerHTML = "";

    for (const contact of data) {
      const newContactCard = createContactCard(contact);

      contactList.appendChild(newContactCard);
    }
  } catch (err) {
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");

  searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    searchContact({ userID: 6, query });
  });

  // readCookie();
});
