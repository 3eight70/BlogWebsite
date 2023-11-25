import { searchFilters } from "./filters.js";

const pagination = document.getElementById("pagination");
const pageSelect = document.getElementById("pageSelect");

pagination.addEventListener("click", function (event) {
  event.preventDefault();

  const pageLinks = pagination.querySelectorAll("#paginationItem");

  if (event.target.tagName === "A") {
    let pageValue = event.target.innerText;
    let linksLength = pageLinks.length;

    for (let i = 0; i < linksLength; i++) {
      if (pageLinks[i].classList.contains("active")) {
        pageLinks[i].classList.remove("active");

        if (pageValue === "<") {
          pageLinks[0].classList.add("active");
        } else if (pageValue === ">") {
          pageLinks[linksLength - 1].classList.add("active");
        }
        break;
      }
    }

    if (pageValue !== "<" && pageValue !== ">") {
      event.target.parentNode.classList.add("active");
    }
  }

  searchFilters();
});

pageSelect.addEventListener("change", function (event) {
  event.preventDefault();

  searchFilters();
});
