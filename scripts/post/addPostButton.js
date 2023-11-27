import { postCreateCheck } from "../requestConsts.js";

document.getElementById("addPost").addEventListener("click", function (event) {
  event.preventDefault();

  window.location.href = postCreateCheck;
});
