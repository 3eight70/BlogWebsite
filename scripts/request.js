export function sendPOSTRequest(link, body, meth, callback) {
  let status;
  fetch(link, {
    method: meth,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => {
      status = response.status;

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      localStorage.setItem("JwtToken", data.toString());
      callback(data, status);
    })
    .catch((error) => {});
}

export function sendGETRequest(link, meth, callback, params, token) {
  let status;
  fetch(link + params, {
    method: meth,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  })
    .then((response) => {
      status = response.status;

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      localStorage.setItem("JwtToken", data.toString());
      callback(data, status);
    })
    .catch((error) => {});
}
