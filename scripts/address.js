import { searchAddress } from "./requestConsts.js";
import { getRequest, getTemplates } from "./templateRequests.js";

let template = document.createElement("div");
let firstSelect = false;
let index = 0;

await getTemplates(template, createNewSelect);

function getAddress(query) {
  let url;

  if (query === null || query == "undefined") {
    url = searchAddress;
  } else {
    url = searchAddress + "?parentObjectId=" + query;
  }

  getRequest(url, fillSelect);
}

function fillSelect(data) {
  const selectPlace = document.querySelector("#address" + index);
  const selectOptionTemplate = template.querySelector("#addressOption");

  data.forEach((address) => {
    let newOption = selectOptionTemplate.cloneNode(true);

    newOption.textContent = address.text;
    newOption.setAttribute("data-id", address.objectId);
    newOption.setAttribute("data-guid", address.guid);
    newOption.setAttribute("data-object", address.objectLevel);
    newOption.setAttribute("data-name", address.objectLevelText);
    selectPlace.appendChild(newOption);
  });
  index += 1;
}

function createNewSelect() {
  const addressPlace = document.getElementById("addressPlace");
  const selectTemplate = template.querySelector("#address");
  const selectCopy = selectTemplate.cloneNode(true);

  if (firstSelect === false) {
    selectCopy.querySelector("label").textContent = "Субъект РФ";
    getAddress("");
    firstSelect = true;
  }

  const addId = "address" + index;

  selectCopy.querySelector("select").id = addId;

  addressPlace.appendChild(selectCopy);

  addressPlace
    .querySelector("#address" + index)
    .addEventListener("change", function (event) {
      event.preventDefault();
      debugger;
      const selectedValue = this.options[this.selectedIndex];

      if (selectedValue !== "NotChosen") {
        const addressDiv = this.parentElement;
        const labelElement = addressDiv.querySelector("label");
        labelElement.textContent = selectedValue.dataset.name;
      }

      if (selectedValue.dataset.object != "Building") {
        createNewSelect();
        getAddress(selectedValue.dataset.id);
      }
    });
}
