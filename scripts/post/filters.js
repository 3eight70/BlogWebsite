import { currentCommunityCheck } from "../requestConsts.js";
import { getAllPosts } from "./post.js";

let submitFlag = false;

const url = new URLSearchParams(window.location.search);
const authorKey = url.get("author");

if (authorKey != null) {
  const authorInput = document.getElementById("findAuthor");

  authorInput.value = authorKey;
}

document
  .getElementById("applyFilters")
  .addEventListener("click", function (event) {
    event.preventDefault();

    submitFlag = true;

    searchFilters();
  });

export function searchFilters() {
  const currentPathname = window.location.pathname;
  const newPathname = `/community/${currentPathname.slice(
    13,
    currentPathname.length
  )}`;
  const pathname = currentPathname.slice(0, 13);
  history.pushState({}, "", "/");

  let page = document.querySelector(".page-item.active").innerText;
  let author = "",
    min = "",
    max = "",
    onlyMyCommunities = false;
  const findAuthor = document.getElementById("findAuthor");
  const selectedTags = document.getElementById("tagSearch");
  const selectedSorting = document.getElementById("sortSelect");
  const minTime = document.getElementById("timeFrom");
  const maxTime = document.getElementById("timeTo");
  const onlyMyCommunitiesCheck = document.getElementById("onlyUserGroupsCheck");

  if (findAuthor) {
    author = findAuthor.value;
  }

  if (minTime) {
    min = minTime.value;
  }

  if (maxTime) {
    max = maxTime.value;
  }

  if (onlyMyCommunitiesCheck) {
    onlyMyCommunities.checked;
  }

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

  let query;

  if (pathname == currentCommunityCheck) {
    query = `${newPathname}/post?${tags}${filters.toString()}`;
  } else {
    query = "/?" + tags + filters.toString();
  }

  getAllPosts(query);
}
