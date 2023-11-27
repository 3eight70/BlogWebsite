import { getRequest, getTemplates } from "../templateRequests.js";
import {
  getCommunitiesPosts,
  getInfoCommunity,
  getTheGreatestUserRole,
  manImg,
  womanImg,
} from "../requestConsts.js";
import { createPosts } from "../post/post.js";
import { unlockButtons } from "./auxiliaryFunctions.js";

const pathname = window.location.pathname;
const token = localStorage.getItem("JwtToken");
const communityId = pathname.slice(13, pathname.length);
const administratorPlace = document.querySelector("#administratorPlace");
let template = document.createElement("div");

getTemplates(template);

getRequest(getInfoCommunity(communityId), createCommunityInfo, token);
getRequest(getCommunitiesPosts(communityId), createPosts, token);

function createCommunityInfo(data) {
  const communityPlace = document.getElementById("communityForm");
  const communityName = communityPlace.querySelector("#communityName");
  const communityType = communityPlace.querySelector("#communityType");
  const amountOfSubscribers = communityPlace.querySelector(
    "#amountOfSubscribers"
  );

  communityPlace.setAttribute("data-id", communityId);

  if (communityType.isClosed) {
    communityType.innerText = "Тип сообщества: закрытое";
  } else {
    communityType.innerText = "Тип сообщества: открытое";
  }

  communityName.innerText = `Группа "${data.name}"`;
  amountOfSubscribers.innerText = `${data.subscribersCount} ${getWordEnding(
    data.subscribersCount
  )}`;

  getRequest(
    getTheGreatestUserRole(communityId),
    unlockButtons,
    token,
    communityPlace
  );

  data.administrators.forEach((admin) => {
    addAdministrator(admin);
  });
}

function getWordEnding(number) {
  const wordForms = ["подписчик", "подписчика", "подписчиков"];

  if (number >= 11 && number <= 19) {
    return wordForms[2];
  }

  const lastDigit = number % 10;

  if (lastDigit === 1) {
    return wordForms[0];
  } else if (lastDigit >= 2 && lastDigit <= 4) {
    return wordForms[1];
  } else {
    return wordForms[2];
  }
}

function addAdministrator(admin) {
  const adminTemplate = template.querySelector("#admin");
  const adminCopy = adminTemplate.cloneNode(true);
  const adminsName = adminCopy.querySelector("#adminsName");
  const adminsImage = adminCopy.querySelector("#image");

  adminsName.innerText = admin.fullName;

  if (admin.gender == "Male") {
    adminsImage.src = manImg;
  } else {
    adminsImage.src = womanImg;
  }

  administratorPlace.appendChild(adminCopy);
}
