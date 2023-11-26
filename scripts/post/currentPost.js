import {
  site,
  postCardHtml,
  getProfile,
  getAddressChain,
} from "../requestConsts.js";
import { getRequest, getTemplates } from "../templateRequests.js";
import {
  formatDate,
  fillLike,
  deleteLike,
  insertLike,
  removeLike,
} from "./post.js";

const token = localStorage.getItem("JwtToken");
let addressText;
let template = document.createElement("div");
let status;

function getPost(url) {
  getTemplates(template);
  getRequest(site + url, getPostCardHtml, token);
}

function getPostCardHtml(post) {
  fetch(postCardHtml, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text();
    })
    .then((data) => {
      createPost(data, post);
    });
}

function createPost(card, post) {
  const postPlace = document.getElementById("postPlace");

  let html = document.createElement("div");
  let templateTag = template.querySelector("#tag");
  let tags = "";

  html.innerHTML = card;

  post.tags.forEach((tag) => {
    let curTag = templateTag.cloneNode(true);
    curTag.textContent += `${"  "}#${tag.name}`;
    tags += curTag.outerHTML;
  });

  let curCard = html.cloneNode(true);
  let date = formatDate(post.createTime);
  let communityInfo;
  let communityName = post.communityName;
  let description = post.description;
  let check = false;
  let hasLike = post.hasLike;

  if (communityName === null) {
    communityInfo = `${post.author} - ${date}`;
  } else {
    communityInfo = ` ${post.author} - ${date} в сообществе "${post.communityName}"`;
  }

  curCard.querySelector("#authorAndCommunity").textContent += communityInfo;
  curCard.querySelector("#postName").textContent += post.title;
  curCard.querySelector("#description").textContent += description;

  if (post.image != null) {
    curCard.querySelector("#image").src = post.image;
  }

  if (check === true) {
    let curDesc = curCard.querySelector("#description");
    curDesc.innerHTML += template.querySelector("#readMore").outerHTML;
    const readMoreButton = curCard.querySelector("#readMore");

    readMoreButton.addEventListener("click", function () {
      curDesc.textContent = post.description;
    });
  }

  curCard.querySelector("#tagPlace").innerHTML = tags;
  curCard.querySelector("#time").textContent += `${post.readingTime} мин.`;
  curCard.querySelector("#amountOfComments").innerHTML += post.commentsCount;

  const address = curCard.querySelector("#postAddressPlace");
  const addressId = post.addressId;

  if (addressId != null) {
    getAddressChainF(addressId);

    if (address.classList.contains("d-none")) {
      address.classList.add("d-block");
      address.classList.remove("d-none");
    }

    addressText = address.querySelector("#addressText");
  }

  let like = curCard.querySelector("#amountOfLikes");
  let likesAmount = curCard.querySelector("#likeCount");

  likesAmount.innerText = post.likes;
  like.setAttribute("data-id", post.id);
  like.setAttribute("data-like", hasLike);

  if (token !== undefined) {
    if (status == 200) {
      like.addEventListener("click", function () {
        if (like.dataset.like == "true") {
          deleteLike(post.id);
          removeLike(curCard);

          likesAmount.innerText = parseInt(likesAmount.innerText) - 1;
          like.setAttribute("data-like", false);
        } else {
          insertLike(post.id);
          like.setAttribute("data-like", true);
          fillLike(curCard);
          likesAmount.innerText = parseInt(likesAmount.innerText) + 1;
        }
      });
    }
  }

  if (hasLike === true) {
    fillLike(curCard);
  }

  postPlace.appendChild(curCard);
}

export function checkToken(url) {
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
      getPost(url);
    });
}

function getAddressChainF(id) {
  getRequest(getAddressChain + `?objectGuid=${id}`, handleData, token);
}

function handleData(data) {
  for (let i = 0; i < data.length; i++) {
    addressText.innerText += data[i].text;
    if (i != data.length - 1) {
      addressText.innerText += ", ";
    }
  }
}
