import { getTagList } from "../requestConsts.js";

const tagSearch = document.getElementById("tagSearch");

fetch(getTagList, {
  method: "GET",
  headers: {
    "Content-type": "application/json",
  },
})
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    handleResponse(data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

function handleResponse(data) {
  data.forEach((tag) => {
    var option = document.createElement("option");
    option.dataset.id = tag.id;
    option.text = tag.name;
    tagSearch.add(option);
  });
}
