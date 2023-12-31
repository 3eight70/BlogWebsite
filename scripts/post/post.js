import { onElement } from "../main.js";
import {
  addLike,
  delLike,
  getPosts,
  postCardHtml,
  getProfile,
  concretePost,
  communityCheck,
  site,
  currentCommunityCheck,
  postCheck,
} from "../requestConsts.js";
import { getTemplates, getRequest } from "../templateRequests.js";

const token = localStorage.getItem("JwtToken");
let template = document.createElement("div");
let status;

checkToken();

getTemplates(template);

export function getAllPosts(query) {
  let url;

  if (query === null) {
    url = getPosts;
  } else if (query.slice(0, 10) == communityCheck) {
    url = site + query;
    query = query.replace(/\/post/, "");
    query = query.replace(/\/community\//, currentCommunityCheck);
    history.pushState({}, "", query);
  } else {
    url = getPosts + query;
    history.pushState({}, "", query);
  }

  getRequest(url, createPosts, token);
}

export function createPosts(post) {
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

export function formatDate(date) {
  const dateTime = new Date(date);

  const day = dateTime.getDate().toString().padStart(2, "0");
  const month = (dateTime.getMonth() + 1).toString().padStart(2, "0");
  const year = dateTime.getFullYear();
  const hours = dateTime.getHours().toString().padStart(2, "0");
  const minutes = dateTime.getMinutes().toString().padStart(2, "0");

  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

async function createPost(card, data) {
  const postPlace = document.getElementById("postPlace");
  const pagination = document.getElementById("pagination");
  const addPostButton = document.querySelector("#addPost");
  let community = localStorage.getItem("communityCh");

  if (data != null) {
    postPlace.innerHTML = "";
    pagination.innerHTML = "";
    let posts = data.posts;
    let html = document.createElement("div");
    let templateTag = template.querySelector("#tag");
    html.innerHTML = card;

    posts.forEach((post) => {
      let tags = "";

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

      if (communityName === null || community) {
        communityInfo = `${post.author} - ${date}`;
      } else {
        communityInfo = ` ${post.author} - ${date} в сообществе "${post.communityName}"`;
      }

      if (description.length > 1000) {
        description = description.substring(0, 1000) + "...";
        description += ``;
        check = true;
      }

      curCard.querySelector("#authorAndCommunity").textContent += communityInfo;
      curCard.querySelector("#postName").textContent += post.title;
      curCard.querySelector("#description").textContent += description;

      curCard.querySelector("#postName").href = concretePost(post.id);

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

      const comments = curCard.querySelector("#amountOfComments");

      curCard.querySelector("#tagPlace").innerHTML = tags;
      curCard.querySelector("#time").textContent += `${post.readingTime} мин.`;
      comments.innerHTML += post.commentsCount;

      let like = curCard.querySelector("#amountOfLikes");
      let likesAmount = curCard.querySelector("#likeCount");

      likesAmount.innerText = post.likes;
      like.setAttribute("data-id", post.id);
      like.setAttribute("data-like", hasLike);

      if (token !== undefined) {
        if (status == 200) {
          if (addPostButton) {
            onElement(addPostButton);
          }

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

      comments.addEventListener("click", function (event) {
        event.preventDefault();

        window.location.pathname = `${postCheck}${post.id}`;
        localStorage.setItem("scrollCheck", 1);
      });

      if (hasLike === true) {
        fillLike(curCard);
      }

      postPlace.appendChild(curCard);
    });

    const rightBracket = template.querySelector("#right");
    const leftBracket = template.querySelector("#left");
    const pagSize = data.pagination.count;

    pagination.appendChild(leftBracket.cloneNode(true));

    const pagItem = template.querySelector("#paginationItem");
    let activeItem;
    const curActivePag = data.pagination.current;

    for (let i = 1; i <= pagSize; i++) {
      let newPagItem = pagItem.cloneNode(true);
      newPagItem.classList.add("d-none");

      if (i === curActivePag) {
        newPagItem.classList.add("active");
        newPagItem.classList.remove("d-none");
        activeItem = i;
      }

      if (i + 1 === curActivePag || i - 1 === curActivePag) {
        newPagItem.classList.remove("d-none");
      }

      newPagItem.querySelector("a").textContent = i;
      pagination.appendChild(newPagItem);
    }

    if (pagSize == 0) {
      let activePagItem = pagItem.cloneNode(true);
      activePagItem.classList.add("active");
      activePagItem.querySelector("a").textContent = 1;
      pagination.appendChild(activePagItem);
    }

    pagination.appendChild(rightBracket.cloneNode(true));

    const pageLinks = pagination.querySelectorAll(
      `li.page-item[data-name="bracket"]`
    );

    if (pagSize <= 1) {
      disablePagination(pageLinks);
    } else if (activeItem === 1) {
      pageLinks[0].classList.add("disabled");
    } else if (activeItem === pagSize) {
      pageLinks[1].classList.add("disabled");
    }
  }
}

export function deleteLike(postId) {
  fetch(delLike(postId), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(postId),
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.status;
  });
}

export function insertLike(postId) {
  fetch(addLike(postId), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(postId),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.status;
    })
    .catch((error) => {
      if (error === 400) {
        deleteLike(postId);
      }
    });
}

export function fillLike(curCard) {
  let heartIcon = curCard.querySelector("#heartIcon");

  heartIcon.classList.remove("bi-heart");
  heartIcon.classList.add("bi-heart-fill", "text-danger");
}

export function removeLike(curCard) {
  let heartIcon = curCard.querySelector("#heartIcon");

  heartIcon.classList.add("bi-heart");
  heartIcon.classList.remove("bi-heart-fill", "text-danger");
}

async function checkToken() {
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
      localStorage.setItem("userId", data.id);
    });
}

function disablePagination(pageLinks) {
  pageLinks[0].classList.add("disabled");
  pageLinks[1].classList.add("disabled");
}
