import { searchAddress } from "./requestConsts.js";
import { getRequest, getTemplates } from "./templateRequests.js";

let template = document.createElement("div");
let firstSelect = false;
let index = 0;
let inputFlag = false;
let curIndex = 0;

await getTemplates(template, createNewSelect);

async function getAddress(query) {
  let url;

  if (query === null || query == undefined) {
    url = searchAddress;
  } else {
    url = searchAddress + "?parentObjectId=" + query;
  }

  if (inputFlag == true) {
    await getRequest(url, fillInput, "");
  } else {
    await getRequest(url, fillSelect, "");
  }
}

function fillSelect(data) {
  if (data.length == 0) {
    const addressPlace = document.getElementById("addressPlace");
    const addressSelectPlace = document.querySelector("#address" + index);

    if (addressSelectPlace) {
      addressPlace.removeChild(addressSelectPlace);
    }

    return;
  }

  const selectPlace = document.querySelector("#addressSelect" + index);

  Array.from(selectPlace.children).forEach(function (child) {
    selectPlace.removeChild(child);
  });

  selectPlace.appendChild(createNotChosen(index));

  createOptions(selectPlace, data);

  index += 1;
}

async function createNewSelect() {
  const addressPlace = document.getElementById("addressPlace");
  const selectTemplate = template.querySelector("#address");
  const selectCopy = selectTemplate.cloneNode(true);

  if (firstSelect === false) {
    selectCopy.querySelector("label").textContent = "Субъект РФ";
    await getAddress("");
    firstSelect = true;
  }

  const addSelectId = "addressSelect" + index;
  const addId = "address" + index;

  selectCopy.querySelector("select").id = addSelectId;
  selectCopy.id = addId;

  addressPlace.appendChild(selectCopy);
  const curAddressSelect = addressPlace.querySelector("#addressSelect" + index);
  curAddressSelect.setAttribute("data-id", index);

  const $curAddressSelect = $(curAddressSelect);

  $curAddressSelect.select2();

  $curAddressSelect.on("select2:open", function (e) {
    e.preventDefault();

    $(".select2-search__field")
      .off("input")
      .on("input", function (event) {
        event.preventDefault();

        inputFlag = true;
        const upperId = parseInt($curAddressSelect[0].dataset.id) - 1;
        const inputValue = event.target.value;
        curIndex = upperId + 1;
        let newQuery;

        for (let i = curIndex + 1; i < addressPlace.children.length; i++) {
          addressPlace.removeChild(addressPlace.children[i]);
        }
        index = curIndex + 1;

        if (upperId == -1) {
          newQuery = `&query=${inputValue}`;

          getAddress(newQuery);
          return;
        }

        const curSelectPlace = addressPlace.querySelector(
          "#address" + curIndex
        );
        curSelectPlace.querySelector("label").textContent =
          "Следующий элемент адреса";

        const upperAddressPlace = addressPlace.querySelector(
          "#address" + upperId
        );
        const upperSelectPlace = upperAddressPlace.querySelector(
          "#addressSelect" + upperId
        );
        const selectedOption =
          upperSelectPlace.options[upperSelectPlace.selectedIndex];
        newQuery = `${selectedOption.dataset.id}&query=${inputValue}`;
        getAddress(newQuery);
      });
  });

  $curAddressSelect.on("select2:select", function (event) {
    event.preventDefault();

    const addressParent = this.parentElement;
    let selectedName = event.params.data;
    const nextElementId = parseInt(selectedName.element.dataset.parent) + 1;
    const nextElement = addressPlace.querySelector("#address" + nextElementId);

    if (selectedName == "NotChosen" && nextElementId == 1) {
      firstSelect = false;
      while (addressPlace.firstChild) {
        addressPlace.removeChild(addressPlace.firstChild);
      }
      index = 0;
      createNewSelect();
      return;
    }

    if (selectedName.element.dataset.name !== "NotChosen") {
      const labelElement = addressParent.querySelector("label");
      labelElement.textContent = selectedName.element.dataset.name;
    } else {
      const selectedId = nextElementId - 1;
      const notChosenSelectPlace = addressPlace.querySelector(
        "#address" + selectedId
      );
      const notChosenSelect =
        notChosenSelectPlace.querySelector(".form-select");
      const chosenOption =
        notChosenSelect.options[notChosenSelect.selectedIndex];
      const chosenParentId = parseInt(chosenOption.dataset.parent);

      removeExtraSelects(addressPlace, chosenParentId + 1);
      index = chosenParentId;
      getAddress(chosenOption.dataset.id);
      return;
    }

    if (nextElement) {
      removeExtraSelects(addressPlace, nextElementId);
      index = nextElementId;
    }
    if (selectedName.element.dataset.object != "Building") {
      createNewSelect();
      getAddress(selectedName.element.dataset.id);
    }
  });
}

function removeExtraSelects(addressPlace, id) {
  for (let i = id; i < index; i++) {
    let extraSelect = addressPlace.querySelector("#address" + i);
    addressPlace.removeChild(extraSelect);
  }
}

function createOptions(selectPlace, data) {
  data.forEach((address) => {
    let newOption = new Option(address.text);

    newOption.setAttribute("data-id", address.objectId);
    newOption.setAttribute("data-guid", address.objectGuid);
    newOption.setAttribute("data-object", address.objectLevel);
    newOption.setAttribute("data-name", address.objectLevelText);
    newOption.setAttribute("data-parent", index);
    selectPlace.appendChild(newOption);
  });
}

function fillInput(data) {
  const inputPlace = document.querySelector("#addressSelect" + curIndex);

  inputPlace.innerHTML = "";

  inputPlace.appendChild(createNotChosen(curIndex));

  inputFlag = false;

  createOptions(inputPlace, data);
}

function createNotChosen(ind) {
  const notChosen = new Option("Не выбран");
  notChosen.classList.add("selected");
  notChosen.setAttribute("data-parent", ind);
  notChosen.setAttribute("data-name", "NotChosen");
  return notChosen;
}
