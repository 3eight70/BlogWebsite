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

export async function getRequest(url, callback, token, someData) {
  fetch(url, {
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
      console.log("Success:", data);

      if (typeof callback === "function") {
        if (someData) {
          callback(data, someData, token);
        } else {
          callback(data);
        }
      }
    })
    .catch((error) => {
      if (typeof callback === "function") {
        if (someData) {
          callback(null, someData, token);
        } else {
          callback(null);
        }
      }
      console.error("Error:", error);
    });
}

export async function postRequest(
  url,
  body,
  token,
  failedCallback,
  successCallback
) {
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(body),
  })
    .then((response) => {
      if (!response.ok) {
        if (typeof failedCallback === "function") {
          failedCallback(response.status);
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Success:", data);
      if (typeof successCallback === "function") {
        successCallback();
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
