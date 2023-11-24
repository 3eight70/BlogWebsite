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
  const selectPlace = document.querySelector("#addressSelect" + index);
  const selectOptionTemplate = template.querySelector("#addressOption");

  const notChosen = selectOptionTemplate.cloneNode(true);
  notChosen.classList.add("selected");
  notChosen.setAttribute("data-parent", index);
  notChosen.setAttribute("data-name", "NotChosen");
  notChosen.textContent = "Не выбран";

  selectPlace.appendChild(notChosen);

  data.forEach((address) => {
    let newOption = selectOptionTemplate.cloneNode(true);

    newOption.textContent = address.text;
    newOption.setAttribute("data-id", address.objectId);
    newOption.setAttribute("data-guid", address.objectGuid);
    newOption.setAttribute("data-object", address.objectLevel);
    newOption.setAttribute("data-name", address.objectLevelText);
    newOption.setAttribute("data-parent", index);
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

  const addSelectId = "addressSelect" + index;
  const addId = "address" + index;

  selectCopy.querySelector("select").id = addSelectId;
  selectCopy.id = addId;

  addressPlace.appendChild(selectCopy);

  addressPlace
    .querySelector("#addressSelect" + index)
    .addEventListener("change", function (event) {
      event.preventDefault();
      const addressParent = this.parentElement;
      let selectedValue = this.options[this.selectedIndex];
      const selectedName = selectedValue.dataset.name;
      const nextElementId = parseInt(selectedValue.dataset.parent) + 1;
      const nextElement = addressPlace.querySelector(
        "#address" + nextElementId
      );

      if (selectedName == "NotChosen" && nextElementId == 1) {
        firstSelect = false;
        while (addressPlace.firstChild) {
          addressPlace.removeChild(addressPlace.firstChild);
        }
        index = 0;
        createNewSelect();
        return;
      }

      if (selectedName !== "NotChosen") {
        const labelElement = addressParent.querySelector("label");
        labelElement.textContent = selectedName;
      } else {
        const selectedId = nextElementId - 2;
        const notChosenSelectPlace = addressPlace.querySelector(
          "#address" + selectedId
        );
        const notChosenSelect =
          notChosenSelectPlace.querySelector(".form-select");
        const chosenOption =
          notChosenSelect.options[notChosenSelect.selectedIndex];
        const chosenParentId = parseInt(chosenOption.dataset.parent);
        debugger;
        for (let i = chosenParentId + 1; i < index; i++) {
          let extraSelect = addressPlace.querySelector("#address" + i);
          addressPlace.removeChild(extraSelect);
        }

        index = chosenParentId + 1;
        createNewSelect();
        getAddress(chosenOption.dataset.id);
        return;
      }

      if (nextElement) {
        for (let i = nextElementId - 1; i < index; i++) {
          let extraSelect = addressPlace.querySelector("#address" + i);
          addressPlace.removeChild(extraSelect);
        }

        index = nextElementId;
      }

      if (selectedValue.dataset.object != "Building") {
        createNewSelect();
        getAddress(selectedValue.dataset.id);
      }
    });
}
