import { getUsersCommunities, getInfoCommunity } from "../requestConsts.js";
import { getRequest } from "../templateRequests.js";

function getGroups() {
  const groups = document.getElementById("groupSelect");
  let token = localStorage.getItem("JwtToken");

  getRequest(getUsersCommunities, getUserCommunities, token);

  function getUserCommunities(data) {
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
  }
}

getGroups();
