import sendRequest from "../request.js";
import { login } from "../requestConsts.js";

document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    var loginForm = {
      email: email,
      password: password,
    };

    let status = sendRequest(login, loginForm, "POST", null);
  });
