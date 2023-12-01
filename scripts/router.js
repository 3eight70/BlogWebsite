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
  getInfoCommunity,
  getProfile,
  postCheck,
  postCreateCheck,
} from "./requestConsts.js";
import { getRequest } from "./templateRequests.js";

let status;
let check = false;
let includeFlag = false;
const token = localStorage.getItem("JwtToken");
let content = document.getElementById("content");
const htmlString = ".html";

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
    });
}

export function route() {
  let currentUrl = window.location.pathname;
  const currentSearch = window.location.search;
  const idMatch = currentUrl.match(/\/communities\/([0-9a-f-]+)/);

  if (currentUrl.slice(0, 10) == communityCheck) {
    getAllPosts(currentUrl + currentSearch);
    history.pushState(
      {},
      "",
      `${currentCommunityCheck}${currentUrl.slice(11, currentUrl.length)}`
    );
  } else if (currentSearch !== "") {
    if (idMatch) {
      let guid = idMatch[0];
      guid = guid.replace(currentCommunityCheck, `${communityCheck}/`);

      if (!guid.includes("post")) {
        guid += "/post";
      }
      getAllPosts(`${guid}${currentSearch}`);
    } else {
      getAllPosts(currentSearch);
    }
  } else if (currentUrl == homePage) {
    getAllPosts(null);
  }

  let url;

  if (currentUrl != postCreateCheck && currentUrl.slice(0, 6) == postCheck) {
    if (status == 200) {
      url = getUrl(concretePostPage) + htmlString;
      checkToken(currentUrl);
    } else {
      url = getUrl(homePage) + htmlString;
      getAllPosts(null);
      history.pushState({}, "", "/");
    }
  } else if (currentUrl.slice(0, 13) == currentCommunityCheck) {
    getRequest(getInfoCommunity(idMatch[1]), redirectToNoFound, token);
    includeFlag = true;
  } else if (
    currentUrl != communityCheck &&
    currentUrl.slice(0, 13) == currentCommunityCheck
  ) {
    url = getUrl(concreteCommunityPage) + htmlString;
  } else {
    url = getUrl(currentUrl) + htmlString;
  }
  if (!includeFlag) {
    includeHTML(content, url);
  }
}

function getUrl(url) {
  if (token !== undefined) {
    if (check === true && (url === registrationPage || url === loginPage)) {
      url = homePage;
      history.pushState({}, "", homePage);
    } else if (status === 401 && url === postCreateCheck) {
      url = homePage;
      getAllPosts(null);
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
        element.innerHTML = "Page not found.";
      }
    }
  };
  xhttp.open("GET", "/../pages/" + url, true);
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

function redirectToNoFound(data) {
  includeFlag = false;

  if (data == null) {
    includeHTML(content, "notFoundPage.html");
  } else {
    includeHTML(content, "concreteCommunity.html");
  }
}

route();
