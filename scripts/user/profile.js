import { editProfile } from "../requestConsts.js";

document
  .getElementById("editForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const fullName = document.getElementById("name").value;
    const phoneNumber = document.getElementById("phone").value;
    const gender = document.getElementById("gender").value;
    const birthDate = document.getElementById("birthDate").value;
    const token = localStorage.getItem("JwtToken");

    var editForm = {
      ...(email !== "" && { email }),
      ...(fullName !== "" && { fullName }),
      ...(gender !== "" && { gender }),
      ...(phoneNumber !== "" && { phoneNumber }),
      ...(birthDate !== "" && { birthDate }),
    };

    fetch(editProfile, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(editForm),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.status;
      })
      .then((data) => {
        window.location.pathname = "/";
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
