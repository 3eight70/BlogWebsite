document
  .getElementById("editForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const author = document.getElementById("findAuthor").value;
    const tags = document.getElementById("tagSearch").value;
    const sort = document.getElementById("sortSelect").value;
    const timeFrom = document.getElementById("timeFrom").value;
    const timeTo = document.getElementById("timeTo").value;
    const onlyGroupCheck = document.getElementById("onlyUserGroupsCheck").value;
  });
