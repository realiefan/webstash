document.addEventListener("DOMContentLoaded", () => {
  // Load links from localStorage
  loadLinks();

  // Attach event listener for toggleDeleteButtons
  document
    .getElementById("toggleDeleteButton")
    .addEventListener("click", toggleDeleteButtons);
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

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "X";
  deleteButton.className = "delete-button"; // Initially hidden

  const links = JSON.parse(localStorage.getItem("links")) || [];

  linkButton.addEventListener("click", () => {
    window.location.href = link.url;
  });

  deleteButton.addEventListener("click", () => {
    const updatedLinks = links.filter(
      (l) => !(l.title === link.title && l.url === link.url)
    );
    localStorage.setItem("links", JSON.stringify(updatedLinks));
    linkDiv.remove();
  });

  linkDiv.appendChild(linkButton);
  linkDiv.appendChild(deleteButton);

  return linkDiv;
}

function loadLinks() {
  const linkContainer = document.getElementById("linksContainer");
  let links = JSON.parse(localStorage.getItem("links")) || [];

  // Sort the links alphabetically by title
  links.sort((a, b) => a.title.localeCompare(b.title));

  links.forEach((link) => {
    const linkDiv = createLinkContainer(link);
    linkContainer.appendChild(linkDiv);
  });
}

function toggleDeleteButtons() {
  const deleteButtons = document.querySelectorAll(".delete-button");
  deleteButtons.forEach((button) => {
    button.classList.toggle("hidden-button");
  });
}

function goHome() {
  const homeLink = "/index.html";
  window.location.href = homeLink;
}
