import { getProfile } from "./requestConsts.js";

const token = localStorage.getItem("JwtToken");
const loginLink = document.getElementById("loginLink");
const dropDown = document.getElementById("dropdownProfile");
const dropDownButton = document.getElementById("dropdownButton");
let status;

if (token !== undefined) {
  fetch(getProfile, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + token,
    },
  })
    .then((response) => {
      status = response.status;

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      handleResponse(data, status);
    })
    .catch((error) => {
      handleResponse(null, status);
    });
} else {
  userNotAuthorized();
}

function handleResponse(data, status) {
  if (status === 200) {
    userIsAuthorized(data);
  } else if (status === 401) {
    userNotAuthorized();
  }

  const authorsLink = document.getElementById("authors");
  const groupsLink = document.getElementById("groups");

  onElement(authorsLink);
  onElement(groupsLink);
}

function userIsAuthorized(data) {
  loginLink.classList.add("d-none");
  dropDown.classList.add("d-block");
  dropDown.classList.remove("d-none");
  loginLink.classList.remove("d-block");
  dropDownButton.innerText = data.email;
}

function userNotAuthorized() {
  loginLink.classList.add("d-block");
  dropDown.classList.add("d-none");
  dropDown.classList.remove("d-block");
  loginLink.classList.remove("d-none");
}

export function offElement(element) {
  if (element.classList.contains("d-block")) {
    element.classList.add("d-none");
    element.classList.remove("d-block");
  }
}

export function onElement(element) {
  if (element.classList.contains("d-none")) {
    element.classList.add("d-block");
    element.classList.remove("d-none");
  }
}
