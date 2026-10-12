// Runs on every page after login: blocks access if not logged in
if (localStorage.getItem("loggedIn") !== "true") {
  window.location.href = "login.html";
}

function logout() {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("userName");
  window.location.href = "login.html";
}

// highlight the current page's link in the navbar
const currentPage = window.location.pathname.split("/").pop();
document.querySelectorAll(".navbar a").forEach(link => {
  if (link.getAttribute("href") === currentPage) link.classList.add("active");
});

// show the logged-in user's name next to the logout button
const logoutBtn = document.querySelector(".navbar button");
if (logoutBtn) {
  const chip = document.createElement("span");
  chip.className = "user-chip";
  chip.innerText = "Hi, " + (localStorage.getItem("userName") || "User");
  logoutBtn.parentNode.insertBefore(chip, logoutBtn);
}