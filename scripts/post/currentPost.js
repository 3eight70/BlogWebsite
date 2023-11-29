import { offElement, onElement } from "../main.js";
import {
  site,
  postCardHtml,
  getProfile,
  getAddressChain,
  getAllNestedComments,
  addCommentToConcretePost,
  delComment,
  editComment,
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
const userId = localStorage.getItem("userId");
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
  const postText = document.getElementById("postText");
  const createCommentButton = document.getElementById("createComment");

  createCommentButton.addEventListener("click", async function (event) {
    event.preventDefault();

    const requestBody = {
      content: postText.value,
    };
    postText.value = "";

    await addComment(addCommentToConcretePost(post.id), requestBody, token);
  });

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

  addComments(post);
}

function addComments(post) {
  const commentPlace = document.querySelector("#commentPlace");
  const commentTemplate = template.querySelector("#comment");
  commentPlace.innerHTML = "";

  post.comments.forEach((comment) => {
    const curComment = commentTemplate.cloneNode(true);
    const subCommentsPlace = curComment.querySelector("#subCommentsPlace");
    const readMoreButton = curComment.querySelector("#readMore");
    createComment(curComment, comment);

    activateButtonsForUsersComment(curComment, comment);

    curComment.setAttribute("data-id", post.id);

    if (comment.subComments != 0) {
      readMoreButton.addEventListener("click", function (event) {
        event.preventDefault();

        if (subCommentsPlace.classList.contains("d-none")) {
          readMoreButton.innerText = "Скрыть ответы";
          onElement(subCommentsPlace);
          getRequest(
            getAllNestedComments(comment.id),
            createNestedComments,
            token,
            curComment
          );
        } else {
          readMoreButton.innerText = "Раскрыть ответы";
          offElement(subCommentsPlace);
        }
      });
    } else {
      readMoreButton.classList.add("d-none");
    }
    commentPlace.appendChild(curComment);
  });

  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );
  const tooltipList = [...tooltipTriggerList].map(
    (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
  );
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

function createNestedComments(data, curComment) {
  const commentTemplate = template.querySelector("#comment");
  const subCommentsPlace = curComment.querySelector("#subCommentsPlace");
  subCommentsPlace.innerHTML = "";

  if (data) {
    data.forEach((comment) => {
      const curNestedComment = commentTemplate.cloneNode(true);
      const readMoreButton = curNestedComment.querySelector("#readMore");
      readMoreButton.classList.add("d-none");
      activateButtonsForUsersComment(curNestedComment, comment);

      curNestedComment.setAttribute("data-id", curComment.dataset.id);

      createComment(curNestedComment, comment);

      subCommentsPlace.appendChild(curNestedComment);
    });
  }
}

function createComment(curComment, comment) {
  const deletedComment = "[Комментарий удален]";
  const curCommentsAuthor = curComment.querySelector("#authorsName");
  const curText = curComment.querySelector("#textField");
  const curCommentDate = curComment.querySelector("#dateTime");
  const curAnswerButton = curComment.querySelector("#answer");
  const curAnswerForm = curComment.querySelector("#answerForm");
  const curAnswerInput = curAnswerForm.querySelector("#answerInput");
  const curSendAnswerButton = curAnswerForm.querySelector("#sendAnswer");
  const changedCommentTemplate = template.querySelector("#changedComment");

  curSendAnswerButton.setAttribute("data-id", comment.id);

  curCommentsAuthor.innerText = comment.author;
  curText.innerText = comment.content;
  if (comment.deleteDate != null) {
    curCommentsAuthor.innerText = deletedComment;
    curText.innerText = deletedComment;
    curCommentDate.innerText = formatDate(comment.deleteDate);
  } else if (comment.modifiedDate != null) {
    const changedComment = changedCommentTemplate.cloneNode(true);
    changedComment.setAttribute(
      "data-bs-title",
      formatDate(comment.modifiedDate)
    );
    curText.insertAdjacentElement("afterend", changedComment);
    curCommentDate.innerText = formatDate(comment.createTime);
  } else {
    curCommentDate.innerText = formatDate(comment.createTime);
  }

  curAnswerButton.addEventListener("click", function (event) {
    event.preventDefault();

    if (curAnswerForm.classList.contains("d-none")) {
      onElement(curAnswerForm);
    } else {
      offElement(curAnswerForm);
    }
  });

  curSendAnswerButton.addEventListener("click", async function (event) {
    event.preventDefault();

    const content = curAnswerInput.value;
    const parentId = curSendAnswerButton.dataset.id;

    const requestBody = {
      content: content,
      ...(parentId !== "" && { parentId }),
    };

    await addComment(
      addCommentToConcretePost(curComment.dataset.id),
      requestBody,
      token
    );

    curAnswerInput.value = "";
    offElement(curAnswerForm);
    getRequest(
      getAllNestedComments(comment.id),
      createNestedComments,
      token,
      curComment
    );
  });

  checkScroll();
}

async function addComment(url, body, token) {
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(body),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.status;
    })
    .then((data) => {
      console.log("Success:", data);
      getRequest(site + window.location.pathname, addComments, token);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function deleteComment(commentId) {
  fetch(delComment(commentId), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(commentId),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.status;
    })
    .then((data) => {
      console.log("Success:", data);
      getRequest(site + window.location.pathname, addComments, token);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function editCommentF(commentId, content) {
  fetch(editComment(commentId), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(content),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.status;
    })
    .then((data) => {
      console.log("Success:", data);
      getRequest(site + window.location.pathname, addComments, token);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function activateButtonsForUsersComment(curComment, comment) {
  const editButton = curComment.querySelector("#editComment");
  const editForm = curComment.querySelector("#editTextForm");
  const editInput = editForm.querySelector("#editTextInput");
  const content = curComment.querySelector("#textField");
  const changedComment = curComment.querySelector("#changedComment");
  const editTextButton = curComment.querySelector("#editTextButton");
  const deleteButton = curComment.querySelector("#deleteComment");

  if (comment.authorId == userId && !comment.deleteDate) {
    onElement(editButton);
    onElement(deleteButton);

    editButton.addEventListener("click", function (event) {
      event.preventDefault();

      if (editForm.classList.contains("d-none")) {
        editInput.value = content.innerText;
        content.innerText = "";

        if (changedComment) {
          offElement(changedComment);
        }

        onElement(editForm);
      } else {
        content.innerText = editInput.value;
        editInput.value = "";
        offElement(editForm);

        if (changedComment) {
          onElement(changedComment);
        }
      }
    });

    deleteButton.addEventListener("click", function (event) {
      event.preventDefault();

      deleteComment(comment.id);
    });

    editTextButton.addEventListener("click", function (event) {
      event.preventDefault();

      editCommentF(comment.id, { content: editInput.value });
    });
  }
}

function checkScroll() {
  const scrollCheck = localStorage.getItem("scrollCheck");
  const sectionToScroll = document.querySelector("#commentPlace");

  if (scrollCheck) {
    sectionToScroll.scrollIntoView({ behavior: `smooth` });
    localStorage.removeItem("checkScroll");
  }
}
