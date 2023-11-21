import logoutUser from "./logout.js";

export function route() {
  let content = document.getElementById("content");
  let currentUrl = window.location.pathname;
  let url = getUrl(currentUrl) + ".html";

  includeHTML(content, url);
}

function getUrl(url) {
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

route();
