import { getProfile } from "../requestConsts.js";

const email = document.getElementById("email");
const name = document.getElementById("name");
const phone = document.getElementById("phone");
const gender = document.getElementById("gender");
const birthDate = document.getElementById("birthDate");
const token = localStorage.getItem("JwtToken");

fetch(getProfile, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  },
})
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    changeValues(data);
    console.log("Success:", data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

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
