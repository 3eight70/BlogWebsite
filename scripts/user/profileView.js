import { getProfile } from "../requestConsts.js";
import { getRequest } from "../templateRequests.js";

const addPost = document.getElementById("addPostLink");

if (addPost.classList.contains("d-none")) {
  addPost.classList.add("d-block");
  addPost.classList.remove("d-none");
}

const authorsLink = document.getElementById("authors");

if (authorsLink.classList.contains("d-block")) {
  authorsLink.classList.add("d-none");
  authorsLink.classList.remove("d-block");
}

const email = document.getElementById("email");
const name = document.getElementById("name");
const phone = document.getElementById("phone");
const gender = document.getElementById("gender");
const birthDate = document.getElementById("birthDate");
const token = localStorage.getItem("JwtToken");

getRequest(getProfile, changeValues, token);

function changeValues(data) {
  email.value = data.email;
  name.value = data.fullName;
  phone.value = data.phoneNumber;
  gender.value = data.gender;

  const date = new Date(data.birthDate);
  const formatDate = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  birthDate.value = formatDate;
}
