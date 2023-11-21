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
      });
  });
