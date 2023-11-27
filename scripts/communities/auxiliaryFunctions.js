import { onElement, offElement } from "../main.js";
import {
  postCreateCheck,
  subscribeUser,
  unsubscribeUser,
} from "../requestConsts.js";

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
      console.log("Success:", data);
    })
    .catch((error) => {
      if (error === 400) {
        unsubscribe(communityId);
      } else {
        console.error("Error:", error);
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
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

export function unlockButtons(data, curCommunity, token) {
  const subscribeButton = curCommunity.querySelector("#subscribe");
  const unsubscribeButton = curCommunity.querySelector("#unsubscribe");
  const addPostButton = curCommunity.querySelector("#addPost");

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
    }
  } else if (data == "Subscriber") {
    if (unsubscribeButton) {
      onElement(unsubscribeButton);
    }
  } else if (data == "Administrator") {
    if (addPostButton) {
      onElement(addPostButton);
    }
  }
}
