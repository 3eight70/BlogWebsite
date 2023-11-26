import { getAllPosts } from "./post.js";

let submitFlag = false;

const url = new URLSearchParams(window.location.search);
const authorKey = url.get("author");

if (authorKey != null) {
  const authorInput = document.getElementById("findAuthor");

  authorInput.value = authorKey;
}

document
  .getElementById("homeForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    submitFlag = true;

    searchFilters();
  });

export function searchFilters() {
  history.pushState({}, "", "/");

  let page = document.querySelector(".page-item.active").innerText;
  const author = document.getElementById("findAuthor").value;
  const selectedTags = document.getElementById("tagSearch");
  const selectedSorting = document.getElementById("sortSelect");
  const min = document.getElementById("timeFrom").value;
  const max = document.getElementById("timeTo").value;

  const onlyMyCommunities = document.getElementById(
    "onlyUserGroupsCheck"
  ).checked;

  const pageSelect = document.getElementById("pageSelect");

  const selectedPageOption = pageSelect.options[pageSelect.selectedIndex];
  const selectedTagOptions = Array.from(selectedTags.selectedOptions);
  const selectedSortOption =
    selectedSorting.options[selectedSorting.selectedIndex];

  const sorting = selectedSortOption.dataset.name;
  const tagIds = selectedTagOptions.map((option) => option.dataset.id);
  const size = selectedPageOption.value;
  let tags = "";

  if (tagIds.length > 0) {
    tagIds.forEach((tag) => {
      tags += `tags=${tag}&`;
    });

    if (submitFlag == true) {
      submitFlag = false;
      page = 1;
    }
  }

  const filters = new URLSearchParams({
    ...(page !== "" && { page }),
    ...(author !== "" && { author }),
    ...(min !== "" && { min }),
    ...(max !== "" && { max }),
    ...(sorting !== "" && { sorting }),
    ...(onlyMyCommunities !== false && { onlyMyCommunities }),
    ...(size !== "" && { size }),
  });

  let query = "/?" + tags + filters.toString();

  getAllPosts(query);
}
