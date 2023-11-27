import { offElement, onElement } from "../main.js";
import {
  communityLink,
  getCommunities,
  getInfoCommunity,
  getTheGreatestUserRole,
  subscribeUser,
  unsubscribeUser,
} from "../requestConsts.js";
import { getRequest, getTemplates } from "../templateRequests.js";

const communityPlace = document.getElementById("communityPlace");
const token = localStorage.getItem("JwtToken");
let template = document.createElement("div");

getTemplates(template, getAllCommunities);

function getAllCommunities() {
  getRequest(getCommunities, getInfoAboutCommunity, token);
}

function getInfoAboutCommunity(data) {
  const communities = data;

  communities.forEach((community) => {
    getRequest(getInfoCommunity(community.id), createCommunity, token);
  });
}

function createCommunity(community) {
  const communityTemplate = template.querySelector("#community");
  const curCommunity = communityTemplate.cloneNode(true);
  const communityId = community.id;

  curCommunity.setAttribute("data-id", communityId);

  const communityName = curCommunity.querySelector("#communityName");
  communityName.innerText = community.name;
  communityName.href = communityLink(communityId);

  communityPlace.appendChild(curCommunity);

  getRequest(
    getTheGreatestUserRole(communityId),
    unlockButtons,
    token,
    curCommunity
  );
}

function unlockButtons(data, curCommunity) {
  const subscribeButton = curCommunity.querySelector("#subscribe");
  const unsubscribeButton = curCommunity.querySelector("#unsubscribe");

  subscribeButton.addEventListener("click", function (event) {
    event.preventDefault();

    subscribe(curCommunity.dataset.id);

    onElement(unsubscribeButton);
    offElement(subscribeButton);
  });

  unsubscribeButton.addEventListener("click", function (event) {
    event.preventDefault();

    unsubscribe(curCommunity.dataset.id);

    offElement(unsubscribeButton);
    onElement(subscribeButton);
  });

  if (data == null) {
    onElement(subscribeButton);
  } else if (data == "Subscriber") {
    onElement(unsubscribeButton);
  }
}

function subscribe(communityId) {
  fetch(subscribeUser(communityId), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(communityId),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.status;
    })
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      if (error === 400) {
        unsubscribe(communityId);
      } else {
        console.error("Error:", error);
      }
    });
}

function unsubscribe(communityId) {
  fetch(unsubscribeUser(communityId), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(communityId),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.status;
    })
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
