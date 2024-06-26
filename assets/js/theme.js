document.getElementById("themeButton").addEventListener("click", function () {
  // Replace "your-link-here" with the actual link you want to open
  var iframeLink = "https://ai.iefan.tech/";

  // Create an iframe element
  var iframe = document.createElement("iframe");

  // Set the iframe source to the specified link
  iframe.src = iframeLink;

  // Set the iframe to be full-screen
  iframe.style.width = "100%";
  iframe.style.height = "100%";

  // Set the iframe to allow microphone and speech access
  iframe.allow = "microphone; speech;";

  // Append the iframe to the body
  document.body.appendChild(iframe);
});
