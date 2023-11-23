import {
  addLike,
  delLike,
  getPosts,
  postCardHtml,
  templates,
} from "../requestConsts.js";

let token = localStorage.getItem("JwtToken");
let template = document.createElement("div");
const postPlace = document.getElementById("postPlace");
const pagination = document.getElementById("pagination");
let generate = false;

if (!generate) {
  getAllPosts(null);
  generate = true;
}

fetch(templates, {
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
    handleResponse(data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

export function getAllPosts(query) {
  let url;
  if (query === null) {
    url = getPosts;
  } else {
    url = getPosts + query;
    history.pushState({}, "", query);
  }

  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Success:", data);
      createPosts(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  function createPosts(post) {
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
}

function formatDate(date) {
  const dateTime = new Date(date);

  const day = dateTime.getDate().toString().padStart(2, "0");
  const month = (dateTime.getMonth() + 1).toString().padStart(2, "0");
  const year = dateTime.getFullYear();
  const hours = dateTime.getHours().toString().padStart(2, "0");
  const minutes = dateTime.getMinutes().toString().padStart(2, "0");

  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

async function createPost(card, data) {
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

    if (communityName === null) {
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
    curCard.querySelector("#image").src = post.image;

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

    let like = curCard.querySelector("#amountOfLikes");
    let likesAmount = curCard.querySelector("#likeCount");

    likesAmount.innerText = post.likes;
    like.setAttribute("data-id", post.id);
    like.setAttribute("data-like", hasLike);

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

  for (let i = 1; i <= pagSize; i++) {
    let newPagItem = pagItem.cloneNode(true);
    if (i === data.pagination.current) {
      newPagItem.classList.add("active");
    }
    newPagItem.querySelector("a").textContent = i;
    pagination.appendChild(newPagItem);
  }

  pagination.appendChild(rightBracket.cloneNode(true));

  if (pagSize <= 1) {
    const pageLinks = pagination.querySelectorAll("li.page-item");
    pageLinks[0].classList.add("disabled");
    pageLinks[2].classList.add("disabled");
  }
}

function handleResponse(data) {
  template.innerHTML = data;
}

function deleteLike(postId) {
  fetch(delLike(postId), {
    method: "DELETE",
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
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function insertLike(postId) {
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
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      if (error === 400) {
        delLike(postId);
      } else {
        console.error("Error:", error);
      }
    });
}

function fillLike(curCard) {
  let heartIcon = curCard.querySelector("#heartIcon");

  heartIcon.classList.remove("bi-heart");
  heartIcon.classList.add("bi-heart-fill", "text-danger");
}

function removeLike(curCard) {
  let heartIcon = curCard.querySelector("#heartIcon");

  heartIcon.classList.add("bi-heart");
  heartIcon.classList.remove("bi-heart-fill", "text-danger");
}
