// const body = document.querySelector("body");

// // const url = aw

// const form = document.getElementById("link-form");

// console.log(form);
// const onPlay = (event: SubmitEvent) => {
//   console.log("Click!");
// };

// form?.addEventListener("submit", onPlay);

const getActiveTabUrl = async () => {
  const tabs = await chrome.tabs.query({
    currentWindow: true,
    active: true,
  });

  return tabs[0];
};

function showErrorMessage(msg: string) {
  const errElement = document.getElementById("error-msg");
  if (errElement) {
    errElement.innerHTML = "Invalid link";
  }
}

function resetErrorMessage() {
  const errElement = document.getElementById("error-msg");
  if (errElement) {
    errElement.innerHTML = "";
  }
}

async function fetchTracksFromPlaylistId(id: string) {
  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${id}/tracks`,
    {
      headers: {
        Authorization: `Bearer db8acc0352da454fbe2261fd595d4ce9`,
      },
    }
  );
  const data = response.json();
  return data;
}

async function onPlay(event: SubmitEvent) {
  event.preventDefault();
  const data = new FormData(event.target as HTMLFormElement);
  const link = data.get("link") as string;

  if (link && link.trim() !== "") {
    const playlistRegex = /open\.spotify\.com\/playlist\/([a-zA-Z0-9]+)\?/;

    const match = link.match(playlistRegex);

    if (match && match[1]) {
      resetErrorMessage();
      const playlistId = match[1];
      console.log(playlistId);
      const tracks = await fetchTracksFromPlaylistId(playlistId);
      console.log(tracks);
    } else {
      showErrorMessage("Invalid Link.");
    }

    // https://open.spotify.com/playlist/37i9dQZF1E8M2SNoAXyFBU?si=e4e2e17e11d04a72
  } else {
    showErrorMessage("Please enter a link.");
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const activeTab = await getActiveTabUrl();
  if (!activeTab.url?.includes("youtube.com")) {
    const body = document.querySelector("body");
    if (body) {
      body.innerHTML = `<h2> Please open youtube to play spotify playlist</h2>`;
    }
    return;
  }

  const form = document.getElementById("link-form");
  form?.addEventListener("submit", onPlay);
});
