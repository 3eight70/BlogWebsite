document
  .getElementById("registerForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const birthDate = document.getElementById("birthDate").value;
    const gender = document.getElementById("gender").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    var registerForm = {
      fullName: name,
      birthDate: birthDate,
      gender: gender,
      phoneNumber: phone,
      email: email,
      password: password,
    };

    console.log(registerForm);
  });
