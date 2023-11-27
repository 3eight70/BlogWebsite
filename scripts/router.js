import {
  loginPage,
  loginHTML,
  logoutPage,
  profileHTML,
  postCreateHTML,
  concretePostHTML,
  authorsHTML,
  notFoundPage,
  authorsPage,
  concretePostPage,
  postCreatePage,
  homeHTML,
  profilePage,
  registrationPage,
  homePage,
  registrationHTML,
  communitiesPage,
  communitiesHTML,
  concreteCommunityPage,
  concreteCommunityHtml,
} from "./exportPagesConsts.js";
import { logoutUser } from "./logout.js";
import { checkToken } from "./post/currentPost.js";
import { getAllPosts } from "./post/post.js";
import {
  communityCheck,
  currentCommunityCheck,
  getProfile,
  postCheck,
  postCreateCheck,
} from "./requestConsts.js";

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
      handleResponse(status, check);
    })
    .catch((error) => {
      handleResponse(status, check);
      console.error("Error:", error);
    });
}

export function route() {
  let content = document.getElementById("content");
  let currentUrl = window.location.pathname;
  debugger; //Разобраться с обновлением при фильтрах в коммьюнити
  if (currentUrl.slice(0, 10) == communityCheck) {
    getAllPosts(currentUrl + window.location.search);
  } else if (window.location.search !== "") {
    getAllPosts(window.location.search);
  } else if (currentUrl == homePage) {
    getAllPosts(null);
  }

  let url;

  if (currentUrl != postCreateCheck && currentUrl.slice(0, 6) == postCheck) {
    url = getUrl(concretePostPage) + ".html";
    checkToken(currentUrl);
  } else if (
    currentUrl != communityCheck &&
    currentUrl.slice(0, 13) == currentCommunityCheck
  ) {
    url = getUrl(concreteCommunityPage) + ".html";
  } else {
    url = getUrl(currentUrl) + ".html";
  }

  includeHTML(content, url);
}

function getUrl(url) {
  if (token !== undefined) {
    if (check === true && (url === registrationPage || url === loginPage)) {
      url = homePage;
      history.pushState({}, "", homePage);
    }
  }

  switch (url) {
    case loginPage:
      url = loginHTML;
      return url;
    case registrationPage:
      url = registrationHTML;
      return url;
    case homePage:
      url = homeHTML;
      return url;
    case logoutPage:
      url = homeHTML;
      logoutUser();
      return url;
    case profilePage:
      url = profileHTML;
      return url;
    case postCreatePage:
      url = postCreateHTML;
      return url;
    case concretePostPage:
      url = concretePostHTML;
      return url;
    case authorsPage:
      url = authorsHTML;
      return url;
    case communitiesPage:
      url = communitiesHTML;
      return url;
    case concreteCommunityPage:
      url = concreteCommunityHtml;
      return url;
    default:
      url = notFoundPage;
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
        debugger;
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

export function handleResponse(status, check) {
  if (status === 200) {
    check = true;
  } else if (status === 401) {
    check = false;
  }
}

route();
