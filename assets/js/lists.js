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

  const linkButton = document.createElement("button");
  linkButton.textContent = link.title;
  linkButton.className = "mainButton";

  linkButton.addEventListener("click", () => {
    window.location.href = link.url;
  });

  linkDiv.appendChild(linkButton);

  // Fetch icon and append it to the link container
  fetchIcon(link.url)
    .then((iconURL) => {
      const icon = document.createElement("img");
      icon.src = iconURL;
      icon.alt = `${link.title} Icon`;
      icon.className = "link-icon";
      linkDiv.insertBefore(icon, linkButton); // Insert icon before the button
    })
    .catch((error) => {
      console.error("Error fetching icon:", error);
    });

  return linkDiv;
}

function fetchIcon(url) {
  const urlWithoutProtocol = url.replace(/^https?:\/\//, ""); // Remove "https://" or "http://"
  const iconURL = `https://icon.horse/icon/${urlWithoutProtocol}`;
  return Promise.resolve(iconURL);
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
        id: "zaplife-embed",
        url: "https://zaplife.lol/",
        title: "Zaplife",
        active: false,
      },
      { title: "DuckDuckGo", url: "https://start.duckduckgo.com/" },
      { title: "NostrSync", url: "https://nostrsync.live/" },
      { title: "Hacker News", url: "https://news.ycombinator.com/" },
      { title: "LLM model", url: "https://labs.perplexity.ai/" },
      { title: "Brave", url: "https://search.brave.com/" },
      { title: "X", url: "https://twitter.com/" },
      { title: "Reddit", url: "https://www.reddit.com/" },
      { title: "Wormhole", url: "https://wormhole.app/" },
      { title: "GitHub", url: "https://github.com/" },
      { title: "Memo Ai", url: "https://www.recordergo.app/" },
      { title: "Wikipedia", url: "https://wikipedia.org/" },
      { title: "Ontolo", url: "https://www.ontolo.social/" },
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
