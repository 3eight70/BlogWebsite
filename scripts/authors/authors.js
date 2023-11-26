import {
  authorCardHtml,
  getAuthorsList,
  manImg,
  womanImg,
} from "../requestConsts.js";
import { getRequest, getTemplates } from "../templateRequests.js";

let template = document.createElement("div");

getTemplates(template, getAllAuthors);

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
  const yellowCrown = template.querySelector("#yellowCrown");
  const blackCrown = template.querySelector("#blackCrown");
  const grayCrown = template.querySelector("#grayCrown");

  const authorsPlace = document.getElementById("authorsPlace");

  const authors = data;
  const html = document.createElement("div");
  html.innerHTML = card;

  const authorsArray = Array.from(authors);

  authorsArray.sort(compare);

  const champion = authorsArray[0];
  const silver = authorsArray[1];
  const bronze = authorsArray[2];

  authors.forEach((author) => {
    const curAuthor = html.cloneNode(true);

    const authorLink = curAuthor.querySelector("#authorsLink");
    const authorImg = curAuthor.querySelector("#image");
    const authorsName = curAuthor.querySelector("#authorsName");
    const createDate = curAuthor.querySelector("#createDate");
    const birthDate = curAuthor.querySelector("#birthDate");
    const amountOfPosts = curAuthor.querySelector("#amountOfPosts");
    const amountOfLikes = curAuthor.querySelector("#amountOfLikes");
    const crownPlace = curAuthor.querySelector("#crownPlace");

    if (author.gender == "Male") {
      authorImg.src = manImg;
    } else {
      authorImg.src = womanImg;
    }

    const authorName = author.fullName;
    const likes = author.likes;
    const posts = author.posts;

    authorLink.href = `http://localhost/?page=1&author=${authorName}&size=5`;
    authorsName.innerText = authorName;
    createDate.innerText = `Создан: ${formatDateWithoutTime(author.created)}`;
    birthDate.innerText = formatDateWithoutTime(author.birthDate);
    amountOfLikes.innerText = `Лайков: ${likes}`;
    amountOfPosts.innerText = `Постов: ${posts}`;

    if (posts == champion.posts && likes == champion.likes) {
      crownPlace.appendChild(yellowCrown);
    } else if (posts == silver.posts && likes == silver.likes) {
      crownPlace.appendChild(grayCrown);
    } else if (posts == bronze.posts && likes == bronze.likes) {
      crownPlace.appendChild(blackCrown);
    }

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

function compare(author1, author2) {
  if (author1.posts > author2.posts) {
    return -1;
  } else if (author1.posts < author2.posts) {
    return 1;
  } else {
    if (author1.likes > author2.likes) {
      return -1;
    } else if (author1.likes < author2.likes) {
      return 1;
    } else {
      return 0;
    }
  }
}
