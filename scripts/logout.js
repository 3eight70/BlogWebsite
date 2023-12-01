import { logout } from "./requestConsts.js";

export function logoutUser() {
  const token = localStorage.getItem("JwtToken");

  fetch(logout, {
    method: "POST",
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
      localStorage.setItem("JwtToken", "");
      window.location.pathname = "/";
    });
}
