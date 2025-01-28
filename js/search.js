function saveCookie() {
  const minutes = 20;
  const date = new Date();
  date.setTime(date.getTime() + minutes * 60 * 1000);
  document.cookie = `firstName=${firstName},lastName=${lastName},userId=${userId};expires=${date.toGMTString()}`;
}

function readCookie() {
  userId = -1;
  const data = document.cookie;
  const splits = data.split(",");
  for (let i = 0; i < splits.length; i++) {
    const thisOne = splits[i].trim();
    const tokens = thisOne.split("=");
    if (tokens[0] === "firstName") {
      firstName = tokens[1];
    } else if (tokens[0] === "lastName") {
      lastName = tokens[1];
    } else if (tokens[0] === "userId") {
      userId = Number.parseInt(tokens[1].trim());
    }
  }

  if (userId < 0) {
    window.location.href = "index.html";
  } else {
    document.getElementById("userName").innerHTML =
      `Logged in as ${firstName} ${lastName}`;
  }
}

function doLogout() {
  userId = 0;
  firstName = "";
  lastName = "";
  document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
  window.location.href = "index.html";
}

async function searchContact(queryParam) {
  const jsonPayload = JSON.stringify(queryParam);
  const url = `${URL_BASE}/SearchContacts.${EXTENSION}`;

  try {
    // const response = await fetch(url, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: jsonPayload,
    // });
    //
    // const data = await response.json();
    // mock data
    const data = [
      {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "123-456-7890",
      },
      {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "098-765-4321",
      },
      {
        name: "Bob Johnson",
        email: "bob.j@example.com",
        phone: "555-555-5555",
      },
      {
        name: "Alice Brown",
        email: "alice.b@example.com",
        phone: "111-222-3333",
      },
    ];

    const contactList = document.getElementById("contactList");
    contactList.innerHTML = "";

    for (const contact of data) {
      const newContactCard = createContactCard(contact);

      contactList.appendChild(newContactCard);
    }
  } catch (err) {
    document.getElementById("contactSearchResult").innerHTML = err.message;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");

  searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    searchContact({ query });
  });

  logoutBtn.readCookie();
});
