function sendRequest(link, body, meth, callback) {
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
      console.log("Success:", data);
      localStorage.setItem("JwtToken", data.toString());
      callback(data, status);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

export default sendRequest;
