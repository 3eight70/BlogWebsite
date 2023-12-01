import { getTagList } from "../requestConsts.js";
import { getRequest } from "../templateRequests.js";

function getTags() {
  const tagSearch = document.getElementById("tagSearch");

  getRequest(getTagList, handleResponse, null);

  function handleResponse(data) {
    data.forEach((tag) => {
      var option = document.createElement("option");
      option.dataset.id = tag.id;
      option.text = tag.name;
      tagSearch.add(option);
    });
  }
}

getTags();
