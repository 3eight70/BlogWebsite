export function validateEmail(response) {
  const invalidEmail = document.querySelector("#invalidEmail");
  const emailInput = document.querySelector("#email");
  if (response == 400) {
    invalidEmail.classList.remove("d-none");
    invalidEmail.classList.add("d-block");
    emailInput.classList.add("border-danger");
  } else {
    invalidEmail.classList.remove("d-block");
    invalidEmail.classList.add("d-none");
  }
}

export function activateValidationOnPhoneAndBirthDate() {
  $("#phone").inputmask("+7 (999) 999-99-99");

  const currentDate = new Date().toISOString().split("T")[0];
  document.getElementById("birthDate").setAttribute("max", currentDate);
}
