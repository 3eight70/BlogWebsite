import { getUsersCommunities, getInfoCommunity } from "../requestConsts.js";
import { getRequest } from "../templateRequests.js";

const groupIdPost = localStorage.getItem("groupId");
let countOfOptions = 0;
let amountOfOptions = 0;

export async function getGroups() {
  const groups = document.getElementById("groupSelect");
  const token = localStorage.getItem("JwtToken");

  getRequest(getUsersCommunities, getUserCommunities, token);

  function getUserCommunities(data) {
    amountOfOptions = data.length;

    data.forEach((community) => {
      getRequest(
        getInfoCommunity(community.communityId),
        handleResponse,
        token
      );
    });
  }

  function handleResponse(group) {
    var option = document.createElement("option");
    option.dataset.id = group.id;
    option.text = group.name;
    groups.add(option);
    countOfOptions += 1;

    if (countOfOptions == amountOfOptions) {
      checkGroup();
    }
  }
}

function checkGroup() {
  if (groupIdPost) {
    for (let i = 0; i < groupSelect.options.length; i++) {
      if (groupSelect.options[i].dataset.id === groupIdPost) {
        groupSelect.selectedIndex = i;
        break;
      }
    }
    localStorage.removeItem("groupId");
  }
}

getGroups();
