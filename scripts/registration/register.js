import { register } from "../requestConsts.js";
import sendRequest from "../request.js";

document
  .getElementById("registerForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const birthDate = document.getElementById("birthDate").value;
    const gender = document.getElementById("gender").value;
    const phoneNumber = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    var registerForm = {
      fullName: name,
      ...(birthDate !== "" && { birthDate }),
      gender: gender,
      ...(phoneNumber !== "" && { phoneNumber }),
      email: email,
      password: password,
    };

    sendRequest(register, registerForm, "POST", null);
  });
