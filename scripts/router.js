import logoutUser from "./logout.js";
import { getProfile } from "./requestConsts.js";

let status;
let check = false;
let token = localStorage.getItem("JwtToken");

if (token !== undefined) {
  await fetch(getProfile, {
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
      handleResponse(status);
    })
    .catch((error) => {
      handleResponse(status);
      console.error("Error:", error);
    });
}

export function route() {
  let content = document.getElementById("content");
  let currentUrl = window.location.pathname;
  let url = getUrl(currentUrl) + ".html";

  includeHTML(content, url);
}

function getUrl(url) {
  if (token !== undefined) {
    if (check === true && (url === "/registration/" || url === "/login/")) {
      url = "/";
      history.pushState({}, "", "/");
    }
  }

  switch (url) {
    case "/login/":
      url = "loginPage";
      return url;
    case "/registration/":
      url = "registrationPage";
      return url;
    case "/":
      url = "homePage";
      return url;
    case "/logout/":
      url = "homePage";
      logoutUser();
      return url;
    case "/profile":
      url = "profilePage";
      return url;
    default:
      url = "notFoundPage";
      return url;
  }
}

function includeHTML(content, url) {
  var xhttp, element;
  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        element = content;
        element.innerHTML = this.responseText;
        executeScripts(element);
      }
      if (this.status == 404) {
        element.innerHTML = "Page not found.";
      }
    }
  };
  xhttp.open("GET", "../pages/" + url, true);
  xhttp.send();
}

function executeScripts(element) {
  element.querySelectorAll("script").forEach((script) => {
    const newScript = document.createElement("script");
    Array.from(script.attributes).forEach((attribute) => {
      newScript.setAttribute(attribute.name, attribute.value);
    });
    newScript.appendChild(document.createTextNode(script.innerHTML));
    script.parentNode.replaceChild(newScript, script);
  });
}

function handleResponse(status) {
  if (status === 200) {
    check = true;
  } else if (status === 401) {
    check = false;
  }
}

route();
