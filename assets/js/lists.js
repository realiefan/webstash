document.addEventListener("DOMContentLoaded", () => {
  // Load links from localStorage or add defaults
  loadLinks();

  // Attach event listener for toggleDeleteButtons
});

function openLinkAddingDialog() {
  document.getElementById("linkAddingDialog").showModal();
}

function closeLinkAddingDialog() {
  document.getElementById("linkAddingDialog").close();
}

function addLink() {
  const title = document.getElementById("newLinkTitle").value;
  const url = document.getElementById("newLinkURL").value;

  if (title && url) {
    const links = JSON.parse(localStorage.getItem("links")) || [];

    // Check for duplicate links
    const isDuplicate = links.some(
      (link) => link.title === title || link.url === url
    );
    if (isDuplicate) {
      alert("This link already exists.");
      return;
    }

    links.push({ title, url });
    localStorage.setItem("links", JSON.stringify(links));

    const linkContainer = document.getElementById("linksContainer");

    const linkDiv = createLinkContainer({ title, url });

    linkContainer.appendChild(linkDiv);

    // Clear input fields
    document.getElementById("newLinkTitle").value = "";
    document.getElementById("newLinkURL").value = "";

    // Close the modal
    closeLinkAddingDialog();
  } else {
    alert("Please enter both link title and URL");
  }
}

function createLinkContainer(link) {
  const linkDiv = document.createElement("div");
  linkDiv.className = "link-container";

  const linkButton = document.createElement("mainButton");
  linkButton.textContent = link.title;
  linkButton.className = "mainButton";

  linkButton.addEventListener("click", () => {
    window.location.href = link.url;
  });

  linkDiv.appendChild(linkButton);

  return linkDiv;
}

function loadLinks() {
  const linkContainer = document.getElementById("linksContainer");
  let links = JSON.parse(localStorage.getItem("links")) || [];

  // If localStorage is empty, add default links
  if (links.length === 0) {
    const defaultLinks = [
      {
        id: "bard-embed",
        url: "https://bard.google.com/",
        title: "Bard",
        active: false,
      },
      {
        id: "chatgpt-embed",
        url: "https://chat.openai.com/",
        title: "ChatGPT",
        active: false,
      },
      {
        id: "habla-embed",
        url: "https://habla.news/",
        title: "Habla",
        active: false,
      },
      {
        id: "perplexity-embed",
        url: "https://www.perplexity.ai/",
        title: "Perplexity",
        active: false,
      },
      {
        id: "archive-embed",
        url: "https://archive.org/",
        title: "Archive",
        active: false,
      },
      {
        id: "nostrbuild-embed",
        url: "https://nostr.build/",
        title: "Nostr.Build",
        active: false,
      },
      {
        id: "nostrband-embed",
        url: "https://nostr.band/",
        title: "Nostr.Band",
        active: false,
      },

      {
        id: "nostrudel-embed",
        url: "https://nostrudel.ninja/",
        title: "noStrudel",
        active: false,
      },
      {
        id: "primal-embed",
        url: "https://primal.net/home",
        title: "Primal",
        active: false,
      },
      {
        id: "satellite-embed",
        url: "https://satellite.earth/",
        title: "Satellite",
        active: false,
      },
      {
        id: "snort-embed",
        url: "https://snort.social/notes",
        title: "Snort",
        active: false,
      },
      {
        id: "stacker-embed",
        url: "https://stacker.news/",
        title: "Stacker",
        active: false,
      },
      {
        id: "stemstr-embed",
        url: "https://www.stemstr.app/",
        title: "Stemstr",
        active: false,
      },
      {
        id: "oddbean-embed",
        url: "https://oddbean.com/",
        title: "Oddbean",
        active: false,
      },
      {
        id: "zapstream-embed",
        url: "https://zap.stream/",
        title: "Zap.Stream",
        active: false,
      },
      {
        id: "zaplife-embed",
        url: "https://zaplife.lol/",
        title: "Zaplife",
        active: false,
      },
    ];

    links = defaultLinks;
    localStorage.setItem("links", JSON.stringify(defaultLinks));
  }

  // Sort links alphabetically by title
  links.sort((a, b) => a.title.localeCompare(b.title));

  links.forEach((link) => {
    const linkDiv = createLinkContainer(link);
    linkContainer.appendChild(linkDiv);
  });
}
