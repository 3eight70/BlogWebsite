import { createPostInCommunity, createPost } from "../requestConsts.js";
import { postRequest } from "../templateRequests.js";

const token = localStorage.getItem("JwtToken");

document
  .getElementById("addPostForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const groupSelect = document.getElementById("groupSelect");
    const selectedGroup = groupSelect.options[groupSelect.selectedIndex];
    const groupId = selectedGroup.dataset.id;

    const tagSearch = document.getElementById("tagSearch");
    const selectedTagOptions = Array.from(tagSearch.selectedOptions);
    const tags = selectedTagOptions.map((option) => option.dataset.id);

    const title = document.getElementById("postTitle").value;
    const readingTime = document.getElementById("timeFrom").value;
    const image = document.getElementById("imageLink").value;
    const description = document.getElementById("postText").value;

    const address = document.getElementById("addressPlace");
    let lastAddressIndex = address.children.length - 1;
    let lastAddressSelectPlace = address.querySelector(
      "#address" + lastAddressIndex
    );
    let lastAddressSelect = lastAddressSelectPlace.querySelector(
      "#addressSelect" + lastAddressIndex
    );
    const lastAddressLabel = lastAddressSelectPlace.querySelector("label");
    if (lastAddressLabel.innerText == "Следующий элемент адреса") {
      lastAddressIndex -= 1;

      lastAddressSelectPlace = address.querySelector(
        "#address" + lastAddressIndex
      );
      lastAddressSelect = lastAddressSelectPlace.querySelector(
        "#addressSelect" + lastAddressIndex
      );
    }
    const selectedAddressOption =
      lastAddressSelect.options[lastAddressSelect.selectedIndex];
    const addressId = selectedAddressOption.dataset.guid;

    const postParams = {
      title: title,
      description: description,
      readingTime: readingTime,
      ...(image !== "" && { image }),
      tags: tags,
      ...(addressId !== "" && { addressId }),
    };

    if (groupId) {
      let url = createPostInCommunity(groupId);
      postRequest(url, postParams, token, failedPost, successPost);
    } else {
      postRequest(createPost, postParams, token, failedPost, successPost);
    }
  });

function successPost() {
  window.location.href = "http://localhost/";
}

function failedPost(response) {
  debugger;
  const invalidImage = document.querySelector("#invalidImage");
  const invalidImageInput = document.querySelector("#imageLink");
  if (response == 400) {
    invalidImage.classList.remove("d-none");
    invalidImage.classList.add("d-block");
    invalidImageInput.classList.add("border-danger");
  } else {
    invalidImage.classList.remove("d-block");
    invalidImage.classList.add("d-none");
  }
}
