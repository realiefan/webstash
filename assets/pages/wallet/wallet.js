document.addEventListener("DOMContentLoaded", () => {
  const saveWalletButton = document.getElementById("saveWallet");

  // Attach event listener for Save Wallet button
  saveWalletButton.addEventListener("click", saveWallet);

  // Attach event listeners for Open Wallet buttons
  const openWalletButtons = document.querySelectorAll(".openWalletButton");
  openWalletButtons.forEach((button) => {
    button.addEventListener("click", openWallet);


    fetchWalletBalance();
  });

  // Attach event listener for Login button
  const loginButton = document.getElementById("loginButton");
  loginButton.addEventListener("click", openModal);

  // Attach event listener for Close button in the modal
  const closeModalButton = document.querySelector(".close");
  closeModalButton.addEventListener("click", closeModal);
});

function openModal() {
  const walletModal = document.getElementById("walletModal");
  const walletIdInput = document.getElementById("walletId");
  const walletLinkInput = document.getElementById("walletLink");

  const storedWalletData = localStorage.getItem("walletData");

  if (storedWalletData) {
    const walletData = JSON.parse(storedWalletData);

    // Autofill input fields with wallet data
    walletIdInput.value = walletData.walletId;
    walletLinkInput.value = walletData.walletLink;
  } else {
    // Clear input fields if no wallet data is available
    walletIdInput.value = "";
    walletLinkInput.value = "";
  }

  walletModal.style.display = "block";
}


function closeModal() {
  const walletModal = document.getElementById("walletModal");
  walletModal.style.display = "none";
}

function saveWallet() {
  const walletId = document.getElementById("walletId").value;
  const walletLink = document.getElementById("walletLink").value;

  if (walletId && walletLink) {
    const walletData = { walletId, walletLink };
    localStorage.setItem("walletData", JSON.stringify(walletData));
    alert("Wallet details saved!");

    // Close the modal after saving
    closeModal();
  } else {
    alert("Please enter both Wallet ID and Wallet Link.");
  }
}

function openWallet(buttonType) {
  const storedWalletData = localStorage.getItem("walletData");

  if (storedWalletData) {
    const walletData = JSON.parse(storedWalletData);

    switch (buttonType) {
      case "connect":
        window.open(
          walletData.walletLink.replace("wallet", "lndhub"),
          "_blank"
        );
        break;
      case "paywall":
        window.open(
          walletData.walletLink.replace("wallet", "paywall"),
          "_blank"
        );
        break;
      case "market":
        window.open(
          walletData.walletLink.replace("wallet", "market"),
          "_blank"
        );
        break;
      case "vouchers":
        window.open(
          walletData.walletLink.replace("wallet", "vouchers"),
          "_blank"
        );
        break;
      case "splitpayments":
        window.open(
          walletData.walletLink.replace("wallet", "splitpayments"),
          "_blank"
        );
        break;
      case "withdraw":
        window.open(
          walletData.walletLink.replace("wallet", "withdraw/"),
          "_blank"
        );
        break;
      case "cashu":
        window.open(walletData.walletLink.replace("wallet", "cashu"), "_blank");
        break;
    }
  } else {
    alert("No wallet details found. Save wallet details first.");
  }
}


async function fetchWalletBalance() {
  const storedWalletData = localStorage.getItem("walletData");

  if (storedWalletData) {
    const walletData = JSON.parse(storedWalletData);
    const apiKey = walletData.walletId;

    try {
      const response = await fetch("https://pay.zapit.live/api/v1/wallet", {
        method: "GET",
        headers: {
          "X-Api-Key": apiKey,
        },
      });

      if (response.ok) {
        const { balance } = await response.json();
        const formattedBalance = Math.floor(balance / 1000); // Divide and round down

        // Update the balance element in the HTML
        const walletBalanceElement = document.getElementById("walletBalance");
        walletBalanceElement.textContent = formattedBalance;
      } else {
        console.error("Error fetching wallet balance.");
      }
    } catch (error) {
      console.error("Error fetching wallet balance:", error.message);
    }
  } else {
    console.error("No wallet details found. Save wallet details first.");
  }
}
