// You can add this to your existing JavaScript file
const loginMenuItem = document.getElementById("loginMenuItem");
const profileMenu = document.getElementById("profileMenu");
const profileIcon = document.getElementById("profileIcon");
const profileDropdown = document.getElementById("profileDropdown");
const logoutBtn = document.getElementById("logoutBtn");

const token = localStorage.authToken;
if (token) {
  showProfileUI("P");
}

function showProfileUI(name = "U") {
  loginMenuItem.style.display = "none";
  profileMenu.style.display = "inline-block";
  profileIcon.textContent = name[0].toUpperCase();
}

// Show/hide dropdown
if (profileIcon) {
  profileIcon.addEventListener("click", () => {
    profileDropdown.style.display =
      profileDropdown.style.display === "block" ? "none" : "block";
  });
}

// Logout functionality
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    window.location.href = "/views/login.html";
  });
}

document.addEventListener("DOMContentLoaded", function () {
  // Current year for copyright
  const yearSpan = document.querySelector(".footer-bottom p");
  if (yearSpan) {
    yearSpan.innerHTML = yearSpan.innerHTML.replace(
      "2025",
      new Date().getFullYear()
    );
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll(".footer-links a").forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop,
          behavior: "smooth",
        });
      }
    });
  });
});

function cardClicked(title) {
  alert(`You clicked on: ${title}`);
}
