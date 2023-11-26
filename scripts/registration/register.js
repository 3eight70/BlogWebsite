import { register } from "../requestConsts.js";
import {
  activateValidationOnPhoneAndBirthDate,
  validateEmail,
} from "./registerValidation.js";

activateValidationOnPhoneAndBirthDate();
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

    let registerForm = {
      fullName: name,
      ...(birthDate !== "" && { birthDate }),
      gender: gender,
      ...(phoneNumber !== "" && { phoneNumber }),
      email: email,
      password: password,
    };

    fetch(register, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerForm),
    })
      .then((response) => {
        if (!response.ok) {
          validateEmail(response.status);
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
