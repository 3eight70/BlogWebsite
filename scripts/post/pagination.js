import { searchFilters } from "./filters.js";

const pagination = document.getElementById("pagination");

pagination.addEventListener("click", function (event) {
  event.preventDefault();

  const pageLinks = pagination.querySelectorAll("#paginationItem");

  if (event.target.tagName === "A") {
    let pageValue = event.target.innerText;
    if (pageValue !== "<" && pageValue !== ">") {
      pageLinks.forEach((link) => link.classList.remove("active"));
      event.target.parentNode.classList.add("active");
    }

    searchFilters();
  }
});
