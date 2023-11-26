import {
  authorCardHtml,
  getAuthorsList,
  manImg,
  womanImg,
} from "../requestConsts.js";
import { getRequest } from "../templateRequests.js";

getAllAuthors();

export function getAllAuthors() {
  getRequest(getAuthorsList, createAuthors, "");
}

function createAuthors(authors) {
  fetch(authorCardHtml, {
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
      createAuthor(data, authors);
    });
}

function createAuthor(card, data) {
  const authorsPlace = document.getElementById("authorsPlace");

  const authors = data;
  const html = document.createElement("div");
  html.innerHTML = card;

  authors.forEach((author) => {
    const curAuthor = html.cloneNode(true);

    const authorLink = curAuthor.querySelector("#authorsLink");
    const authorImg = curAuthor.querySelector("#image");
    const authorsName = curAuthor.querySelector("#authorsName");
    const createDate = curAuthor.querySelector("#createDate");
    const birthDate = curAuthor.querySelector("#birthDate");
    const amountOfPosts = curAuthor.querySelector("#amountOfPosts");
    const amountOfLikes = curAuthor.querySelector("#amountOfLikes");

    if (author.gender == "Male") {
      authorImg.src = manImg;
    } else {
      authorImg.src = womanImg;
    }

    const authorName = author.fullName;

    authorLink.href = `http://localhost/?page=1&author=${authorName}&size=5`;
    authorsName.innerText = authorName;
    createDate.innerText = `Создан: ${formatDateWithoutTime(author.created)}`;
    birthDate.innerText = formatDateWithoutTime(author.birthDate);
    amountOfLikes.innerText = `Лайков: ${author.likes}`;
    amountOfPosts.innerText = `Постов: ${author.posts}`;

    authorsPlace.appendChild(curAuthor);
  });
}

function formatDateWithoutTime(date) {
  const dateTime = new Date(date);

  const day = dateTime.getDate().toString().padStart(2, "0");
  const month = (dateTime.getMonth() + 1).toString().padStart(2, "0");
  const year = dateTime.getFullYear();
  return `${day}.${month}.${year}`;
}
