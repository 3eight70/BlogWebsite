import { unlockButtons } from "./auxiliaryFunctions.js";
import {
  communityLink,
  getCommunities,
  getInfoCommunity,
  getTheGreatestUserRole,
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
