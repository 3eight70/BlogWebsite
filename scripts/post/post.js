import { getPosts } from "../requestConsts.js";

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
    handleResponse(data);
    createPosts();
  })
  .catch((error) => {
    console.error("Error:", error);
  });

function handleResponse(data) {
  post = data;
}

function createPosts() {
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
    }

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
                  ${pst.likes}<span class="bi bi-heart mx-1 text-danger"></span>
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
