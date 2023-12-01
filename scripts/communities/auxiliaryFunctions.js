import { onElement, offElement } from "../main.js";
import {
  postCreateCheck,
  subscribeUser,
  unsubscribeUser,
  getProfile,
} from "../requestConsts.js";

let status;
const token = localStorage.getItem("JwtToken");

checkToken();

export function subscribe(communityId, token) {
  fetch(subscribeUser(communityId), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(communityId),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.status;
    })
    .then((data) => {
      location.reload();
    })
    .catch((error) => {
      if (error === 400) {
        unsubscribe(communityId);
      }
    });
}

export function unsubscribe(communityId, token) {
  fetch(unsubscribeUser(communityId), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(communityId),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.status;
    })
    .then((data) => {
      location.reload();
    });
}

export function unlockButtons(data, curCommunity, token) {
  const subscribeButton = curCommunity.querySelector("#subscribe");
  const unsubscribeButton = curCommunity.querySelector("#unsubscribe");
  const addPostButton = curCommunity.querySelector("#addPostAdmin");

  if (status != 401) {
    if (subscribeButton) {
      subscribeButton.addEventListener("click", function (event) {
        event.preventDefault();

        subscribe(curCommunity.dataset.id, token);

        onElement(unsubscribeButton);
        offElement(subscribeButton);
      });
    }

    if (unsubscribeButton) {
      unsubscribeButton.addEventListener("click", function (event) {
        event.preventDefault();

        unsubscribe(curCommunity.dataset.id, token);

        offElement(unsubscribeButton);
        onElement(subscribeButton);
      });
    }

    if (addPostButton) {
      addPostButton.addEventListener("click", function (event) {
        event.preventDefault();

        localStorage.setItem("groupId", curCommunity.dataset.id);
        window.location.href = postCreateCheck;
      });
    }

    if (data == null) {
      if (subscribeButton) {
        onElement(subscribeButton);
        if (addPostButton) {
          offElement(addPostButton);
        }
      }
    } else if (data == "Subscriber") {
      if (unsubscribeButton) {
        onElement(unsubscribeButton);
        if (addPostButton) {
          offElement(addPostButton);
        }
      }
    } else if (data == "Administrator") {
      if (addPostButton) {
        onElement(addPostButton);
      }
    }
  }
}

export function checkFilters(data, filters) {
  if (filters) {
    if (data == null && filters.dataset.closed == "true") {
      filters.classList.add("d-none");
    }
  }
}

function checkToken() {
  fetch(getProfile, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + token,
    },
  }).then((response) => {
    status = response.status;

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  });
}
