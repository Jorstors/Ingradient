document.addEventListener("DOMContentLoaded", () => {
  const userIsAuthenticated = false; // Replace with actual check

  if (userIsAuthenticated) {
    console.log("User is authenticated, redirecting to search page");
    window.location.href = "/src/Search/search.html";
  } else {
    console.log("User is not authenticated, redirecting to credentials page");
    window.location.href = "/src/Search/search.html"; // For now, until we have a working login page
  }
});
