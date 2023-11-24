import { templates } from "./requestConsts.js";

export async function getTemplates(template, callback) {
  fetch(templates, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text();
    })
    .then((data) => {
      template.innerHTML = data;

      if (typeof callback === "function") {
        callback();
      }
    });
}

export async function getRequest(url, callback) {
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Success:", data);

      if (typeof callback === "function") {
        callback(data);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
