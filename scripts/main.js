import sendRequest from "./request.js";
import { getProfile } from "./requestConsts.js";

const token = localStorage.getItem("JwtToken");
const loginLink = document.getElementById("loginLink");
const dropDown = document.getElementById("dropdownProfile");

if (token !== null) {
  sendRequest(getProfile, null, "GET", handleResponse);
} else {
  loginLink.addClass = "d-block";
  dropDown.addClass = "d-none";
}

function handleResponse(data, status) {
  console.log("Data:", data);
  console.log("Status:", status);

  if (status === 200) {
    loginLink.classList.add("d-none");
    dropDown.classList.add("d-block");
  } else if (status === 401) {
    loginLink.classList.add("d-block");
    dropDown.classList.add("d-none");
  }
}
