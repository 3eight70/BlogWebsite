import { login } from "../requestConsts.js";
import { onElement } from "../main.js";

document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const invalidField = document.getElementById("invalidLogin");

    let loginForm = {
      email: email.value,
      password: password.value,
    };

    fetch(login, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginForm),
    })
      .then((response) => {
        status = response.status;

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        localStorage.setItem("JwtToken", data.token);
        window.location.pathname = "/";
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
        email.classList.add("border-danger");
        password.classList.add("border-danger");
        onElement(invalidField);
      });
  });
