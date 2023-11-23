import { getPosts, postCardHtml } from "../requestConsts.js";

const postPlace = document.getElementById("postPlace");

let post;
let token = localStorage.getItem("JwtToken");

fetch(getPosts, {
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
    handleResponse(post, data);
    createPosts();
  })
  .catch((error) => {
    console.error("Error:", error);
  });

function handleResponse(object, data) {
  object = data;
}

function createPosts() {
  fetch(postCardHtml, {
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
      return response.text();
    })
    .then((data) => {
      createPost(data, post);
      console.log("Success:", data);
    });

  post.posts.forEach((pst) => {
    let tags = "";
    pst.tags.forEach((tag) => {
      tags += `<div class="col-auto">#${tag.name}</div>`;
    });

    let communityInfo;
    let description = pst.description;
    let date = formatDate(pst.createTime);
    let communityName = pst.communityName;

    if (communityName === null) {
      communityInfo = `${pst.author} - ${date}`;
    } else {
      communityInfo = ` ${pst.author} - ${date} в сообществе "${pst.communityName}"`;
    }

    if (description.length > 1000) {
      description = description.substring(0, 1000) + "...";
      description += `<a href="" class="read-more-link row mx-2 d-inline-block">Читать полностью</a>`;
    } //через fetch подцеплять html и find искать и заменять
    //data attribute на кнопку лайка и туда айдишник

    const html = `
            <div class="card shadowrounded-3 w-100 mb-3" id="${pst.id}">       
              <div class="mx-3 my-2" id="items">
                <div class="text-secondary mb-2" id="authorAndCommunity">
                  ${communityInfo}
                </div>
                <h3 id="postName">${pst.title}</h3>
                <div class="border-bottom border-3 p-2"></div>
                <div class="text my-3" id="description">${description}</div>
                <div class="text-secondary row" id="tagPlace">
                  ${tags}
                </div>
                <div class="text my-1" id="time">Время чтения ${pst.readingTime} мин</div>
              </div>
              <div class="card-footer border-2 d-flex justify-content-between">
                <div class="d-flex" id="amountOfComments">
                  ${pst.commentsCount}<span class="bi bi-chat-left-text mx-1"></span>
                </div>
                <div class="d-flex" id="amountOfLikes">
                  ${pst.likes}<span class="bi bi-heart-fill mx-1 text-danger"></span>
                </div>
              </div>
            </div>
          `;

    postPlace.innerHTML += html;
  });
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

async function createPost(card, posts) {
  let html = document.createElement("div");
  html.innerHTML = card;

  posts.forEach((post) => {
    let curCard = html;
    curCard.querySelector("#authorAndCommunity").textContent = "";
    curCard.querySelector("#postName").textContent = "";
    curCard.querySelector("#description").textContent = "";
    curCard.querySelector("#tagPlace").textContent = "";
    curCard.querySelector("#time").textContent = "";
    curCard.querySelector("#amountOfComments").textContent = "";
    curCard.querySelector("#amountOfLikes").textContent = "";
  });

  postPlace.innerHTML += card;
}
